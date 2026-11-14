import { Profile } from "../entities/profile.entity";

export const PROFILE_REPOSITORY = Symbol("PROFILE_REPOSITORY");

export interface ProfileRepositoryPort {
  findByUserId(userId: string): Promise<Profile | null>;
  save(profile: Profile): Promise<Profile>;
  addExperience(profileId: string, amount: number, sourceType: string, sourceId: string): Promise<Profile | null>;
  updateLevel(profileId: string, level: number): Promise<Profile>;
}
