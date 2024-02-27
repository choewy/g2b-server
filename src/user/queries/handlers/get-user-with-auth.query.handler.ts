import { Repository } from 'typeorm';

import { UnauthorizedException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { JwtService } from 'src/jwt/jwt.service';
import { User } from 'src/user/entities/user.entity';
import { UserDto } from 'src/user/dto/user.dto';

import { GetUserWithAuthQuery } from '../implements/get-user-with-auth.query';

@QueryHandler(GetUserWithAuthQuery)
export class GetUserWithAuthQueryHandler implements IQueryHandler<GetUserWithAuthQuery> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(query: GetUserWithAuthQuery): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ id: query.id });

    if (user == null) {
      this.jwtService.deleteTokens(query.res);

      throw new UnauthorizedException('계정 정보를 찾을 수 없습니다.');
    }

    return new UserDto(user);
  }
}
