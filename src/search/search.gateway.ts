import { Repository } from 'typeorm';
import { instanceToPlain } from 'class-transformer';

import { Namespace, Socket } from 'socket.io';

import { InjectRepository } from '@nestjs/typeorm';
import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { UploadedExcelFileDto } from 'src/file/dto/uploaded-excel-file.dto';

import { SearchState } from './entities/search-state.entity';

@WebSocketGateway({
  namespace: 'search',
  transports: ['websocket'],
})
export class SearchGateway implements OnGatewayConnection {
  @WebSocketServer()
  private readonly server: Namespace;

  constructor(
    @InjectRepository(SearchState)
    private readonly searchStateRepository: Repository<SearchState>,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    const searchId = client.handshake.auth.searchId;

    if (searchId == null) {
      client.disconnect(true);
      return;
    }

    const exist = await this.searchStateRepository.existsBy({ id: searchId });

    if (exist === false) {
      client.disconnect(true);
      return;
    }

    await client.join(this.createRoomName(searchId));
  }

  createRoomName(searchId: number): string {
    return ['search', searchId].join(':');
  }

  sendCount(searchId: number, count: number): void {
    this.server.in(this.createRoomName(searchId)).emit('count', count);

    setTimeout(() => {
      this.server.in(this.createRoomName(searchId)).disconnectSockets(true);
    }, 3_000);
  }

  sendExcelFile(searchId: number, excelFile: UploadedExcelFileDto): void {
    this.server.in(this.createRoomName(searchId)).emit('file', instanceToPlain(excelFile));

    setTimeout(() => {
      this.server.in(this.createRoomName(searchId)).disconnectSockets(true);
    }, 3_000);
  }

  sendFail(searchId: number, e: unknown): void {
    this.server.in(this.createRoomName(searchId)).emit('fail', e);

    setTimeout(() => {
      this.server.in(this.createRoomName(searchId)).disconnectSockets(true);
    }, 3_000);
  }
}
