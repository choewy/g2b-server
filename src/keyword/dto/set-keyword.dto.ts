import { IsEnum, IsNotEmpty } from 'class-validator';

import { KeywordType } from '../entities/enums';
import { ApiProperty } from '@nestjs/swagger';

export class SetKeywordDto {
  @ApiProperty({ type: String, enum: KeywordType })
  @IsNotEmpty()
  @IsEnum(KeywordType)
  type: KeywordType;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  text: string;
}
