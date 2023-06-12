import { Sequelize } from 'sequelize'
import { parsed } from '../config/index.js'

const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_NAME } = parsed!

const seq = new Sequelize(MYSQL_NAME, MYSQL_USER, MYSQL_PASSWORD, {
  host: MYSQL_HOST,
  port: Number(MYSQL_PORT),
  dialect: 'mysql',
})

export { seq }
