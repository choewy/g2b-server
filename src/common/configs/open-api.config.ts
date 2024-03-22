import { registerAs } from '@nestjs/config';

import { OpenApiOption } from './interfaces';

export const OPEN_API_CONFIG = '__OPEN_API_CONFIG__';
export const OpenApiConfig = registerAs(
  OPEN_API_CONFIG,
  (): OpenApiOption => ({
    apiKey: process.env.OPEN_API_KEY,
    bidsUrl: `${process.env.OPEN_API_URL}/BidPublicInfoService${process.env.OPEN_API_VERSION}`,
    hrcsUrl: `${process.env.OPEN_API_URL}/HrcspSsstndrdInfoService`,
  }),
);
