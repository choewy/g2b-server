import { CellValue, Workbook } from 'exceljs';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Keyword } from 'src/keyword/entities/keyword.entity';
import { KeywordType } from 'src/keyword/entities/enums';
import { BidsItem } from 'src/bids/interfaces';
import { HrcsItem } from 'src/hrcs/interfaces';

import { FilteredBidsItemDto } from './dto/filtered-bids-item.dto';
import { FilteredHrcsItemDto } from './dto/filtered-hrcs-item.dto';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Keyword)
    private readonly keywordRepository: Repository<Keyword>,
  ) {}

  private async createKeywordRegExpMap(userId: number) {
    const keywords = await this.keywordRepository.findBy({ user: { id: userId } });
    const includeKeywords = keywords.filter(({ type }) => type === KeywordType.Include).map(({ text }) => text);
    const excludeKeywords = keywords.filter(({ type }) => type === KeywordType.Exclude).map(({ text }) => text);
    const includeKeywordRegExp = includeKeywords.length > 0 ? new RegExp(includeKeywords.join('|')) : null;
    const excludeKeywordRegExp = excludeKeywords.length > 0 ? new RegExp(excludeKeywords.join('|')) : null;

    return { include: includeKeywordRegExp, exclude: excludeKeywordRegExp };
  }

  async filterBidsItems(userId: number, items: BidsItem[]): Promise<FilteredBidsItemDto[]> {
    const regExp = await this.createKeywordRegExpMap(userId);

    const filteredItems: FilteredBidsItemDto[] = [];

    while (items.length > 0) {
      const item = new FilteredBidsItemDto(filteredItems.length, items.shift());

      if (regExp.include) {
        const keywords = regExp.include.exec(item.bidNtceNm);

        if (keywords === null) {
          continue;
        }

        item.setKeywords(keywords);
      }

      if (regExp.exclude) {
        const keywords = []
          .concat(regExp.exclude.exec(item.bidNtceNm) ?? [])
          .concat(regExp.exclude.exec(item.ntceInsttNm) ?? [])
          .concat(regExp.exclude.exec(item.dminsttNm) ?? []);

        if (keywords.length > 0) {
          continue;
        }
      }

      filteredItems.push(item);
    }

    return filteredItems;
  }

  async filterHrcsItems(userId: number, items: HrcsItem[]): Promise<FilteredHrcsItemDto[]> {
    const regExp = await this.createKeywordRegExpMap(userId);

    const filteredItems: FilteredHrcsItemDto[] = [];

    while (items.length > 0) {
      const item = new FilteredHrcsItemDto(filteredItems.length, items.shift());

      if (regExp.include) {
        const keywords = regExp.include.exec(item.prdctClsfcNoNm);

        if (keywords === null) {
          continue;
        }

        item.setKeywords(keywords);
      }

      if (regExp.exclude) {
        const keywords = [].concat(regExp.exclude.exec(item.prdctClsfcNoNm) ?? []).concat(regExp.exclude.exec(item.rlDminsttNm) ?? []);

        if (keywords.length > 0) {
          continue;
        }
      }

      filteredItems.push(item);
    }

    return filteredItems;
  }

  private fixelToWidth(fixel: number) {
    return Math.ceil(fixel / 7);
  }

  async createBidsExcelBuffer(items: FilteredBidsItemDto[]): Promise<Buffer> {
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

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
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

  async createHrcsExcelBuffer(items: FilteredHrcsItemDto[]): Promise<Buffer> {
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

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const row = workSheet.insertRow(i + 2, [
        i + 1,
        item.keywords,
        Number(item.bfSpecRgstNo),
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
}
