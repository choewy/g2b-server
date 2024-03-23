import { SetMetadata } from '@nestjs/common';

export const IGNORE_JWT_GUARD_ERROR = '__IGNORE_JWT_GUARD_ERROR__';
export const IgnoreJwtGuardError = () => SetMetadata(IGNORE_JWT_GUARD_ERROR, true);
