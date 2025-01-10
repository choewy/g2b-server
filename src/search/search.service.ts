import { EventPublisher } from '@choewy/nestjs-event';
import { SearchDto, SearchEntity, SearchType, SYSTEM_CONFIG, SystemOption } from '@common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { RunOpenApiCallEvent } from 'src/openapi/events';
import { Repository } from 'typeorm';

import { StartBidsSearchCommand, StartHrcsSearchCommand } from './commands';
import { GetSearchQuery } from './queries';

@Injectable()
export class SearchService {
  constructor(
    private readonly configService: ConfigService,
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(SearchEntity)
    private readonly searchRepository: Repository<SearchEntity>,
  ) {}

  async getSearchesByProcessId() {
    const config = this.configService.get<SystemOption>(SYSTEM_CONFIG);

    return this.searchRepository.find({
      relations: { user: true },
      select: { user: { id: true }, id: true, type: true },
      where: { processId: config.processId },
    });
  }

  async deleteSearchesByProcessId(error: Error) {
    const config = this.configService.get<SystemOption>(SYSTEM_CONFIG);

    await this.searchRepository.update(
      { processId: config.processId },
      {
        endedAt: new Date(),
        error: JSON.stringify({
          name: error.name,
          message: error.message,
          cause: error.cause,
        }),
      },
    );
  }

  async getSearch(userId: number, query: GetSearchQuery) {
    const search = await this.searchRepository.findOneBy({
      user: { id: userId },
      type: query.type,
    });

    return search === null ? null : new SearchDto(search);
  }

  async startBidsSearch(userId: number, command: StartBidsSearchCommand) {
    const type = SearchType.Bids;
    const config = this.configService.get<SystemOption>(SYSTEM_CONFIG);
    const runningSearch = await this.getSearch(userId, { type });

    if (runningSearch) {
      return runningSearch;
    }

    const search = new SearchEntity({ userId, type, processId: config.processId });
    await this.searchRepository.insert(search);

    this.eventPublisher.publish(new RunOpenApiCallEvent(userId, type, command.types, command.startDate, command.endDate));

    return new SearchDto(search);
  }

  async startHrcsSearch(userId: number, command: StartHrcsSearchCommand) {
    const type = SearchType.Hrcs;
    const config = this.configService.get<SystemOption>(SYSTEM_CONFIG);
    const runningSearch = await this.getSearch(userId, { type });

    if (runningSearch) {
      return runningSearch;
    }

    const search = new SearchEntity({ userId, type, processId: config.processId });
    await this.searchRepository.insert(search);

    this.eventPublisher.publish(new RunOpenApiCallEvent(userId, type, command.types, command.startDate, command.endDate));

    return new SearchDto(search);
  }

  async deleteSearch(userId: number, type: SearchType, error?: Error) {
    const log = await this.searchRepository.findOne({ where: { user: { id: userId }, type }, order: { id: 'DESC' } });

    await this.searchRepository.update(log.id, {
      endedAt: new Date(),
      error: error
        ? JSON.stringify({
            name: error.name,
            message: error.message,
            cause: error.cause,
          })
        : null,
    });
  }
}
