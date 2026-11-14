import { Module } from "@nestjs/common";
import { ProfileService } from "./application/profile.service";
import { PROFILE_REPOSITORY } from "./domain/repositories/profile-repository.port";
import { PrismaProfileRepository } from "./infrastructure/prisma/prisma-profile.repository";
import { ProfileController } from "./presentation/profile.controller";
import { PrismaModule } from "../../common/database/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [ProfileController],
  providers: [ProfileService, PrismaProfileRepository, { provide: PROFILE_REPOSITORY, useExisting: PrismaProfileRepository }],
  exports: [ProfileService],
})
export class ProfileModule {}
