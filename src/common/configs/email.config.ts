import { registerAs } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const EMAIL_CONFIG = '__EMAIL_CONFIG__';

export const EmailConfig = registerAs(
  EMAIL_CONFIG,
  (): SMTPTransport.Options => ({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  }),
);
