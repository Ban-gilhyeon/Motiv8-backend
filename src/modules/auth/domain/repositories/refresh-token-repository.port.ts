export const REFRESH_TOKEN_REPOSITORY = Symbol("REFRESH_TOKEN_REPOSITORY");

export type RefreshTokenRecord = {
  readonly id: string;
  readonly userId: string;
  readonly tokenHash: string;
  readonly expiresAt: Date;
  readonly revokedAt: Date | null;
};

export interface RefreshTokenRepositoryPort {
  save(record: Omit<RefreshTokenRecord, "id" | "revokedAt">): Promise<void>;
  findActiveByUserId(userId: string): Promise<RefreshTokenRecord | null>;
  revoke(id: string): Promise<void>;
}
