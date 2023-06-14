import jwt from 'jsonwebtoken'
import type { Middleware } from '../types'
import { AuthErrorEnum, authError } from '../error/auth.error.js'
import { parsed } from '../config/index.js'

/* 用户token校验 */
export const userTokenCheckMiddleware: Middleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    const error = authError[AuthErrorEnum.ERROR_TOKEN]
    return next(error)
  }
  try {
    // 用户信息解析 会返回jwt传入的用户信息
    const decodedUser = jwt.verify(token, parsed!.JWT_SECRET)
    req.user = decodedUser
  }
  catch (error: any) {
    // error.name是有好几种值的，只不过这里统一返回同一个错误
    console.error(error.name)
    const err = authError[AuthErrorEnum.ERROR_TOKEN]
    return next(err)
  }
  next()
}
