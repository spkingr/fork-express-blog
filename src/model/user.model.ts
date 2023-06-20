import { DataTypes } from 'sequelize'
import { seq } from '../db/seq.js'

// 创建模型
// 用户表设计如下：
// id: [主键] (自增)
// username: varchar(255)
// password: char(64)
// is_admin: tinyint(1)
// avatar: varchar(255)

export interface UserAttributes {
  id?: number
  username: string
  password: string
  is_admin: boolean
}

const User = seq.define('blog_users', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'user name',
  },
  password: {
    type: DataTypes.CHAR(64),
    allowNull: false,
    comment: 'password',
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    comment: 'role: 0 => psg; 1 => admin',
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'avatar',
  },
})

// 这里就是测试 无需真实执行 不然如果服务器重启的话, 数据库就会被清空
// await User.sync({ force: true })

export { User }
