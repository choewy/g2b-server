import { UserEntity } from '@common';
import { Test, TestingModule } from '@nestjs/testing';
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
});
