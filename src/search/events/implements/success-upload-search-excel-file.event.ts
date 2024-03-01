import { UploadedExcelFileDto } from 'src/file/dto/uploaded-excel-file.dto';
import { SearchStateType } from 'src/search/entities/enums';

export class SuccessUploadSearchExcelFileEvent {
  constructor(readonly userId: number, readonly type: SearchStateType, readonly uploadedExcelFile: UploadedExcelFileDto) {}
}
