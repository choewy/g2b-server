import { plainToInstance } from 'class-transformer';

import { UploadedExcelFile } from 'src/file/entities/uploaded-excel-file.entity';
import { SearchStateType } from 'src/search/entities/enums';

export class UploadSearchExcelFileEvent {
  constructor(readonly userId: number, readonly type: SearchStateType, readonly buffer: Buffer, readonly filename: string) {}

  toEntity(key: string): UploadedExcelFile {
    return plainToInstance(UploadedExcelFile, {
      key,
      type: this.type,
      filename: this.filename,
      user: { id: this.userId },
    });
  }
}
