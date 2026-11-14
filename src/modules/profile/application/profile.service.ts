import { Inject, Injectable } from "@nestjs/common";
import { Profile } from "../domain/entities/profile.entity";
import { PROFILE_REPOSITORY } from "../domain/repositories/profile-repository.port";
import type { ProfileRepositoryPort } from "../domain/repositories/profile-repository.port";
import { LevelPolicy } from "./components/level-policy";
import { ProfileException } from "../domain/errors/profile.exception";

@Injectable()
export class ProfileService {
  constructor(@Inject(PROFILE_REPOSITORY) private readonly repository: ProfileRepositoryPort) {}

  async createForUser(userId: string): Promise<Profile> {
    return this.repository.save(Profile.create({ id: crypto.randomUUID(), userId }));
  }

  async findByUserId(userId: string): Promise<Profile> {
    const profile = await this.repository.findByUserId(userId);
    if (!profile) throw ProfileException.notFound();
    return profile;
  }

  async addExperience(userId: string, amount: number, sourceType: string, sourceId: string): Promise<Profile | null> {
    if (amount <= 0) throw ProfileException.experienceMustBePositive();
    const profile = await this.findByUserId(userId);
    const updated = await this.repository.addExperience(profile.props.id, amount, sourceType, sourceId);
    if (!updated) return profile;
    const level = LevelPolicy.levelFor(updated.props.totalExperience);
    const leveledProfile = await this.repository.updateLevel(updated.props.id, level);
    return Profile.restore(leveledProfile.props);
  }
}
