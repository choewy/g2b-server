import { EventPublisher } from '@choewy/nestjs-event';
import { CookieKey, ExcelDto } from '@common';
import { Injectable } from '@nestjs/common';
import { OnGatewayConnection, WebSocketServer } from '@nestjs/websockets';
import cookie from 'cookie';
import { AsyncApiSub } from 'nestjs-asyncapi';
import { Namespace, Socket } from 'socket.io';
import { VerifyAccessTokenWithIgnoreExpirationEvent } from 'src/auth/events';
import { UserTokenVerifyResult } from 'src/auth/interfaces';
import { OpenApiEndDto, OpenApiItemCountsDto } from 'src/openapi/dtos';

@Injectable()
export class SearchGateway implements OnGatewayConnection {
  @WebSocketServer()
  private readonly server: Namespace;

  constructor(private readonly eventPublisher: EventPublisher) {}

  async handleConnection(client: Socket): Promise<void> {
    const cookies = cookie.parse(client.request.headers.cookie);
    const accessToken = cookies[CookieKey.JwtAccessToken];
    const accessTokenResults = await this.eventPublisher.publish(new VerifyAccessTokenWithIgnoreExpirationEvent(accessToken));
    const accessTokenResult = accessTokenResults.getFirstValue() as UserTokenVerifyResult;

    if (accessTokenResult.error || accessTokenResult.user === null) {
      client.disconnect(true);
    } else {
      await client.join(this.createRoom(accessTokenResult.user.id));
    }
  }

  protected createRoom(userId: number): string {
    return ['search', userId].join(':');
  }

  @AsyncApiSub({
    tags: [{ name: 'search:${userId}' }],
    channel: 'count',
    message: { payload: OpenApiItemCountsDto },
  })
  sendSearchCounts(userId: number, counts: OpenApiItemCountsDto) {
    this.server.in(this.createRoom(userId)).emit('count', counts);
  }

  @AsyncApiSub({
    tags: [{ name: 'search:${userId}' }],
    channel: 'excel',
    message: { payload: ExcelDto },
  })
  sendSearchExcel(userId: number, excel: ExcelDto): void {
    this.server.in(this.createRoom(userId)).emit('excel', excel);
  }

  @AsyncApiSub({
    tags: [{ name: 'search:${userId}' }],
    channel: 'end',
    message: { payload: OpenApiEndDto },
  })
  sendSearchEnd(userId: number, result: OpenApiEndDto): void {
    this.server.in(this.createRoom(userId)).emit('end', result);
  }
}
