import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "../application/auth.service";
import { LoginRequest } from "./dto/login.request";
import { RefreshTokenRequest } from "./dto/refresh-token.request";
import { SignupRequest } from "./dto/signup.request";
import { UserResponse } from "./dto/user.response";
import { CurrentUser } from "../../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard";

@Controller("api/v1/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  signup(@Body() request: SignupRequest) {
    return this.authService.signup(request);
  }

  @Post("login")
  login(@Body() request: LoginRequest) {
    return this.authService.login(request);
  }

  @Post("refresh")
  refresh(@Body() request: RefreshTokenRequest) {
    return this.authService.refresh(request);
  }

  @Post("logout")
  logout(@Body() request: RefreshTokenRequest) {
    return this.authService.logout(request);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async me(@CurrentUser() user: AuthenticatedUser): Promise<UserResponse> {
    const currentUser = await this.authService.findUserById(user.userId);
    return {
      id: currentUser.props.id,
      email: currentUser.props.email,
      nickname: currentUser.props.nickname,
    };
  }
}
