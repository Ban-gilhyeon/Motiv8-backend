import { Injectable } from "@nestjs/common";
import {
  RefreshTokenRecord,
  RefreshTokenRepositoryPort,
} from "../../domain/repositories/refresh-token-repository.port";
import { PrismaService } from "./prisma.service";

@Injectable()
export class PrismaRefreshTokenRepository implements RefreshTokenRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(
    record: Omit<RefreshTokenRecord, "id" | "revokedAt">,
  ): Promise<void> {
    await this.prisma.refreshToken.create({ data: record });
  }

  async findActiveByUserId(userId: string): Promise<RefreshTokenRecord | null> {
    return this.prisma.refreshToken.findFirst({
      where: {
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async revoke(id: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }
}
