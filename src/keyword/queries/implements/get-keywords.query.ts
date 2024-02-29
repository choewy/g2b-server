import { GetKeywordsDto } from 'src/keyword/dto/get-keywords.dto';

export class GetKeywordsQuery {
  constructor(readonly userId: number, readonly query: GetKeywordsDto) {}
}
