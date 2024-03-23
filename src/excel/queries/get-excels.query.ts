import { SearchType } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class GetExcelsQuery {
  @ApiProperty({ type: String, enum: SearchType })
  @IsEnum(SearchType)
  type: SearchType;
}
