export class ProfileStatsResponse {
  shoulder!: number;
  arm!: number;
  chest!: number;
  back!: number;
  abs!: number;
  lowerBody!: number;
  endurance!: number;
  passion!: number;
}

export class ProfileResponse {
  userId!: string;
  totalExperience!: number;
  level!: number;
  stats!: ProfileStatsResponse;
}
