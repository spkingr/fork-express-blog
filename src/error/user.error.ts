/* 用户模块的code都是100xx开头 */

export enum UserErrorEnum {
  REQUIRED = 10001,
  EXISTS = 10002,
  ERROR_INFO = 10003,
  ERROR_MODIFY = 10004,
}

export const userError = {
  [UserErrorEnum.REQUIRED]: {
    code: UserErrorEnum.REQUIRED,
    message: '用户名或密码不能为空',
  },
  [UserErrorEnum.EXISTS]: {
    code: UserErrorEnum.EXISTS,
    message: '用户名已存在',
  },
  [UserErrorEnum.ERROR_INFO]: {
    code: UserErrorEnum.ERROR_INFO,
    message: '用户名或密码错误',
  },
  [UserErrorEnum.ERROR_MODIFY]: {
    code: UserErrorEnum.ERROR_MODIFY,
    message: '用户信息修改失败',
  },
}
