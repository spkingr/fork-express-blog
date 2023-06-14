import { DataTypes } from 'sequelize'
import { seq } from '../db/seq.js'

// 创建模型
// 用户表设计如下：
// id: [主键] (自增)
// username: varchar(255)
// password: char(64)
// is_admin: tinyint(1)

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
})

export { User }
