/* 用户模块的code都是300xx开头 */

export enum LiveErrorEnum {
  ERROR_PARAMS = 30001,
  ERROR_HOST = 30002,
}

export const liveError = {
  [LiveErrorEnum.ERROR_PARAMS]: {
    code: LiveErrorEnum.ERROR_PARAMS,
    message: '参数错误',
  },
  [LiveErrorEnum.ERROR_HOST]: {
    code: LiveErrorEnum.ERROR_HOST,
    message: '主持人id或名称不合法',
  },
}
