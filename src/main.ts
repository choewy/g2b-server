import { createBootstrapOptions } from '@choewy/nestjs-bootstrap';
import { WinstonLoggerFactory } from '@choewy/nestjs-winston';
import { NodeEnv, SERVER_CONFIG, ServerOption, SYSTEM_CONFIG, SystemOption } from '@common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';

import { AppModule } from './app.module';

async function bootstrap() {
  const bootstrapOptions = createBootstrapOptions();
  const loggerFactory = new WinstonLoggerFactory({ name: 'g2b' });
  const logger = loggerFactory.create({ fileLevel: ['verbose', 'warn', 'error'] });

  const app = await NestFactory.create(AppModule, { logger });
  const config = app.get(ConfigService);
  const systemConfig = config.get<SystemOption>(SYSTEM_CONFIG);
  const serverConfig = config.get<ServerOption>(SERVER_CONFIG);

  if (systemConfig.nodeEnv === NodeEnv.Local) {
    const swaggerConfig = new DocumentBuilder().setTitle('G2B APIs').addCookieAuth('g2b_access_token');
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig.build());
    SwaggerModule.setup('/api-docs/swagger', app, swaggerDocument);

    const asyncApiConfig = new AsyncApiDocumentBuilder()
      .setTitle('G2B APIs')
      .setDefaultContentType('application/json')
      .addServer('search', {
        url: 'ws://127.0.0.1:4000/search',
        protocol: 'socket.io',
      });
    const asyncApiDocument = AsyncApiModule.createDocument(app, asyncApiConfig.build());
    await AsyncApiModule.setup('/api-docs/async', app, asyncApiDocument);
  }

  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(cookieParser());
  app.enableCors(serverConfig.cors);
  app.useGlobalInterceptors(...bootstrapOptions.interceptors);
  app.useGlobalPipes(...bootstrapOptions.pipes);
  app.useGlobalFilters(...bootstrapOptions.filters);
  app.useWebSocketAdapter(new IoAdapter(app));
  app.enableShutdownHooks();

  await app.listen(serverConfig.listen.port, serverConfig.listen.host);
}

bootstrap();
