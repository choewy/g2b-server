import { Repository } from 'typeorm';
import { Namespace, Socket } from 'socket.io';

import { InjectRepository } from '@nestjs/typeorm';
import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

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

  sendComplete(searchId: number) {
    this.server.in(this.createRoomName(searchId)).emit('complete');

    setTimeout(() => {
      this.server.in(this.createRoomName(searchId)).disconnectSockets(true);
    }, 5_000);
  }

  sendFail(searchId: number) {
    this.server.in(this.createRoomName(searchId)).emit('fail');

    setTimeout(() => {
      this.server.in(this.createRoomName(searchId)).disconnectSockets(true);
    }, 5_000);
  }
}