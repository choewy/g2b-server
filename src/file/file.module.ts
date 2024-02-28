import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AwsModule } from 'src/aws/aws.module';

import { FileController } from './file.controller';
import { UploadedExcelFile } from './entities/uploaded-excel-file.entity';
import { GetMyExcelFilesQueryHandler } from './quries/handlers/get-my-excel-files.query.handler';
import { UploadSearchExcelFileEventHandler } from './events/handlers/upload-search-excel-file.event';

const QueryHandlers = [GetMyExcelFilesQueryHandler];
const EventHandlers = [UploadSearchExcelFileEventHandler];

@Module({
  imports: [TypeOrmModule.forFeature([UploadedExcelFile]), AwsModule],
  controllers: [FileController],
  providers: [...QueryHandlers, ...EventHandlers],
})
export class FileModule {}
