import { DataTypes } from 'sequelize'
import { seq } from '../db/seq.js'

// 创建模型
// 点对点表设计如下：
// id: [主键] (自增)
// room_name: varchar(255)
// room_host: varchar(255)
// room_capacity: int

export interface LiveAttributes {
  host_name: string
  host_id: string
}

const Live = seq.define('live', {
  room_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'room id aka meeting id',
  },
  host_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'host id',
  },
  host_name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'room host name',
  },
  room_capacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 2,
    comment: 'room capacity',
  },
})

// 这里就是测试 无需真实执行 不然如果服务器重启的话, 数据库就会被清空
// await Live.sync({ force: true })

export { Live }
