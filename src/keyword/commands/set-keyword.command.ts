import { KeywordType } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, MinLength } from 'class-validator';

export class SetKeywordCommand {
  @ApiProperty({ type: String, enum: KeywordType })
  @IsEnum(KeywordType)
  type: KeywordType;

  @ApiProperty({ type: String })
  @MinLength(1)
  text: string;
}
