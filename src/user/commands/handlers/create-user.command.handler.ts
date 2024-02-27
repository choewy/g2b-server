import { Repository } from 'typeorm';

import { BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { JwtService } from 'src/jwt/jwt.service';
import { User } from 'src/user/entities/user.entity';

import { CreateUserCommand } from '../implements/create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: CreateUserCommand): Promise<void> {
    const exist = await this.userRepository.existsBy({ email: command.email });

    if (exist) {
      throw new ConflictException('이미 가입된 계정입니다.');
    }

    if (command.password !== command.confirmPassword) {
      throw new BadRequestException('비밀번호가 같지 않습니다.');
    }

    const user = command.toEntity();
    await this.userRepository.insert(user);

    this.jwtService.setAccessToken(command.res, user.id);
    this.jwtService.setRefreshToken(command.res, user.id);
  }
}