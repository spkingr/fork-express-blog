/* 身份信息都是 200xx */

export enum AuthErrorEnum {
  ERROR_TOKEN = 20001,
  EMPTY_TRFRESH_TOKEN = 20002,
  ERROR_REFRESH_TOKEN = 20003,
}

export const authError = {
  [AuthErrorEnum.ERROR_TOKEN]: {
    code: AuthErrorEnum.ERROR_TOKEN,
    message: '用户权限过期',
  },
  [AuthErrorEnum.EMPTY_TRFRESH_TOKEN]: {
    code: AuthErrorEnum.EMPTY_TRFRESH_TOKEN,
    message: 'refreshToken不能为空',
  },
  [AuthErrorEnum.ERROR_REFRESH_TOKEN]: {
    code: AuthErrorEnum.ERROR_REFRESH_TOKEN,
    message: '用户身份过期',
  },
}
