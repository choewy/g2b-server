import { SearchEntity } from '@common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [TypeOrmModule.forFeature([SearchEntity])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
