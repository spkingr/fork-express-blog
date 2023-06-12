import type { Middleware } from '../types'
import { userService } from '../service/user.service.js'

class UserController {
  // 挂一个register方法
  register: Middleware = async (req, res, next) => {
    // 1.获取数据
    const user = req.body
    // 2.调用service层的方法 数据库操作
    const result = await userService.createUser(user)
    // 3.返回数据
    res.end(result)
  }
}

export const userController = new UserController()
