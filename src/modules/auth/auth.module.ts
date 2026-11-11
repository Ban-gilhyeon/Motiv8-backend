import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./application/auth.service";
import { PasswordHasher } from "./application/components/password-hasher";
import { TokenIssuer } from "./application/components/token-issuer";
import { AuthController } from "./presentation/auth.controller";
import {
  USER_REPOSITORY,
} from "./domain/repositories/user-repository.port";
import { REFRESH_TOKEN_REPOSITORY } from "./domain/repositories/refresh-token-repository.port";
import { PrismaService } from "./infrastructure/prisma/prisma.service";
import { PrismaUserRepository } from "./infrastructure/prisma/prisma-user.repository";
import { PrismaRefreshTokenRepository } from "./infrastructure/prisma/prisma-refresh-token.repository";
import { JwtStrategy } from "./infrastructure/jwt/jwt.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET ?? "development-access-secret",
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordHasher,
    TokenIssuer,
    JwtStrategy,
    PrismaService,
    PrismaUserRepository,
    PrismaRefreshTokenRepository,
    { provide: USER_REPOSITORY, useExisting: PrismaUserRepository },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useExisting: PrismaRefreshTokenRepository,
    },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
