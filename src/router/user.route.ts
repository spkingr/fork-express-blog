import express from 'express'
import { userController } from '../controller/user.controller.js'

const router = express.Router()
const PREFIX = '/user'

enum userEnum {
  REGISTER = 'register',
  USERINFO = 'userInfo',
  LOGIN = 'login',
  LOGOUT = 'logout',
  UPDATE = 'update',
}

// register
router.post(`${PREFIX}/${userEnum.REGISTER}`, userController.register)

export const userRouter = router
