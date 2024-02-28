import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AwsModule } from 'src/aws/aws.module';

import { UploadedExcelFile } from './entities/uploaded-excel-file.entity';
import { UploadSearchExcelFileEventHandler } from './events/handlers/upload-search-excel-file.event';

const EventHandlers = [UploadSearchExcelFileEventHandler];

@Module({
  imports: [TypeOrmModule.forFeature([UploadedExcelFile]), AwsModule],
  providers: [...EventHandlers],
})
export class FileModule {}
