import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigFactory } from './config/config.factory';
import { json, urlencoded } from 'express';
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
  app.enableCors(configFactory.corsOptions);
  app.useGlobalFilters(new AppFilter());

  await app.listen(4000);
}
bootstrap();
