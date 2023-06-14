/* 身份信息都是 200xx */

export enum AuthErrorEnum {
  ERROR_TOKEN = 20001,
}

export const authError = {
  [AuthErrorEnum.ERROR_TOKEN]: {
    code: AuthErrorEnum.ERROR_TOKEN,
    message: '用户身份过期',
  },
}
