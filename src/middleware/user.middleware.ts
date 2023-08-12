import CryptoJS from 'crypto-js'
import { body, validationResult } from 'express-validator'

import type { ExpressValidator, Middleware } from '../../types'
import { userService } from '../service/user.service.js'
import { UserErrorEnum, userError } from '../error/user.error.js'

/* 用户模块的code都是100xx开头 */

/* 数据合法性检查 */
export const userValidateMiddleware: ExpressValidator = [
  body('username').notEmpty().withMessage(UserErrorEnum.REQUIRED),
  body('password').notEmpty().withMessage(UserErrorEnum.REQUIRED),
  body('username').isLength({ min: 2, max: 10 }).withMessage(UserErrorEnum.LENGTH),
  body('password').isLength({ min: 6, max: 16 }).withMessage(UserErrorEnum.PSWLENGTH),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      // 取出第一个错误
      const firstError = errors.array()[0]
      // 找到与第一个错误匹配的枚举类型
      const error = userError[firstError.msg as UserErrorEnum]
      return next(error)
    }
    next()
  },
]

/* 检查用户是否已经注册 */
export const userCheckMiddleware: Middleware = async (req, res, next) => {
  const { username } = req.body
  const user = await userService.getUser({ username })
  if (user) {
    const error = userError[UserErrorEnum.EXISTS]
    return next(error)
  }
  next()
}

/* 登陆检查用户是否存在 */
export const userLoginCheckMiddleware: Middleware = async (req, res, next) => {
  const { username, password } = req.body
  const user = await userService.getUser({ username })
  if (!user) {
    const error = userError[UserErrorEnum.ERROR_INFO]
    return next(error)
  }
  if (CryptoJS.SHA256(password).toString() !== user.password) {
    const error = userError[UserErrorEnum.ERROR_INFO]
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
