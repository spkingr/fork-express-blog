/* 数据库查询报错 一般以900xx开头 */

export enum SQLErrorEnum {
  ERROR_SQL = 90001,
}

export const SQLError = {
  [SQLErrorEnum.ERROR_SQL]: {
    code: SQLErrorEnum.ERROR_SQL,
    message: '数据库查询失败',
  },
}
