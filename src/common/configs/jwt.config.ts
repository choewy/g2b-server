import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const JWT_CONFIG = '__JWT_CONFIG__';
export const JwtConfig = registerAs(
  JWT_CONFIG,
  (): JwtModuleOptions => ({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1d' },
  }),
);
