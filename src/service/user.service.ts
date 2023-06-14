import type { UserAttributes } from '../model/user.model.js'
import { User } from '../model/user.model.js'

class UserService {
  async createUser(user: UserAttributes) {
    // 插入数据
    const { username, password, is_admin = 0 } = user
    const res = await User.create({
      username,
      password,
      is_admin,
    })
    return res.dataValues
  }

  async getUser({ username, password, is_admin }: Partial<UserAttributes>) {
    const whereOpt = {}
    if (username)
      Object.assign(whereOpt, { username })
    if (password)
      Object.assign(whereOpt, { password })
    if (is_admin)
      Object.assign(whereOpt, { is_admin })

    const res = await User.findOne({
      attributes: ['id', 'username', 'password', 'is_admin'], // 查询字段
      where: whereOpt, // 查询条件
    })

    return res ? res.dataValues : null
  }
}

export const userService = new UserService()