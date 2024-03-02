import { Injectable } from '@nestjs/common';
import { DiskHealthIndicator, HealthCheck, HealthCheckService, MemoryHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';

import { PingHealthIndicator } from './indicators/ping-health.indicator';

@Injectable()
export class HealthService {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly typeOrmHealthIndicator: TypeOrmHealthIndicator,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
    private readonly diskHealthIndicator: DiskHealthIndicator,
    private readonly pingHealthIndicator: PingHealthIndicator,
  ) {}

  @HealthCheck({ swaggerDocumentation: true })
  check() {
    return this.healthCheckService.check([
      () => this.pingHealthIndicator.pingCheck('nestjs-docs', 'https://nestjs.com/'),
      () => this.typeOrmHealthIndicator.pingCheck('database', { timeout: 15000 }),
      () => this.memoryHealthIndicator.checkHeap('memory_heap', 1000 * 1024 * 1024),
      () => this.memoryHealthIndicator.checkRSS('memory_RSS', 1000 * 1024 * 1024),
      () => this.diskHealthIndicator.checkStorage('disk_health', { thresholdPercent: 10, path: '/' }),
    ]);
  }
}
