import { registerAs } from '@nestjs/config';
import { v4 } from 'uuid';

import { ServerOption } from './interfaces';

export const SERVER_CONFIG = '__SERVER_CONFIG__';
export const ServerConfig = registerAs(
  SERVER_CONFIG,
  (): ServerOption => ({
    id: v4(),
    listen: {
      port: +(process.env.PORT ?? 3000),
      host: '::',
    },
    cors: {
      origin: new RegExp(process.env.CORS_ORIGIN),
      credentials: true,
    },
  }),
);
