/* 身份信息都是 200xx */

export enum AuthErrorEnum {
  ERROR_TOKEN = 401,
  ERROR_REFRESH_TOKEN = 402,
  EMPTY_TRFRESH_TOKEN = 403,
}

export const authError = {
  [AuthErrorEnum.ERROR_TOKEN]: {
    code: AuthErrorEnum.ERROR_TOKEN,
    permissionError: true,
    message: '用户权限过期',
  },
  [AuthErrorEnum.EMPTY_TRFRESH_TOKEN]: {
    code: AuthErrorEnum.EMPTY_TRFRESH_TOKEN,
    permissionError: true,
    message: 'refreshToken不能为空',
  },
  [AuthErrorEnum.ERROR_REFRESH_TOKEN]: {
    code: AuthErrorEnum.ERROR_REFRESH_TOKEN,
    permissionError: true,
    message: '用户身份过期',
  },
}
