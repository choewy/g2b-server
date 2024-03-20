import { UserEntity } from '@common';
import { HttpException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { UserDto } from 'src/user/dtos';
import { UserService } from 'src/user/user.service';
import { MockRepository } from 'test/utils';

const mock = {
  userRepository: new MockRepository(UserEntity),
};

describe(UserService.name, () => {
  let module: TestingModule;
  let context: UserService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [UserService, mock.userRepository.createProvider()],
    }).compile();

    context = module.get(UserService);
  });

  it('UserService가 정의되어 있어야 한다.', () => {
    expect(context).toBeDefined();
  });

  describe('getUser', () => {
    it('존재하지 않는 id로 UserEntity를 조회 시 NotFoundException을 던진다.', async () => {
      jest.spyOn(mock.userRepository.get(module), 'findOneBy').mockResolvedValue(null);

      await context.getUser(1).catch((e: HttpException) => {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.getStatus()).toBe(404);
      });
    });

    it('UserEntity 조회 성공 시 UserDto을 반환한다.', async () => {
      const user = plainToInstance(UserEntity, { name: 'choewy' });

      jest.spyOn(mock.userRepository.get(module), 'findOneBy').mockResolvedValue(user);

      await context.getUser(1).then((value) => {
        expect(value).toBeInstanceOf(UserDto);
        expect(value).toEqual(new UserDto(user));
      });
    });
  });
});
