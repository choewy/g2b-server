import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { NodeEnv } from './enums';

export const TYPEORM_CONFIG = '__TYPEORM_CONFIG__';
export const TypeOrmConfig = registerAs(
  TYPEORM_CONFIG,
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.TYPEORM_HOST,
    port: +process.env.TYPEORM_PORT,
    database: process.env.TYPEORM_DATABASE,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    synchronize: process.env.NODE_ENV === NodeEnv.Local ? process.env.TYPEORM_SYNC === 'true' : false,
    autoLoadEntities: true,
    entities: [process.env.PWD + '/dist/**/*.entity.js'],
    logging: ['error', 'warn'],
  }),
);
