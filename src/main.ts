import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';

import { NestFactory, Reflector } from '@nestjs/core';
import { BadRequestException, ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
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
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(new Reflector(), {
      enableCircularCheck: true,
      enableImplicitConversion: true,
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableCircularCheck: true,
        enableImplicitConversion: true,
      },
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        throw new BadRequestException(Object.values(errors.shift()?.constraints)?.pop(), {
          description: 'Validate Error',
        });
      },
    }),
  );

  await app.listen(4000);
}
bootstrap();
