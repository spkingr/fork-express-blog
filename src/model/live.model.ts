import { DataTypes } from 'sequelize'
import { seq } from '../db/seq.js'

// 创建模型
// 点对点表设计如下：
// id: [主键] (自增)
// room_name: varchar(255)
// room_type: varchar(255)
// room_owner: varchar(255)
// room_member: varchar(255)

export interface LiveAttributes {
  id?: number
  room_name: string
  room_type: string
  room_owner: string
  room_member: string
}

const Live = seq.define('live', {
  room_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'room name',
  },
  room_type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'room type',
  },
  room_owner: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'room owner',
  },
  room_member: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'room member',
  },
})

// 这里就是测试 无需真实执行 不然如果服务器重启的话, 数据库就会被清空
// await Live.sync({ force: true })

export { Live }


