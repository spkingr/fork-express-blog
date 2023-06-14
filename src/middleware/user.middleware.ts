import CryptoJS from 'crypto-js'

import type { Middleware } from '../types'
import { userService } from '../service/user.service.js'
import { UserErrorEnum, userError } from '../error/user.error.js'

/* 用户模块的code都是100xx开头 */

/* 数据合法性检查 */
export const userValidateMiddleware: Middleware = (req, res, next) => {
  const { username, password } = req.body
  if (!username || !password) {
    const error = userError[UserErrorEnum.REQUIRED]
    return next(error)
  }
  next()
}

/* 数据合理性检查 */
export const userCheckMiddleware: Middleware = async (req, res, next) => {
  const { username } = req.body
  // 数据是否重复
  const user = await userService.getUser({ username })
  if (user) {
    const error = userError[UserErrorEnum.EXISTS]
    return next(error)
  }
  next()
}

/* 注册密码加密 */
export const userPswCryptoMiddleware: Middleware = (req, res, next) => {
  const { password } = req.body
  const cryptoPsw = CryptoJS.SHA256(password).toString()
  req.body.password = cryptoPsw
  next()
}
