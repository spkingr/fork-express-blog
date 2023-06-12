export interface User {
  username: string
  password: string
}

class UserService {
  async createUser(user: User) {
    // todo
    return '写入数据库成功'
  }
}

export const userService = new UserService()
