import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/jwt/jwt.guard';

import { KeywordByIdDto } from './dto/keyword-by-id.dto';
import { SetKeywordDto } from './dto/set-keyword.dto';
import { GetKeywordsQueryHandler } from './queries/handlers/get-keywords.query.handler';
import { GetKeywordsQuery } from './queries/implements/get-keywords.query';
import { CreateKeywordCommandHandler } from './commands/handler/create-keyword.command.handler';
import { CreateKeywordCommand } from './commands/implements/create-keyword.command';
import { UpdateKeywordCommandHandler } from './commands/handler/update-keyword.command.handler';
import { UpdateKeywordCommand } from './commands/implements/update-keyword.command';
import { DeleteKeywordCommandHandler } from './commands/handler/delete-keyword.command.handler';
import { DeleteKeywordCommand } from './commands/implements/delete-keyword.command';
import { KeywordDto } from './dto/keyword.dto';
import { KeywordIdDto } from './dto/keyword-id.dto';

@ApiTags('키워드')
@UseGuards(JwtGuard)
@Controller('keywords')
export class KeywordController {
  constructor(
    private readonly getKeywordsQueryHandler: GetKeywordsQueryHandler,
    private readonly createKeywordCommandHandler: CreateKeywordCommandHandler,
    private readonly updateKeywordCommandHandler: UpdateKeywordCommandHandler,
    private readonly deleteKeywordCommandHandler: DeleteKeywordCommandHandler,
  ) {}

  @Get()
  @ApiOperation({ summary: '키워드 조회' })
  @ApiOkResponse({ type: [KeywordDto] })
  async getKeywords() {
    return this.getKeywordsQueryHandler.execute(new GetKeywordsQuery(0));
  }

  @Post()
  @ApiOperation({ summary: '키워드 생성' })
  @ApiCreatedResponse({ type: KeywordDto })
  async createKeyword(@Body() body: SetKeywordDto) {
    return this.createKeywordCommandHandler.execute(new CreateKeywordCommand(0, body.type, body.text));
  }

  @Patch(':id')
  @ApiOperation({ summary: '키워드 수정' })
  @ApiOkResponse({ type: KeywordDto })
  async updateKeyword(@Param() param: KeywordByIdDto, @Body() body: SetKeywordDto) {
    return this.updateKeywordCommandHandler.execute(new UpdateKeywordCommand(0, param.id, body.type, body.text));
  }

  @Delete(':id')
  @ApiOperation({ summary: '키워드 삭제' })
  @ApiOkResponse({ type: KeywordIdDto })
  async deleteKeyword(@Param() param: KeywordByIdDto) {
    return this.deleteKeywordCommandHandler.execute(new DeleteKeywordCommand(0, param.id));
  }
}
