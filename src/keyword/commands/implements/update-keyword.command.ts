import { plainToInstance } from 'class-transformer';

import { KeywordType } from 'src/keyword/entity/enums';
import { Keyword } from 'src/keyword/entity/keyword.entity';

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
