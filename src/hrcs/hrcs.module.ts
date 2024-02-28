import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { HrcsService } from './hrcs.service';

@Module({
  imports: [HttpModule],
  providers: [HrcsService],
  exports: [HrcsService],
})
export class HrcsModule {}
