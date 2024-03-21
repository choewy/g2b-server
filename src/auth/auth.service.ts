import { CookieKey, ExceptionMessage, JWT_CONFIG, UserDto, UserEntity } from '@common';
import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtService, JwtSignOptions, TokenExpiredError } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync, hashSync } from 'bcrypt';
import { CookieOptions, Request, Response } from 'express';
import { DateTime } from 'luxon';
import { Repository } from 'typeorm';

import { SignInCommand, SignUpCommand } from './commands';
import { UserTokenPayload, UserTokenVerifyResult } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  protected readonly cookieOptions: CookieOptions = {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };

  protected createAccessToken(id: number, email: string) {
    const config = this.configService.get<JwtModuleOptions>(JWT_CONFIG);
    const signOption: JwtSignOptions = { secret: config.secret, expiresIn: '1d' };

    return this.jwtService.sign({ id, email } as UserTokenPayload, signOption);
  }

  protected createRefreshToken(id: number, email: string) {
    const config = this.configService.get<JwtModuleOptions>(JWT_CONFIG);
    const signOption: JwtSignOptions = { secret: config.secret, expiresIn: '14d' };

    return this.jwtService.sign({ id, email } as UserTokenPayload, signOption);
  }

  protected comparePassword(commandPassword: string, userPassword: string) {
    return compareSync(commandPassword, userPassword);
  }

  protected hashingPassword(commandPassword: string) {
    return hashSync(commandPassword, 10);
  }

  setAccessToken(res: Response, id: number, email: string): void {
    res.cookie(CookieKey.JwtAccessToken, this.createAccessToken(id, email), {
      ...this.cookieOptions,
      expires: DateTime.local().plus({ days: 1 }).toJSDate(),
    });
  }

  setRefreshToken(res: Response, id: number, email: string): void {
    res.cookie(CookieKey.JwtRefreshToken, this.createRefreshToken(id, email), {
      ...this.cookieOptions,
      expires: DateTime.local().plus({ days: 14 }).toJSDate(),
    });
  }

  deleteTokens(res: Response) {
    res.clearCookie(CookieKey.JwtAccessToken, this.cookieOptions);
    res.clearCookie(CookieKey.JwtRefreshToken, this.cookieOptions);
  }

  verifyAccessToken(req: Request) {
    const config = this.configService.get<JwtModuleOptions>(JWT_CONFIG);

    const token = req.cookies[CookieKey.JwtAccessToken];
    const result: UserTokenVerifyResult = {
      user: null,
      error: null,
      expired: false,
    };

    try {
      result.user = this.jwtService.verify(token, { secret: config.secret });
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        result.expired = true;
      } else {
        result.error = e;
      }
    }

    if (result.expired) {
      try {
        result.user = this.jwtService.verify(token, { secret: config.secret, ignoreExpiration: true });
      } catch (e) {
        result.error = e;
      }
    }

    return result;
  }

  verifyRefreshToken(req: Request) {
    const config = this.configService.get<JwtModuleOptions>(JWT_CONFIG);
    const result: UserTokenVerifyResult = {
      user: null,
      error: null,
      expired: false,
    };

    try {
      const token = req.cookies[CookieKey.JwtRefreshToken];
      result.user = this.jwtService.verify(token, { secret: config.secret });
    } catch (e) {
      result.error = e;
    }

    return result;
  }

  async getUser(res: Response, id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (user === null) {
      this.deleteTokens(res);
      throw new UnauthorizedException(ExceptionMessage.NotFoundAuth);
    }

    return new UserDto(user);
  }

  async signIn(res: Response, command: SignInCommand) {
    const user = await this.userRepository.findOneBy({ email: command.email });

    if (user === null) {
      throw new UnauthorizedException(ExceptionMessage.WrongEmailOrPassword);
    }

    if (this.comparePassword(command.password, user.password) === false) {
      throw new UnauthorizedException(ExceptionMessage.WrongEmailOrPassword);
    }

    this.setAccessToken(res, user.id, user.email);
    this.setRefreshToken(res, user.id, user.email);

    return new UserDto(user);
  }

  async signUp(res: Response, command: SignUpCommand) {
    if (command.password !== command.confirmPassword) {
      throw new BadRequestException(ExceptionMessage.IncorrectPasswords);
    }

    if (await this.userRepository.existsBy({ email: command.email })) {
      throw new ConflictException(ExceptionMessage.AlreadyExistAccount);
    }

    const user = new UserEntity({
      name: command.name,
      email: command.email,
      password: this.hashingPassword(command.password),
    });

    await this.userRepository.insert(user);

    this.setAccessToken(res, user.id, user.email);
    this.setRefreshToken(res, user.id, user.email);

    /**
     * @TODO 인증메일 발송
     **/

    return new UserDto(user);
  }

  async signOut(res: Response) {
    this.deleteTokens(res);
  }
}
