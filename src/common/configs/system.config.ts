import { registerAs } from '@nestjs/config';
import { v4 } from 'uuid';

import { NodeEnv } from './enums';
import { SystemOption } from './interfaces';

export const SYSTEM_CONFIG = '__SYSTEM_CONFIG__';
export const SystemConfig = registerAs(
  SYSTEM_CONFIG,
  (): SystemOption => ({
    nodeEnv: process.env.NODE_ENV as NodeEnv,
    processId: v4(),
  }),
);
