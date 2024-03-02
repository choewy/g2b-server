import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';

import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { TerminusModule } from '@nestjs/terminus';
import { PingHealthIndicator } from './indicators/ping-health.indicator';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [HealthService, PingHealthIndicator],
})
export class HealthModule {}
