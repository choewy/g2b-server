import { plainToInstance } from 'class-transformer';

import { UploadedExcelFileType } from 'src/file/entities/enums';
import { UploadedExcelFile } from 'src/file/entities/uploaded-excel-file.entity';

export class UploadSearchExcelFileEvent {
  constructor(
    readonly searchId: number,
    readonly userId: number,
    readonly type: UploadedExcelFileType,
    readonly buffer: Buffer,
    readonly filename: string,
  ) {}

  toEntity(key: string): UploadedExcelFile {
    return plainToInstance(UploadedExcelFile, {
      key,
      type: this.type,
      filename: this.filename,
      user: { id: this.userId },
    });
  }
}
