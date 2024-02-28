import { ApiResponseProperty } from '@nestjs/swagger';

import { UploadedExcelFile } from '../entities/uploaded-excel-file.entity';

export class UploadedExcelFileDto {
  @ApiResponseProperty({ type: Number })
  id: number;

  @ApiResponseProperty({ type: String })
  key: string;

  @ApiResponseProperty({ type: String })
  filename: string;

  @ApiResponseProperty({ type: String, format: 'date-time' })
  uploadedAt: Date;

  constructor(uploadedExcelFile: UploadedExcelFile) {
    this.id = uploadedExcelFile.id;
    this.key = uploadedExcelFile.key;
    this.filename = uploadedExcelFile.filename;
    this.uploadedAt = uploadedExcelFile.uploadedAt;
  }
}
