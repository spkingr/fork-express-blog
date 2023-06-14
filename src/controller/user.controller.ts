import type { Middleware } from '../types'
import { userService } from '../service/user.service.js'

class UserController {
  // 挂一个register方法
  register: Middleware = async (req, res, next) => {
    // 1.获取数据
    const user = req.body
    // 2.调用service层的方法 数据库操作
    const data = await userService.createUser(user)
    const result = {
      code: 200,
      message: '注册成功',
      data,
    }
    // 3.返回数据
    res.json(result)
  }
}

export const userController = new UserController()
