import express from 'express'
import {
  userController,
} from '../controller/user.controller.js'
import {
  userCheckMiddleware,
  userLoginCheckMiddleware,
  userPswCryptoMiddleware,
  userValidateMiddleware,
} from '../middleware/user.middleware.js'
import {
  userTokenCheckMiddleware,
  userTokenRefreshMiddleware,
} from '../middleware/auth.middleware.js'

const router = express.Router()
const PREFIX = '/user'

enum userEnum {
  REGISTER = 'register',
  LOGIN = 'login',
  UPDATE = 'update',
  REFRESH = 'refresh',
  GET_USERINFO = 'getuserinfo',
  TEST = 'test',
}

// register
/**
 * @params {string} username 用户名
 * @params {string} password 密码
 * @params {number} is_admin 是否是管理员
 * @returns {object} 返回注册成功的用户信息
 */
router.post(
  `${PREFIX}/${userEnum.REGISTER}`,
  [
    ...userValidateMiddleware,
    userCheckMiddleware,
    userPswCryptoMiddleware,
    userController.register,
  ],
)

// login
/**
 * @params {string} username 用户名
 * @params {string} password 密码
 * @returns {object} 返回登录成功的用户信息
 */
router.post(
  `${PREFIX}/${userEnum.LOGIN}`,
  [
    ...userValidateMiddleware,
    userLoginCheckMiddleware,
    userController.login,
  ],
)

// refresh
/**
 * @params {string} token token
 * @returns {object} 返回刷新成功的token
 * @description 用于刷新token
 * @description 由于token的有效期为4h, 所以需要在4h内刷新token
 * @description 由于refreshToken的有效期为7d, 所以需要在7d内刷新token
*/
router.post(
  `${PREFIX}/${userEnum.REFRESH}`,
  [
    userTokenRefreshMiddleware,
    userController.refresh,
  ],
)

// modify password
/**
 * @params {string} id 用户id
 * @params {string} password 密码
 * @returns {object} 返回修改密码成功的信息
 * @description 用于修改密码
 * @description 需要登录后才能修改密码, 不是忘记密码功能
 */
router.post(
  `${PREFIX}/${userEnum.UPDATE}`,
  [
    userTokenCheckMiddleware,
    userController.modifyPassword,
  ],
)

// get user info
/**
 * @params {string} id 用户id
 * @returns {object} 返回用户信息
 * @description 用于获取用户信息
 * @description 需要登录后才能获取用户信息
*/
router.get(
  `${PREFIX}/${userEnum.GET_USERINFO}`,
  [
    userTokenCheckMiddleware,
    userController.getUserInfo,
  ],
)

// test
router.post(
  `${PREFIX}/${userEnum.TEST}`,
  [
    userTokenCheckMiddleware,
    userController.test,
  ],
)

export const userRouter = router
