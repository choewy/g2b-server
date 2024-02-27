import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';

import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ConfigFactory } from './config/config.factory';
import { AppModule } from './app.module';
import { AppFilter } from './app.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configFactory = app.get(ConfigFactory);

  if (configFactory.isLocal) {
    const swaggerConfig = new DocumentBuilder().build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup('/swagger', app, swaggerDocument);
  }

  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(cookieParser());
  app.useWebSocketAdapter(new IoAdapter(app));
  app.enableCors(configFactory.corsOptions);
  app.useGlobalFilters(new AppFilter());

  await app.listen(4000);
}
bootstrap();
