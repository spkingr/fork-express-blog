import express from 'express'
import { userController } from '../controller/user.controller.js'
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
}

// register
router.post(
  `${PREFIX}/${userEnum.REGISTER}`,
  [
    userValidateMiddleware,
    userCheckMiddleware,
    userPswCryptoMiddleware,
    userController.register,
  ],
)

// login
router.post(
  `${PREFIX}/${userEnum.LOGIN}`,
  [
    userLoginCheckMiddleware,
    userController.login,
  ],
)

// refresh
router.post(
  `${PREFIX}/${userEnum.REFRESH}`,
  [
    userTokenRefreshMiddleware,
    userController.refresh,
  ],
)

// modify password
router.post(
  `${PREFIX}/${userEnum.UPDATE}`,
  [
    userTokenCheckMiddleware,
    userController.modifyPassword,
  ],
)

export const userRouter = router
