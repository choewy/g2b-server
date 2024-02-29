import { IsEnum, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { KeywordType } from '../entities/enums';

export class GetKeywordsDto {
  @ApiProperty({ type: String, enum: KeywordType })
  @IsNotEmpty()
  @IsEnum(KeywordType)
  type: KeywordType;
}
