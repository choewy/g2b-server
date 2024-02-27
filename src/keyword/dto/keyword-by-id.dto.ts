import { IsInt, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class KeywordByIdDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsInt()
  id: number;
}
