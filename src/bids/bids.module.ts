import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { BidsService } from './bids.service';

@Module({
  imports: [HttpModule],
  providers: [BidsService],
  exports: [BidsService],
})
export class BidsModule {}
