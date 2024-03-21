export enum CookieKey {
  JwtAccessToken = 'g2b_access_token',
  JwtRefreshToken = 'g2b_refresh_token',
}

export enum ExceptionMessage {
  NotFoundAuth = '계정 정보를 찾을 수 없습니다.',
  WrongEmailOrPassword = '이메일 또는 비밀번호를 다시 확인하세요.',
  IncorrectPasswords = '비밀번호와 비밀번호 확인이 같지 않습니다.',
  AlreadyExistAccount = '이미 등록된 이메일 계정입니다.',
}
