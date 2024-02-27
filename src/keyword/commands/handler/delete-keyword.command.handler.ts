import { Repository } from 'typeorm';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Keyword } from 'src/keyword/entities/keyword.entity';
import { KeywordIdDto } from 'src/keyword/dto/keyword-id.dto';

import { DeleteKeywordCommand } from '../implements/delete-keyword.command';

@CommandHandler(DeleteKeywordCommand)
export class DeleteKeywordCommandHandler implements ICommandHandler<DeleteKeywordCommand> {
  constructor(
    @InjectRepository(Keyword)
    private readonly keywordRepository: Repository<Keyword>,
  ) {}

  async execute(command: DeleteKeywordCommand): Promise<KeywordIdDto> {
    const exist = await this.keywordRepository.existsBy({
      id: command.id,
    });

    if (exist === false) {
      throw new NotFoundException('키워드를 찾을 수 없습니다.', { cause: command });
    }

    await this.keywordRepository.delete(command.id);

    return new KeywordIdDto(command.id);
  }
}
