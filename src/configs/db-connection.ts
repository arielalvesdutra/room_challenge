import knexConfig from '../../knexfile'
import knexImport from 'knex'

interface KnexConfig {
  client: any
  connection: any
}

const configuration: KnexConfig = {
  client: knexConfig.client,
  connection: knexConfig.connection
}

const knex = knexImport(configuration)

export default knex
