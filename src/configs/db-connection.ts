import knexConfig from '../../knexfile'
import knex from 'knex'

interface KnexConfig {
  client: any
  connection: any,
  useNullAsDefault: any
}

const configuration: KnexConfig =  {
  client: knexConfig.client, 
  connection: knexConfig.connection,
  useNullAsDefault: knexConfig.useNullAsDefault
}

export default knex(configuration)
