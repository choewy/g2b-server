import { UploadedExcelFileType } from 'src/file/entities/enums';

export class GetMyExcelFilesQuery {
  constructor(readonly userId: number, readonly type: UploadedExcelFileType) {}
}
