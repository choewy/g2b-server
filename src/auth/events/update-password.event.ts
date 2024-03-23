import { UserEntity } from '@common';

export class UpdatePasswordEvent {
  constructor(readonly user: UserEntity, readonly password: string) {}
}
