import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { LoggingService } from 'src/logging/logging.service';
import { SearchState } from 'src/search/entities/search-state.entity';
import { SearchService } from 'src/search/search.service';
import { SearchGateway } from 'src/search/search.gateway';
import { HrcsService } from 'src/hrcs/hrcs.service';
import { UploadedExcelFileType } from 'src/file/entities/enums';
import { UploadSearchExcelFileEvent } from 'src/file/events/implements/upload-search-excel-file.event';

import { StartSearchHrcsEvent } from '../implements/start-search-hrcs.event';

@EventsHandler(StartSearchHrcsEvent)
export class StartSearchHrcsEventHandler implements IEventHandler<StartSearchHrcsEvent> {
  constructor(
    @InjectRepository(SearchState)
    private readonly searchStateRepository: Repository<SearchState>,
    private readonly searchService: SearchService,
    private readonly searchGateway: SearchGateway,
    private readonly hrcsService: HrcsService,
    private readonly loggingService: LoggingService,
    private readonly eventBus: EventBus,
  ) {}

  async handle(event: StartSearchHrcsEvent): Promise<void> {
    const { searchId, userId, params } = event;

    const logging = this.loggingService.create(StartSearchHrcsEvent.name);

    try {
      const { types, startDate, endDate } = params;

      const parseditems = await this.hrcsService.getItemsManyTimes(types, startDate, endDate);
      const parsedItemCount = parseditems.length;
      const filteredItems = await this.searchService.filterHrcsItems(userId, parseditems);
      const filteredItemCount = filteredItems.length;

      this.searchGateway.sendCount(searchId, filteredItemCount);

      if (filteredItemCount > 0) {
        const buffer = await this.searchService.createHrcsExcelBuffer(filteredItems);
        const filename = `사전규격_${params.startDate}_${params.endDate}.xlsx`;

        this.eventBus.publish(new UploadSearchExcelFileEvent(searchId, userId, UploadedExcelFileType.Hrcs, buffer, filename));
      }

      logging.debug('end', {
        userId,
        searchId,
        params,
        parsedItemCount,
        filteredItemCount,
        latency: logging.ms,
      });
    } catch (e) {
      this.searchGateway.sendFail(searchId, e);

      logging.error('error', { userId, searchId, params, ms: logging.ms }, e);
    }

    await this.searchStateRepository.delete(searchId);
  }
}
