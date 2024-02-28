import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { Logging } from './models/logging';

@Injectable()
export class LoggingService {
  constructor(private readonly eventPublisher: EventPublisher) {}

  create(context: string) {
    return this.eventPublisher.mergeObjectContext(new Logging(context));
  }
}
