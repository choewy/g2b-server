import { Repository } from 'typeorm';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Keyword } from 'src/keyword/entities/keyword.entity';
import { KeywordDto } from 'src/keyword/dto/keyword.dto';

import { CreateKeywordCommand } from '../implements/create-keyword.command';

@CommandHandler(CreateKeywordCommand)
export class CreateKeywordCommandHandler implements ICommandHandler<CreateKeywordCommand> {
  constructor(
    @InjectRepository(Keyword)
    private readonly keywordRepository: Repository<Keyword>,
  ) {}

  async execute(command: CreateKeywordCommand): Promise<KeywordDto> {
    const exist = await this.keywordRepository.existsBy({
      user: { id: command.userId },
      type: command.type,
      text: command.text,
    });

    if (exist) {
      throw new ConflictException('이미 등록된 키워드입니다.', { cause: command });
    }

    const keyword = command.toEntity();
    await this.keywordRepository.insert(keyword);

    return new KeywordDto(keyword);
  }
}
