import { Injectable } from "@nestjs/common";
import { Profile } from "../../domain/entities/profile.entity";
import type { ProfileRepositoryPort } from "../../domain/repositories/profile-repository.port";
import { PrismaService } from "../../../auth/infrastructure/prisma/prisma.service";

@Injectable()
export class PrismaProfileRepository implements ProfileRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<Profile | null> {
    const record = await this.prisma.profile.findUnique({ where: { userId } });
    return record ? Profile.restore(record) : null;
  }

  async save(profile: Profile): Promise<Profile> {
    const record = await this.prisma.profile.create({ data: profile.props });
    return Profile.restore(record);
  }

  async addExperience(profileId: string, amount: number, sourceType: string, sourceId: string): Promise<Profile | null> {
    try {
      const record = await this.prisma.$transaction(async (transaction) => {
        await transaction.experienceHistory.create({ data: { profileId, amount, sourceType, sourceId } });
        return transaction.profile.update({ where: { id: profileId }, data: { totalExperience: { increment: amount } } });
      });
      return Profile.restore(record);
    } catch (error) {
      if (this.isUniqueConstraintError(error)) return this.findById(profileId);
      throw error;
    }
  }

  async updateLevel(profileId: string, level: number): Promise<Profile> {
    await this.prisma.profile.updateMany({ where: { id: profileId, level: { lt: level } }, data: { level } });
    const record = await this.prisma.profile.findUniqueOrThrow({ where: { id: profileId } });
    return Profile.restore(record);
  }

  private async findById(id: string): Promise<Profile | null> {
    const record = await this.prisma.profile.findUnique({ where: { id } });
    return record ? Profile.restore(record) : null;
  }

  private isUniqueConstraintError(error: unknown): boolean {
    return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
  }
}
