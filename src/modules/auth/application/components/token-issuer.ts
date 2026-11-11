import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { createHash } from "node:crypto";

export type AuthTokens = {
  readonly accessToken: string;
  readonly refreshToken: string;
};

@Injectable()
export class TokenIssuer {
  constructor(private readonly jwtService: JwtService) {}

  async issue(userId: string): Promise<AuthTokens> {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId },
      { expiresIn: "15m" },
    );
    const refreshToken = await this.jwtService.signAsync(
      { sub: userId, type: "refresh" },
      {
        expiresIn: "30d",
        secret: process.env.JWT_REFRESH_SECRET ?? "development-refresh-secret",
      },
    );

    return { accessToken, refreshToken };
  }

  verifyRefreshToken(token: string): { userId: string } {
    const payload = this.jwtService.verify<{ sub: string }>(token, {
      secret: process.env.JWT_REFRESH_SECRET ?? "development-refresh-secret",
    });
    return { userId: payload.sub };
  }

  hashRefreshToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  refreshTokenExpiresAt(): Date {
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
}
