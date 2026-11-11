export class AuthResponse {
  accessToken!: string;
  refreshToken!: string;
  user!: {
    id: string;
    email: string;
    nickname: string;
  };
}
