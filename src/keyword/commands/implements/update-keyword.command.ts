import { plainToInstance } from 'class-transformer';

import { KeywordType } from 'src/keyword/entities/enums';
import { Keyword } from 'src/keyword/entities/keyword.entity';

export class UpdateKeywordCommand {
  constructor(readonly userId: number, readonly id: number, readonly type: KeywordType, readonly text: string) {}

  toEntity() {
    return plainToInstance(Keyword, {
      id: this.id,
      user: { id: this.userId },
      type: this.type,
      text: this.text,
    });
  }
}
