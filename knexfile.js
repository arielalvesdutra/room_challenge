require('dotenv').config()

const databaseClient = 'mysql'
const { env } = process
const db = {
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  port: env.DB_PORT,
  timezone: env.DB_TIMEZONE
}

module.exports = {
  client: databaseClient,
  connection: db
}
