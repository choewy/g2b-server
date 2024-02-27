import { ApiResponseProperty } from '@nestjs/swagger';

import { KeywordType } from '../entity/enums';
import { Keyword } from '../entity/keyword.entity';

export class KeywordDto {
  @ApiResponseProperty({ type: Number })
  id: number;

  @ApiResponseProperty({ type: String, enum: KeywordType })
  type: KeywordType;

  @ApiResponseProperty({ type: String })
  text: string;

  constructor(keyword: Keyword) {
    this.id = keyword.id;
    this.type = keyword.type;
    this.text = keyword.text;
  }
}
