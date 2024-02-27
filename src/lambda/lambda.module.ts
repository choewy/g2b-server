import { Module } from '@nestjs/common';

import { LambdaController } from './lambda.controller';

@Module({
  controllers: [LambdaController],
  providers: [],
})
export class LambdaModule {}
