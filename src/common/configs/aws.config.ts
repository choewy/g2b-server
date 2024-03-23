import { registerAs } from '@nestjs/config';

import { AwsOption } from './interfaces';

export const AWS_CONFIG = '__AWS_CONFIG__';
export const AwsConfig = registerAs(
  AWS_CONFIG,
  (): AwsOption => ({
    client: {
      region: process.env.AWS_REGION,
      credentials: {
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        accessSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    },
    s3: {
      bucket: process.env.AWS_S3_BUCKET,
    },
  }),
);
