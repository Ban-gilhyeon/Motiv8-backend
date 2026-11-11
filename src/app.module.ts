import "dotenv/config";
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';
import Joi from "joi";
import { AuthModule } from './modules/auth/auth.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

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
    // 분산 추적, 로그 연계, 요청·작업 메트릭, 오류 관측과 알림 기능을 제공한다.
    // 운영 환경에서 사용할 때 NestJS Observe 설정을 추가한다.
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'motiv8-backend',
    }),
  ],
})
export class AppModule {}
