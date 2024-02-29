import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Keyword } from './entities/keyword.entity';
import { KeywordController } from './keyword.controller';
import { GetKeywordsQueryHandler } from './queries/handlers/get-keywords.query.handler';
import { CreateKeywordCommandHandler } from './commands/handler/create-keyword.command.handler';
import { UpdateKeywordCommandHandler } from './commands/handler/update-keyword.command.handler';
import { DeleteKeywordCommandHandler } from './commands/handler/delete-keyword.command.handler';

const QueryHandlers = [GetKeywordsQueryHandler];
const CommandHandlers = [CreateKeywordCommandHandler, UpdateKeywordCommandHandler, DeleteKeywordCommandHandler];

@Module({
  imports: [TypeOrmModule.forFeature([Keyword])],
  controllers: [KeywordController],
  providers: [...QueryHandlers, ...CommandHandlers],
})
export class KeywordModule {}
