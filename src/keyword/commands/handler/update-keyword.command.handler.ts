import { Repository } from 'typeorm';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Keyword } from 'src/keyword/entities/keyword.entity';
import { KeywordDto } from 'src/keyword/dto/keyword.dto';

import { UpdateKeywordCommand } from '../implements/update-keyword.command';

@CommandHandler(UpdateKeywordCommand)
export class UpdateKeywordCommandHandler implements ICommandHandler<UpdateKeywordCommand> {
  constructor(
    @InjectRepository(Keyword)
    private readonly keywordRepository: Repository<Keyword>,
  ) {}

  async execute(command: UpdateKeywordCommand): Promise<KeywordDto> {
    const exist = await this.keywordRepository.existsBy({
      id: command.id,
    });

    if (exist === false) {
      throw new NotFoundException('키워드를 찾을 수 없습니다.', { cause: command });
    }

    const keyword = command.toEntity();
    await this.keywordRepository.update(command.id, keyword);

    return new KeywordDto(keyword);
  }
}
