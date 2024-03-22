import { ExcelEntity } from '@common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExcelEntity])],
  controllers: [ExcelController],
  providers: [ExcelService],
})
export class ExcelModule {}
