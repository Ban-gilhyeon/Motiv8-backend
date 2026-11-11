export type UserProps = {
  readonly id: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly nickname: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

export class User {
  private constructor(readonly props: UserProps) {}

  static restore(props: UserProps): User {
    return new User(props);
  }

  static create(props: Omit<UserProps, "createdAt" | "updatedAt">): User {
    const now = new Date();
    return new User({ ...props, createdAt: now, updatedAt: now });
  }
}
