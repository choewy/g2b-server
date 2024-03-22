import { ExcelEntity } from '@common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExcelEventHandler } from './excel-event.handler';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExcelEntity])],
  controllers: [ExcelController],
  providers: [ExcelService, ExcelEventHandler],
})
export class ExcelModule {}
