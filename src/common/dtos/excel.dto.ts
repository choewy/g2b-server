import { ExcelEntity, SearchType } from '@common/entities';
import { ApiResponseProperty } from '@nestjs/swagger';

export class ExcelDto {
  @ApiResponseProperty({ type: Number })
  id: number;

  @ApiResponseProperty({ type: String, enum: SearchType })
  type: SearchType;

  @ApiResponseProperty({ type: String })
  key: string;

  @ApiResponseProperty({ type: String })
  filename: string;

  @ApiResponseProperty({ type: String, format: 'date-time' })
  uploadedAt: Date;

  constructor(excel: ExcelEntity) {
    this.id = excel.id;
    this.key = excel.key;
    this.type = excel.type;
    this.filename = excel.filename;
    this.uploadedAt = excel.uploadedAt;
  }
}
