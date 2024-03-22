import { KeywordType } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class GetKeywordsQuery {
  @ApiProperty({ type: String, enum: KeywordType })
  @IsEnum(KeywordType)
  type: KeywordType;
}
