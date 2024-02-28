import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UploadedExcelFile } from 'src/file/entities/uploaded-excel-file.entity';
import { UploadedExcelFileDto } from 'src/file/dto/uploaded-excel-file.dto';
import { GetMyExcelFilesQuery } from '../implements/get-my-excel-files.query';

@QueryHandler(GetMyExcelFilesQuery)
export class GetMyExcelFilesQueryHandler implements IQueryHandler<GetMyExcelFilesQuery> {
  constructor(
    @InjectRepository(UploadedExcelFile)
    private readonly uploadedExcelFileRepository: Repository<UploadedExcelFile>,
  ) {}

  async execute(query: GetMyExcelFilesQuery): Promise<UploadedExcelFileDto[]> {
    const uploadedExcelFiles = await this.uploadedExcelFileRepository.find({
      where: {
        user: { id: query.userId },
        type: query.type,
      },
      order: { uploadedAt: 'DESC' },
    });

    return uploadedExcelFiles.map((uploadedExcelFile) => new UploadedExcelFileDto(uploadedExcelFile));
  }
}
