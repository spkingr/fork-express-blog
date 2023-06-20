import jwt from 'jsonwebtoken'
import type { Middleware } from '../types'
import { userService } from '../service/user.service.js'
import { parsed } from '../config/index.js'
import { UserErrorEnum, userError } from '../error/user.error.js'

class UserController {
  register: Middleware = async (req, res, next) => {
    const user = req.body
    const data = await userService.createUser(user)
    res.json({
      code: 200,
      message: '注册成功',
      data,
    })
  }

  login: Middleware = async (req, res, next) => {
    const { username } = req.body
    const data = await userService.getUser({ username })
    const { password, ...rest } = data
    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token: jwt.sign({ ...rest }, parsed!.JWT_SECRET, { expiresIn: '4h' }),
        refreshToken: jwt.sign({ ...rest, __sign__: 'refreshToken' }, parsed!.JWT_SECRET, { expiresIn: '7d' }),
      },
    })
  }

  refresh: Middleware = async (req, res, next) => {
    const { token } = req.user
    res.json({
      code: 200,
      message: '刷新token成功',
      data: {
        token,
      },
    })
  }

  modifyPassword: Middleware = async (req, res, next) => {
    const { id, password } = req.body
    if (!id || !password)
      return next(userError[UserErrorEnum.REQUIRED])

    const result = await userService.modifyUser({ id, password })
    // result是受影响的行数, 如果没有修改成功, 则返回0
    if (result <= 0)
      return next(userError[UserErrorEnum.ERROR_MODIFY])
    res.json({
      code: 200,
      message: '修改密码成功',
      data: {},
    })
  }

  getUserInfo: Middleware = async (req, res, next) => {
    const { id } = req.user
    const data = await userService.getUserInfo({ id })
    res.json({
      code: 200,
      message: '获取用户信息成功',
      data,
    })
  }

  test: Middleware = async (req, res, next) => {
    res.json({
      code: 200,
      message: 'test success',
      data: {},
    })
  }
}

export const userController = new UserController()
