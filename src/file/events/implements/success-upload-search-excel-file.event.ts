import { UploadedExcelFileDto } from 'src/file/dto/uploaded-excel-file.dto';
import { UploadedExcelFileType } from 'src/file/entities/enums';

export class SuccessUploadSearchExcelFileEvent {
  constructor(readonly searchId: number, readonly type: UploadedExcelFileType, readonly uploadedExcelFile: UploadedExcelFileDto) {}
}
