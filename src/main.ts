import { createBootstrapOptions } from '@choewy/nestjs-bootstrap';
import { WinstonLoggerFactory } from '@choewy/nestjs-winston';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const bootstrapOptions = createBootstrapOptions();
  const loggerFactory = new WinstonLoggerFactory({ name: 'g2b' });
  const logger = loggerFactory.create({ fileLevel: ['verbose', 'warn', 'error'] });

  const app = await NestFactory.create(AppModule, { logger });

  app.useGlobalInterceptors(...bootstrapOptions.interceptors);
  app.useGlobalPipes(...bootstrapOptions.pipes);
  app.useGlobalFilters(...bootstrapOptions.filters);

  await app.listen(3000);
}
bootstrap();
