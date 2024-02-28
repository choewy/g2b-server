import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/jwt/jwt.guard';
import { ReqUserID } from 'src/decorators/req-id.param';

import { UploadedExcelFileType } from './entities/enums';
import { GetMyExcelFilesQueryHandler } from './quries/handlers/get-my-excel-files.query.handler';
import { GetMyExcelFilesQuery } from './quries/implements/get-my-excel-files.query';
import { UploadedExcelFileDto } from './dto/uploaded-excel-file.dto';

@ApiTags('파일')
@Controller('files')
@UseGuards(JwtGuard)
export class FileController {
  constructor(private readonly getMyExcelFilesQueryHandler: GetMyExcelFilesQueryHandler) {}

  @Get('bids')
  @ApiOperation({ summary: '내 입찰공고 수집 파일 목록 불러오기' })
  @ApiOkResponse({ type: [UploadedExcelFileDto] })
  async getMyBidsFiles(@ReqUserID() userId: number) {
    return this.getMyExcelFilesQueryHandler.execute(new GetMyExcelFilesQuery(userId, UploadedExcelFileType.Bids));
  }

  @Get('hrcs')
  @ApiOperation({ summary: '내 사전규격 수집 파일 목록 불러오기' })
  @ApiOkResponse({ type: [UploadedExcelFileDto] })
  async getMyHrcsFiles(@ReqUserID() userId: number) {
    return this.getMyExcelFilesQueryHandler.execute(new GetMyExcelFilesQuery(userId, UploadedExcelFileType.Bids));
  }
}
