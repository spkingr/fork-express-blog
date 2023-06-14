import type { Middleware } from '../types'
import { userService } from '../service/user.service.js'

class UserController {
  // 挂一个register方法
  register: Middleware = async (req, res, next) => {
    // 1.获取数据
    const user = req.body
    // 2.调用service层的方法 数据库操作
    const data = await userService.createUser(user)
    // 3.返回数据
    res.json({
      code: 200,
      message: '注册成功',
      data,
    })
  }

  // 挂一个login方法
  login: Middleware = async (req, res, next) => {
    res.json({
      code: 200,
      message: '登录成功',
    })
  }
}

export const userController = new UserController()
