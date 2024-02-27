import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { SearchStateType } from './entities/enums';
import { SearchStateDto } from './dto/search-state.dto';
import { SearchBidsParamsDto } from './dto/search-bids-params.dto';
import { GetSearchStateQueryHandler } from './queries/handlers/get-search-state.query.handler';
import { GetSearchStateQuery } from './queries/implements/get-search-state.query';
import { SearchBidsCommandHandler } from './commands/handlers/seach-bids.command.handler';
import { SearchBidsCommand } from './commands/implements/search-bids.command';

@ApiTags('검색')
@Controller('search')
export class SearchController {
  constructor(
    private readonly getSearchStateQueryHandler: GetSearchStateQueryHandler,
    private readonly searchBidsCommandHandler: SearchBidsCommandHandler,
  ) {}

  @Get('bids')
  @ApiOperation({ summary: '입찰공고 검색 상태 조회' })
  @ApiOkResponse({ type: SearchStateDto })
  async getBidsSearchState() {
    return this.getSearchStateQueryHandler.execute(new GetSearchStateQuery(0, SearchStateType.Bids));
  }

  @Post('bids')
  @ApiOperation({ summary: '입찰공고 검색 실행' })
  @ApiCreatedResponse({ type: SearchStateDto })
  async searchBids(@Body() body: SearchBidsParamsDto) {
    return this.searchBidsCommandHandler.execute(new SearchBidsCommand(0, body));
  }

  @Get('hrcs')
  @ApiOperation({ summary: '사전규격 검색 상태 조회' })
  @ApiOkResponse({ type: SearchStateDto })
  async getHrcsSearchState() {
    return this.getSearchStateQueryHandler.execute(new GetSearchStateQuery(0, SearchStateType.Bids));
  }
}
