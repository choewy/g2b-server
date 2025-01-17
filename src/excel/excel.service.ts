import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { AWS_CONFIG, AwsOption, ExcelDto, ExcelEntity, SearchType, SYSTEM_CONFIG, SystemOption } from '@common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CellValue, Workbook } from 'exceljs';
import { OpenApiBidsFilteredItem, OpenApiHrcsFilteredItem } from 'src/openapi/implements';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

@Injectable()
export class ExcelService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(ExcelEntity)
    private readonly excelRepository: Repository<ExcelEntity>,
  ) {}

  protected fixelToWidth(fixel: number) {
    return Math.ceil(fixel / 7);
  }

  protected createBidsExcel(filteredItems: OpenApiBidsFilteredItem[]) {
    const workBook = new Workbook();
    const workSheet = workBook.addWorksheet('입찰공고', {
      views: [{ state: 'frozen', ySplit: 1, xSplit: 5 }],
    });

    workSheet.insertRow(1, [
      '순번',
      '검색어',
      '구분',
      '입찰공고번호',
      '입찰공고명',
      '공고기관명',
      '수요기관명',
      '계약체결방법',
      '추정가격',
      '입찰공고일시',
      '입찰마감일시',
    ]);

    for (let i = 0; i < filteredItems.length; i++) {
      const item = filteredItems[i];
      const row = workSheet.insertRow(i + 2, [
        i + 1,
        item.keywords,
        item.type,
        {
          text: item.bidNtceNo,
          hyperlink: item.bidNtceDtlUrl,
        } as CellValue,
        item.bidNtceNm,
        item.ntceInsttNm,
        item.dminsttNm,
        item.cntrctCnclsMthdNm,
        Number(item.presmptPrce),
        item.bidNtceDt,
        item.bidClseDt,
      ]);

      row.alignment = { vertical: 'middle' };
      row.border = {
        top: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
      };
    }

    workSheet.getColumn(1).width = this.fixelToWidth(50);
    workSheet.getColumn(2).width = this.fixelToWidth(80);
    workSheet.getColumn(2).alignment = { vertical: 'middle', horizontal: 'center' };
    workSheet.getColumn(3).width = this.fixelToWidth(80);
    workSheet.getColumn(3).alignment = { vertical: 'middle', horizontal: 'center' };
    workSheet.getColumn(4).width = this.fixelToWidth(120);
    workSheet.getColumn(4).alignment = { vertical: 'middle', horizontal: 'center' };
    workSheet.getColumn(5).width = this.fixelToWidth(650);
    workSheet.getColumn(6).width = this.fixelToWidth(400);
    workSheet.getColumn(7).width = this.fixelToWidth(400);
    workSheet.getColumn(8).width = this.fixelToWidth(330);
    workSheet.getColumn(9).width = this.fixelToWidth(110);
    workSheet.getColumn(9).alignment = { vertical: 'middle', horizontal: 'right' };
    workSheet.getColumn(9).numFmt = '#,##0';
    workSheet.getColumn(10).width = this.fixelToWidth(135);
    workSheet.getColumn(10).alignment = { vertical: 'middle', horizontal: 'center' };
    workSheet.getColumn(11).width = this.fixelToWidth(135);
    workSheet.getColumn(11).alignment = { vertical: 'middle', horizontal: 'center' };

    const headerRow = workSheet.getRow(1);

    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.border = {
      top: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
    };

    return workBook.xlsx.writeBuffer() as Promise<Buffer>;
  }

  protected createHrcsExcel(filteredItems: OpenApiHrcsFilteredItem[]) {
    const workBook = new Workbook();
    const workSheet = workBook.addWorksheet('사전규격', {
      views: [{ state: 'frozen', ySplit: 1, xSplit: 4 }],
    });

    workSheet.insertRow(1, [
      '순번',
      '검색어',
      '사전규격등록번호',
      '구분',
      '품명',
      '실수요기관명',
      '배정예산금액',
      '등록일시',
      '의견등록마감일시',
    ]);

    for (let i = 0; i < filteredItems.length; i++) {
      const item = filteredItems[i];
      const row = workSheet.insertRow(i + 2, [
        i + 1,
        item.keywords,
        item.bfSpecRgstNo,
        item.bsnsDivNm,
        item.prdctClsfcNoNm,
        item.rlDminsttNm,
        Number(item.asignBdgtAmt),
        item.rgstDt,
        item.opninRgstClseDt,
      ]);

      row.alignment = { vertical: 'middle' };
      row.border = {
        top: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
      };
    }

    workSheet.getColumn(1).width = this.fixelToWidth(50);
    workSheet.getColumn(2).width = this.fixelToWidth(80);
    workSheet.getColumn(2).alignment = { vertical: 'middle', horizontal: 'center' };
    workSheet.getColumn(3).width = this.fixelToWidth(120);
    workSheet.getColumn(3).alignment = { vertical: 'middle', horizontal: 'center' };
    workSheet.getColumn(4).width = this.fixelToWidth(80);
    workSheet.getColumn(4).alignment = { vertical: 'middle', horizontal: 'center' };
    workSheet.getColumn(5).width = this.fixelToWidth(650);
    workSheet.getColumn(6).width = this.fixelToWidth(400);
    workSheet.getColumn(7).width = this.fixelToWidth(110);
    workSheet.getColumn(7).alignment = { vertical: 'middle', horizontal: 'right' };
    workSheet.getColumn(7).numFmt = '#,##0';
    workSheet.getColumn(8).width = this.fixelToWidth(135);
    workSheet.getColumn(8).alignment = { vertical: 'middle', horizontal: 'center' };
    workSheet.getColumn(9).width = this.fixelToWidth(135);
    workSheet.getColumn(9).alignment = { vertical: 'middle', horizontal: 'center' };

    const headerRow = workSheet.getRow(1);

    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.border = {
      top: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
    };

    return workBook.xlsx.writeBuffer() as Promise<Buffer>;
  }

  protected createFileName(type: SearchType, startDate: string, endDate: string) {
    switch (type) {
      case SearchType.Bids:
        return `입찰공고_${startDate}_${endDate}.xlsx`;

      case SearchType.Hrcs:
        return `사전규격_${startDate}_${endDate}.xlsx`;
    }
  }

  protected createKey(type: SearchType) {
    const config = this.configService.get<SystemOption>(SYSTEM_CONFIG);

    return `${config.nodeEnv}/${type}/${Date.now()}-${v4()}`;
  }

  protected async uploadExcel(key: string, filename: string, buffer: Buffer) {
    const config = this.configService.get<AwsOption>(AWS_CONFIG);
    const client = new S3Client(config.client.credentials);
    const command = new PutObjectCommand({
      Key: key,
      Body: buffer,
      Bucket: config.s3.bucket,
      ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ContentDisposition: `attachement; filename=${encodeURIComponent(filename)}`,
      ACL: 'private',
    });

    await client.send(command);
  }

  async createExcel(
    type: SearchType,
    filteredItems: (OpenApiBidsFilteredItem | OpenApiHrcsFilteredItem)[],
    startDate: string,
    endDate: string,
    userId: number,
  ) {
    const key = this.createKey(type);
    const filename = this.createFileName(type, startDate, endDate);
    const excel = new ExcelEntity({ type, key, filename, userId });

    let buffer: Buffer;

    switch (type) {
      case SearchType.Bids:
        buffer = await this.createBidsExcel(filteredItems as OpenApiBidsFilteredItem[]);
        break;

      case SearchType.Hrcs:
        buffer = await this.createHrcsExcel(filteredItems as OpenApiHrcsFilteredItem[]);
        break;
    }

    await this.uploadExcel(key, filename, buffer);
    await this.excelRepository.insert(excel);

    return new ExcelDto(excel);
  }

  async getExcels(userId: number, type: SearchType) {
    const excels = await this.excelRepository.find({
      where: { user: { id: userId }, type },
      order: { uploadedAt: 'DESC' },
      take: 20,
    });

    return excels.map((excel) => new ExcelDto(excel));
  }
}
