import { DynamicModule, Module } from '@nestjs/common';

import { JwtService } from './jwt.service';
import { JwtGuard } from './jwt.guard';

@Module({
  providers: [JwtService, JwtGuard],
  exports: [JwtService, JwtGuard],
})
export class JwtModule {
  static forRoot(): DynamicModule {
    return {
      module: JwtModule,
      global: true,
    };
  }
}
