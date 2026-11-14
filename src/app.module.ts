import "dotenv/config";
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from "joi";
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { PrismaModule } from './common/database/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().uri({ scheme: ["postgresql"] }).required(),
        JWT_ACCESS_SECRET: Joi.string().min(16).required(),
        JWT_REFRESH_SECRET: Joi.string().min(16).required(),
      }),
    }),
    AuthModule,
    ProfileModule,
    PrismaModule,
  ],
})
export class AppModule {}
