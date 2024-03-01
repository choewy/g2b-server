import cookie from 'cookie';

import { Namespace, Socket } from 'socket.io';
import { AsyncApiSub } from 'nestjs-asyncapi';

import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { JwtService } from 'src/jwt/jwt.service';
import { JwtKey } from 'src/jwt/enums';
import { UploadedExcelFileDto } from 'src/file/dto/uploaded-excel-file.dto';

import { SearchStateType } from './entities/enums';
import { SearchEndDto } from './dto/search-end.dto';
import { SearchCountDto } from './dto/search-count.dto';

@WebSocketGateway({
  namespace: 'search',
  transports: ['websocket'],
})
export class SearchGateway implements OnGatewayConnection {
  @WebSocketServer()
  private readonly server: Namespace;

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket): Promise<void> {
    const cookies = cookie.parse(client.request.headers.cookie);

    const { error, payload } = this.jwtService.verify(cookies[JwtKey.AccessToken]);

    if (error) {
      client.disconnect(true);
    } else {
      await client.join(this.createRoom(payload.id));
    }
  }

  createRoom(userId: number): string {
    return ['search', userId].join(':');
  }

  @AsyncApiSub({
    tags: [{ name: 'search:${userId}' }],
    channel: 'count',
    message: { payload: SearchCountDto },
  })
  sendCount(userId: number, type: SearchStateType, count: number): void {
    this.server.in(this.createRoom(userId)).emit('count', new SearchCountDto(type, count));
  }

  @AsyncApiSub({
    tags: [{ name: 'search:${userId}' }],
    channel: 'file',
    message: { payload: UploadedExcelFileDto },
  })
  sendFile(userId: number, excelFile: UploadedExcelFileDto): void {
    this.server.in(this.createRoom(userId)).emit('file', excelFile);
  }

  @AsyncApiSub({
    tags: [{ name: 'search:${userId}' }],
    channel: 'end',
    message: { payload: SearchEndDto },
  })
  sendEnd(userId: number, type: SearchStateType, error?: unknown): void {
    this.server.in(this.createRoom(userId)).emit('end', new SearchEndDto(type, error));
  }
}
