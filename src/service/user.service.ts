import CryptoJS from 'crypto-js'
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

  async getUser({ username, password, id, is_admin }: Partial<UserAttributes>) {
    const whereOpt = this.generateInfo({ username, password, id, is_admin })
    const res = await User.findOne({
      attributes: ['id', 'username', 'password', 'is_admin'], // 查询字段
      where: whereOpt, // 查询条件
    })

    return res ? res.dataValues : null
  }

  async getUserInfo({ id }: Partial<UserAttributes>) {
    const res = await User.findOne({ // 查询所有字段
      where: { id }, // 查询条件
    })

    return res ? res.dataValues : null
  }

  async modifyUser({ username, password, id, is_admin }: Partial<UserAttributes>) {
    const info = this.generateInfo({ username, password, id, is_admin })
    info.password = CryptoJS.SHA256(info.password!).toString() // 这一步可能会出error
    const res = await User.update(
      { ...info },
      {
        where: { id },
      },
    )
    return res[0]
  }

  generateInfo({ id, username, password, is_admin }: Partial<UserAttributes>) {
    const info: Partial<UserAttributes> = {}
    if (username)
      Object.assign(info, { username })
    if (password)
      Object.assign(info, { password })
    if (is_admin)
      Object.assign(info, { is_admin })
    if (id)
      Object.assign(info, { id })
    return info
  }
}

export const userService = new UserService()
