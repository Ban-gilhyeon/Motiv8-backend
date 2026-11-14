import { Inject, Injectable } from "@nestjs/common";
import { User } from "../domain/entities/user.entity";
import { USER_REPOSITORY } from "../domain/repositories/user-repository.port";
import type { UserRepositoryPort } from "../domain/repositories/user-repository.port";
import { LoginRequest } from "../presentation/dto/login.request";
import { SignupRequest } from "../presentation/dto/signup.request";
import { AuthResponse } from "../presentation/dto/auth.response";
import { RefreshTokenRequest } from "../presentation/dto/refresh-token.request";
import { PasswordHasher } from "./components/password-hasher";
import { TokenIssuer } from "./components/token-issuer";
import {
  REFRESH_TOKEN_REPOSITORY,
} from "../domain/repositories/refresh-token-repository.port";
import type { RefreshTokenRepositoryPort } from "../domain/repositories/refresh-token-repository.port";
import { AuthException } from "../domain/errors/auth.exception";
import { ProfileService } from "../../profile/application/profile.service";

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenIssuer: TokenIssuer,
    private readonly profileService: ProfileService,
  ) {}

  async signup(request: SignupRequest): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw AuthException.userAlreadyExists();
    }

    const passwordHash = await this.passwordHasher.hash(request.password);
    const user = await this.userRepository.save(
      User.create({
        id: crypto.randomUUID(),
        email: request.email,
        passwordHash,
        nickname: request.nickname,
      }),
    );
    try {
      await this.profileService.createForUser(user.props.id);
      return await this.createAuthResponse(user);
    } catch (error) {
      await this.userRepository.deleteById(user.props.id);
      throw error;
    }
  }

  async login(request: LoginRequest): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(request.email);
    const isValid = user
      ? await this.passwordHasher.verify(user.props.passwordHash, request.password)
      : false;

    if (!user || !isValid) {
      throw AuthException.invalidCredentials();
    }

    return this.createAuthResponse(user);
  }

  async refresh(request: RefreshTokenRequest): Promise<AuthResponse> {
    let payload: { userId: string };
    try {
      payload = this.tokenIssuer.verifyRefreshToken(request.refreshToken);
    } catch {
      throw AuthException.invalidRefreshToken();
    }
    const storedToken = await this.refreshTokenRepository.findActiveByUserId(
      payload.userId,
    );
    const isValid = storedToken
      ? storedToken.tokenHash ===
        this.tokenIssuer.hashRefreshToken(request.refreshToken)
      : false;

    if (!storedToken || !isValid) {
      throw AuthException.invalidRefreshToken();
    }

    await this.refreshTokenRepository.revoke(storedToken.id);
    const user = await this.findUserById(payload.userId);
    return this.createAuthResponse(user);
  }

  async logout(request: RefreshTokenRequest): Promise<void> {
    let payload: { userId: string };
    try {
      payload = this.tokenIssuer.verifyRefreshToken(request.refreshToken);
    } catch {
      throw AuthException.invalidRefreshToken();
    }
    const storedToken = await this.refreshTokenRepository.findActiveByUserId(
      payload.userId,
    );

    if (storedToken) {
      await this.refreshTokenRepository.revoke(storedToken.id);
    }
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw AuthException.userNotFound();
    }
    return user;
  }

  private async createAuthResponse(user: User): Promise<AuthResponse> {
    const tokens = await this.tokenIssuer.issue(user.props.id);
    await this.refreshTokenRepository.save({
      userId: user.props.id,
      tokenHash: this.tokenIssuer.hashRefreshToken(tokens.refreshToken),
      expiresAt: this.tokenIssuer.refreshTokenExpiresAt(),
    });
    return {
      ...tokens,
      user: {
        id: user.props.id,
        email: user.props.email,
        nickname: user.props.nickname,
      },
    };
  }
}
