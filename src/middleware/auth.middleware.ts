import jwt from 'jsonwebtoken'
import type { Middleware } from '../types'
import { AuthErrorEnum, authError } from '../error/auth.error.js'
import { parsed } from '../config/index.js'

/* 用户token校验 */
export const userTokenCheckMiddleware: Middleware = (req, res, next) => {
  // 获取token 默认是Bearer token
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

/* 用户token更新 */
/**
 * 1. 用户token过期后，需要使用refreshToken来更新token
 * 2. 前端在任何token不过期的情况下，都不应当使用refreshToken来更新token，减少refreshToken的泄露风险
 * 3. 前端在token过期后，使用refreshToken接口来更新token
 */
export const userTokenRefreshMiddleware: Middleware = (req, res, next) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    const error = authError[AuthErrorEnum.EMPTY_TRFRESH_TOKEN]
    return next(error)
  }
  try {
    // 用户信息解析 会返回jwt传入的用户信息
    const decodedUser = jwt.verify(refreshToken, parsed!.JWT_SECRET)
    Reflect.deleteProperty(decodedUser as Object, '__sign__')
    // 删除iat和exp属性，重新生成token
    Reflect.deleteProperty(decodedUser as Object, 'iat')
    Reflect.deleteProperty(decodedUser as Object, 'exp')
    req.user = {
      token: jwt.sign(decodedUser, parsed!.JWT_SECRET, { expiresIn: '4h' }),
    }
  }
  catch (error: any) {
    // error.name是有好几种值的，只不过这里统一返回同一个错误
    console.error(error.name)
    const err = authError[AuthErrorEnum.ERROR_REFRESH_TOKEN]
    return next(err)
  }
  next()
}
