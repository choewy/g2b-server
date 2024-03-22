import { OnEvent } from '@choewy/nestjs-event';
import { Injectable } from '@nestjs/common';

import { SendSearchCountsEvent, SendSearchEndEvent, SendSearchExcelEvent } from './events';
import { SearchGateway } from './search.gateway';
import { SearchService } from './search.service';

@Injectable()
export class SearchEventHandler {
  constructor(private readonly searchGateway: SearchGateway, private readonly searchService: SearchService) {}

  @OnEvent(SendSearchCountsEvent)
  async handleSendSearchCountsEvent(event: SendSearchCountsEvent) {
    return this.searchGateway.sendSearchCounts(event.userId, event.counts);
  }

  @OnEvent(SendSearchExcelEvent)
  async handleSendSearchExcelEvent(event: SendSearchExcelEvent) {
    return this.searchGateway.sendSearchExcel(event.userId, event.excel);
  }

  @OnEvent(SendSearchEndEvent)
  async handleSendSearchEndEvent(event: SendSearchEndEvent) {
    await this.searchService.deleteSearch(event.userId, event.result.type);
    this.searchGateway.sendSearchEnd(event.userId, event.result);
  }
}
