import { SearchDto } from '@common';
import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReqUser } from 'src/auth/decorators';
import { JwtAuthGuard } from 'src/auth/guards';
import { UserTokenPayload } from 'src/auth/interfaces';

import { GetSearchQuery } from './queries';
import { SearchService } from './search.service';

@ApiTags('검색')
@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get(':type')
  @ApiOperation({ summary: '진행중인 검색 목록 조회' })
  @ApiOkResponse({ type: [SearchDto] })
  async getSearches(@ReqUser() user: UserTokenPayload, @Param() param: GetSearchQuery) {
    return this.searchService.getSearches(user.id, param);
  }

  @Post()
  async startSearc() {
    return;
  }
}
