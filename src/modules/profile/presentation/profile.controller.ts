import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard";
import { ProfileService } from "../application/profile.service";
import { ProfileResponse } from "./dto/profile.response";

@Controller("api/v1/profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async find(@CurrentUser() user: AuthenticatedUser): Promise<ProfileResponse> {
    const profile = await this.profileService.findByUserId(user.userId);
    return { userId: profile.props.userId, totalExperience: profile.props.totalExperience, level: profile.props.level, stats: { shoulder: profile.props.shoulder, arm: profile.props.arm, chest: profile.props.chest, back: profile.props.back, abs: profile.props.abs, lowerBody: profile.props.lowerBody, endurance: profile.props.endurance, passion: profile.props.passion } };
  }
}
