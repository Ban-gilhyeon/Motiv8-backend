export type ProfileStats = {
  readonly shoulder: number;
  readonly arm: number;
  readonly chest: number;
  readonly back: number;
  readonly abs: number;
  readonly lowerBody: number;
  readonly endurance: number;
  readonly passion: number;
};

export type ProfileProps = ProfileStats & {
  readonly id: string;
  readonly userId: string;
  readonly totalExperience: number;
  readonly level: number;
  readonly firstWorkoutAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

export class Profile {
  private constructor(readonly props: ProfileProps) {}

  static create(props: Pick<ProfileProps, "id" | "userId">): Profile {
    const now = new Date();
    return new Profile({ ...props, totalExperience: 0, level: 1, shoulder: 0, arm: 0, chest: 0, back: 0, abs: 0, lowerBody: 0, endurance: 0, passion: 0, firstWorkoutAt: null, createdAt: now, updatedAt: now });
  }

  static restore(props: ProfileProps): Profile { return new Profile(props); }
}
