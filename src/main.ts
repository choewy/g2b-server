import { createBootstrapOptions } from '@choewy/nestjs-bootstrap';
import { WinstonLoggerFactory } from '@choewy/nestjs-winston';
import { SERVER_CONFIG, ServerOption } from '@common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';

import { AppModule } from './app.module';

async function bootstrap() {
  const bootstrapOptions = createBootstrapOptions();
  const loggerFactory = new WinstonLoggerFactory({ name: 'g2b' });
  const logger = loggerFactory.create({ fileLevel: ['verbose', 'warn', 'error'] });

  const app = await NestFactory.create(AppModule, { logger });
  const config = app.get(ConfigService);
  const serverConfig = config.get<ServerOption>(SERVER_CONFIG);

  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(cookieParser());
  app.enableCors(serverConfig.cors);
  app.useGlobalInterceptors(...bootstrapOptions.interceptors);
  app.useGlobalPipes(...bootstrapOptions.pipes);
  app.useGlobalFilters(...bootstrapOptions.filters);
  app.enableShutdownHooks();

  await app.listen(serverConfig.listen.port, serverConfig.listen.host);
}

bootstrap();
