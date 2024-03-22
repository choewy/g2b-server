import { KeywordDto } from '@common';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReqUser } from 'src/auth/decorators';
import { JwtAuthGuard } from 'src/auth/guards';
import { UserTokenPayload } from 'src/auth/interfaces';

import { SetKeywordCommand } from './commands';
import { KeywordService } from './keyword.service';
import { GetKeywordQuery, GetKeywordsQuery } from './queries';

@ApiTags('키워드')
@Controller('keyword')
@UseGuards(JwtAuthGuard)
export class KeywordController {
  constructor(private readonly keywordService: KeywordService) {}

  @Get()
  @ApiOperation({ summary: '키워드 목록 조회' })
  @ApiOkResponse({ type: [KeywordDto] })
  async getKeywords(@ReqUser() user: UserTokenPayload, @Query() query: GetKeywordsQuery) {
    return this.keywordService.getKeywords(user.id, query);
  }

  @Post()
  @ApiOperation({ summary: '키워드 등록' })
  @ApiCreatedResponse({ type: [KeywordDto] })
  async createKeyword(@ReqUser() user: UserTokenPayload, @Body() command: SetKeywordCommand) {
    return this.keywordService.createKeyword(user.id, command);
  }

  @Patch(':id(\\d+)')
  @ApiOperation({ summary: '키워드 수정' })
  @ApiOkResponse({ type: [KeywordDto] })
  async updateKeyword(@ReqUser() user: UserTokenPayload, @Param() param: GetKeywordQuery, @Body() command: SetKeywordCommand) {
    return this.keywordService.updateKeyword(user.id, param.id, command);
  }

  @Delete(':id(\\d+)')
  @ApiOperation({ summary: '키워드 삭제' })
  @ApiOkResponse({ type: [KeywordDto] })
  async deleteKeyword(@ReqUser() user: UserTokenPayload, @Param() param: GetKeywordQuery) {
    return this.keywordService.deleteKeyword(user.id, param.id);
  }
}
