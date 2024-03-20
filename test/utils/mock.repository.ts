import { Provider, Type } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

export class MockRepository<IEntity> {
  constructor(readonly Entity: Type<IEntity>) {}

  createToken() {
    return `${this.Entity.name}${Repository.name}`;
  }

  createProvider(): Provider {
    return {
      provide: this.createToken(),
      useFactory() {
        return new Repository(this.Entity, null);
      },
    };
  }

  getRepository(module: TestingModule): Repository<IEntity> {
    return module.get(this.createToken());
  }
}
