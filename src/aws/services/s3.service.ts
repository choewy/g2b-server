import { v4 } from 'uuid';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { Injectable } from '@nestjs/common';

import { ConfigFactory } from 'src/config/config.factory';

@Injectable()
export class S3Service {
  constructor(private readonly configFactory: ConfigFactory) {}

  private get client(): S3Client {
    return new S3Client(this.configFactory.awsClientCredentials);
  }

  private createKey(path?: string): string {
    let key = [Date.now(), v4()].join('-');

    const objectPath = (path ?? '').replaceAll('/', '');

    if (objectPath) {
      key = `${objectPath}/${key}`;
    }

    return `${this.configFactory.nodeEnv}/${key}`;
  }

  async upload(buffer: Buffer, path?: string, mimetype?: string, filename?: string): Promise<string> {
    const key = this.createKey(path);

    const command = new PutObjectCommand({
      Key: key,
      Body: buffer,
      Bucket: this.configFactory.awsS3Bucket,
      ContentType: mimetype,
      ContentDisposition: filename ? `attachement; filename=${encodeURIComponent(filename)}` : undefined,
      ACL: 'private',
    });

    await this.client.send(command);

    return key;
  }

  async uploadExcelFile(buffer: Buffer, path?: string, filename?: string): Promise<string> {
    return this.upload(buffer, path, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', filename);
  }
}
