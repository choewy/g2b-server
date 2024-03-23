import { SearchType } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class GetSearchQuery {
  @ApiProperty({ type: String, enum: SearchType })
  @IsEnum(SearchType)
  type: SearchType;
}
