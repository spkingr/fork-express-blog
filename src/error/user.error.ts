/* 用户模块的code都是100xx开头 */

export enum UserErrorEnum {
  REQUIRED = 10001,
  EXISTS = 10002,
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
}
