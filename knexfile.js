require('dotenv').config()

const getDatabaseConfiguration = () => {
  if (process.env.NODE_ENV == 'test') {
    return {
      client: 'sqlite3',
      connection: './test.sqlite',
      useNullAsDefault: true
    }
  }

  const { env } = process

  return {
    client: 'mysql',
    connection: {
      host: env.DB_HOST,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
      port: env.DB_PORT,
      timezone: env.DB_TIMEZONE
    },
    useNullAsDefault: false
  }
}


module.exports = getDatabaseConfiguration()
