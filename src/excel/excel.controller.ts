import { ExcelDto } from '@common';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReqUser } from 'src/auth/decorators';
import { JwtAuthGuard } from 'src/auth/guards';
import { UserTokenPayload } from 'src/auth/interfaces';

import { ExcelService } from './excel.service';
import { GetExcelsQuery } from './queries';

@ApiTags('엑셀')
@Controller('excel')
@UseGuards(JwtAuthGuard)
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Get(':type')
  @ApiOperation({ summary: '엑셀 목록 불러오기' })
  @ApiOkResponse({ type: [ExcelDto] })
  async getExcels(@ReqUser() user: UserTokenPayload, @Param() param: GetExcelsQuery) {
    return this.excelService.getExcels(user.id, param.type);
  }
}
