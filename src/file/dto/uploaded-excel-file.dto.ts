import { ApiResponseProperty } from '@nestjs/swagger';

import { SearchStateType } from 'src/search/entities/enums';

import { UploadedExcelFile } from '../entities/uploaded-excel-file.entity';

export class UploadedExcelFileDto {
  @ApiResponseProperty({ type: Number })
  id: number;

  @ApiResponseProperty({ type: String, enum: SearchStateType })
  type: SearchStateType;

  @ApiResponseProperty({ type: String })
  key: string;

  @ApiResponseProperty({ type: String })
  filename: string;

  @ApiResponseProperty({ type: String, format: 'date-time' })
  uploadedAt: Date;

  constructor(uploadedExcelFile: UploadedExcelFile) {
    this.id = uploadedExcelFile.id;
    this.key = uploadedExcelFile.key;
    this.type = uploadedExcelFile.type;
    this.filename = uploadedExcelFile.filename;
    this.uploadedAt = uploadedExcelFile.uploadedAt;
  }
}
