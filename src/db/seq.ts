import { Sequelize } from 'sequelize'
import { parsed } from '../config/index.js'

function setupSequelize() {
  const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB } = parsed!

  return new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PASSWORD, {
    host: MYSQL_HOST,
    port: Number(MYSQL_PORT),
    dialect: 'mysql',
  })
}
const seq = setupSequelize()

// 测试连接
await seq.authenticate()
console.warn('mysql connect ok')

export { seq }
