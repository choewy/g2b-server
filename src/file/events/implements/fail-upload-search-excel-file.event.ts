import { UploadedExcelFileType } from 'src/file/entities/enums';

export class FailUploadSearchExcelFileEvent {
  constructor(readonly searchId: number, readonly type: UploadedExcelFileType, readonly error: unknown) {}
}
