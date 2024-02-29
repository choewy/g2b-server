import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/jwt/jwt.guard';
import { ReqUserID } from 'src/decorators/req-user-id.param';

import { SearchStateType } from './entities/enums';
import { SearchStateDto } from './dto/search-state.dto';
import { GetSearchStateQueryHandler } from './queries/handlers/get-search-state.query.handler';
import { GetSearchStateQuery } from './queries/implements/get-search-state.query';
import { SearchBidsParamsDto } from './dto/search-bids-params.dto';
import { SearchBidsCommandHandler } from './commands/handlers/seach-bids.command.handler';
import { SearchBidsCommand } from './commands/implements/search-bids.command';
import { SearchHrcsParamsDto } from './dto/search-hrcs-params.dto';
import { SearchHrcsCommandHandler } from './commands/handlers/seach-hrcs.command.handler';
import { SearchHrcsCommand } from './commands/implements/search-hrcs.command';

@ApiTags('검색')
@UseGuards(JwtGuard)
@Controller('search')
export class SearchController {
  constructor(
    private readonly getSearchStateQueryHandler: GetSearchStateQueryHandler,
    private readonly searchBidsCommandHandler: SearchBidsCommandHandler,
    private readonly searchHrcsCommandHandler: SearchHrcsCommandHandler,
  ) {}

  @Get('bids')
  @ApiOperation({ summary: '입찰공고 검색 상태 조회' })
  @ApiOkResponse({ type: SearchStateDto })
  async getBidsSearchState(@ReqUserID() userId: number) {
    return this.getSearchStateQueryHandler.execute(new GetSearchStateQuery(userId, SearchStateType.Bids));
  }

  @Post('bids')
  @ApiOperation({ summary: '입찰공고 검색 시작' })
  @ApiCreatedResponse({ type: SearchStateDto })
  async searchBids(@ReqUserID() userId: number, @Body() body: SearchBidsParamsDto) {
    return this.searchBidsCommandHandler.execute(new SearchBidsCommand(userId, body));
  }

  @Get('hrcs')
  @ApiOperation({ summary: '사전규격 검색 상태 조회' })
  @ApiOkResponse({ type: SearchStateDto })
  async getHrcsSearchState(@ReqUserID() userId: number) {
    return this.getSearchStateQueryHandler.execute(new GetSearchStateQuery(userId, SearchStateType.Bids));
  }

  @Post('hrcs')
  @ApiOperation({ summary: '사전규격 검색 시작' })
  @ApiCreatedResponse({ type: SearchStateDto })
  async searchHrcs(@ReqUserID() userId: number, @Body() body: SearchHrcsParamsDto) {
    return this.searchHrcsCommandHandler.execute(new SearchHrcsCommand(userId, body));
  }
}
