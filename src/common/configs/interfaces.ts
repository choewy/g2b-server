import { ListenOptions } from 'net';

import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

import { NodeEnv } from './enums';

export interface SystemOption {
  nodeEnv: NodeEnv;
  processId: string;
}

export interface ServerOption {
  id: string;
  listen: ListenOptions;
  cors: CorsOptions;
}

export interface AwsClientOption {
  region: string;
  credentials: {
    region: string;
    accessKeyId: string;
    accessSecretKey: string;
  };
}

export interface AwsS3Option {
  bucket: string;
}

export interface AwsOption {
  client: AwsClientOption;
  s3: AwsS3Option;
}

export interface OpenApiOption {
  apiKey: string;
  bidsUrl: string;
  hrcsUrl: string;
}
