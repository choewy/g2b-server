import { plainToInstance } from 'class-transformer';

import { KeywordType } from 'src/keyword/entities/enums';
import { Keyword } from 'src/keyword/entities/keyword.entity';

export class CreateKeywordCommand {
  constructor(readonly userId: number, readonly type: KeywordType, readonly text: string) {}

  toEntity() {
    return plainToInstance(Keyword, {
      user: { id: this.userId },
      type: this.type,
      text: this.text,
    });
  }
}
