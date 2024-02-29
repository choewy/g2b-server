import { compareSync } from 'bcrypt';
import { Repository } from 'typeorm';

import { UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { JwtService } from 'src/jwt/jwt.service';
import { User } from 'src/user/entities/user.entity';

import { GetUserWithSignInQuery } from '../implements/get-user-with-signin.query';
import { UserDto } from 'src/user/dto/user.dto';

@QueryHandler(GetUserWithSignInQuery)
export class GetUserWithSignInQueryHandler implements IQueryHandler<GetUserWithSignInQuery> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(query: GetUserWithSignInQuery): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ email: query.body.email });

    if (user == null) {
      this.jwtService.deleteTokens(query.res);

      throw new UnauthorizedException('계정 정보를 찾을 수 없습니다.');
    }

    if (compareSync(query.body.password, user.password) === false) {
      throw new UnauthorizedException('이메일 또는 비밀번호를 확인하세요.');
    }

    this.jwtService.setAccessToken(query.res, user.id, user.email);
    this.jwtService.setRefreshToken(query.res, user.id, user.email);

    return new UserDto(user);
  }
}
