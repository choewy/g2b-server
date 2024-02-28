import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { S3Service } from 'src/aws/services/s3.service';
import { LoggingService } from 'src/logging/logging.service';
import { UploadedExcelFile } from 'src/file/entities/uploaded-excel-file.entity';
import { UploadedExcelFileDto } from 'src/file/dto/uploaded-excel-file.dto';

import { UploadSearchExcelFileEvent } from '../implements/upload-search-excel-file.event';
import { SuccessUploadSearchExcelFileEvent } from '../implements/success-upload-search-excel-file.event';
import { FailUploadSearchExcelFileEvent } from '../implements/fail-upload-search-excel-file.event';

@EventsHandler(UploadSearchExcelFileEvent)
export class UploadSearchExcelFileEventHandler implements IEventHandler<UploadSearchExcelFileEvent> {
  constructor(
    @InjectRepository(UploadedExcelFile)
    private readonly uploadedExcelFileRepository: Repository<UploadedExcelFile>,
    private readonly s3service: S3Service,
    private readonly eventBus: EventBus,
    private readonly loggingService: LoggingService,
  ) {}

  async handle(event: UploadSearchExcelFileEvent): Promise<void> {
    const { userId, searchId, type, filename, buffer } = event;

    const logging = this.loggingService.create(UploadSearchExcelFileEvent.name);

    try {
      const key = await this.s3service.uploadExcelFile(buffer, type);
      const uploadedExcelFile = event.toEntity(key);
      await this.uploadedExcelFileRepository.insert(uploadedExcelFile);

      if (event.publishSuccess) {
        this.eventBus.publish(new SuccessUploadSearchExcelFileEvent(searchId, type, new UploadedExcelFileDto(uploadedExcelFile)));
      }

      logging.debug('complete', { userId, type, filename, latency: logging.ms });
    } catch (e) {
      if (event.publishSuccess) {
        this.eventBus.publish(new FailUploadSearchExcelFileEvent(searchId, type, e));
      }

      logging.error('failed', { userId, type, filename, latency: logging.ms }, e);
    }
  }
}
