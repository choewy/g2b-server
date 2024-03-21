import { UserTokenPayload } from './user-token-payload.interface';

export interface UserTokenVerifyResult {
  user: UserTokenPayload | null;
  error: Error | null;
  expired: boolean;
}
