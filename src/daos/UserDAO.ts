import { user_table } from "../consts/tables_names"
import knex from '../configs/db-connection'
import CreateUserDTO from "../dtos/daos/user/CreateUserDTO"
import User from "../entities/User"
import authService from "../services/auth-service"


/**
 * Delete user by ID
 * 
 * @param id
 */
const deleteById = async (id: number) => {
  return knex.transaction((trx: any) => {

    knex(user_table).where('id', id).del()
      .transacting(trx)
      .then(trx.commit)
      .catch(trx.rollback)
  }).catch((error: any) => { throw Error(error) })
}

/**
 * Find all users
 */
const findAll = async (): Promise<User[]> => {
  const records: User[] = await knex
    .select()
    .from(user_table)
    .then((records: any) => records)
    .catch((error: any) => { throw Error(error) })

  return records
}

/**
 * Find a user by id
 * 
 * @param id 
 */
const findById = async (id: number): Promise<User> => {
  const record: User = await knex
    .select()
    .from(user_table)
    .where('id', id)
    .first()
    .then((record: any) => record)
    .catch((error: any) => { throw Error(error) })

  return record
}

/**
 * Find a user by username
 * 
 * @param username 
 */
const findByUsername = async (username: string) => {
  const record: User = await knex
    .select()
    .from(user_table)
    .where('username', username)
    .first()
    .then((record: any) => record)
    .catch((error: any) => { throw Error(error) })

  return record
}

/**
 * Create a new User
 * 
 * @param user 
 */
const save = async (user: CreateUserDTO) => {
  return knex.transaction((trx: any) => {

    user.password = authService.encriptPassword(user.password)
    user.created_at = new Date()
    user.updated_at = new Date()

    knex(user_table)
      .insert<User>(user)
      .transacting(trx)
      .then(trx.commit)
      .catch((_) => trx.rollback())
  }).catch((error: any) => { throw error })
}

/**
 * Truncate table
 */
const truncate = async () => {
  knex(user_table)
    .truncate()
    .then(() => { })
    .catch(error => { throw error })
}

/**
 * Update user password and/or mobile_token.  
 * 
 * @param user 
 */
const update = (user: User) => {

  return knex.transaction((trx: any) => {
    const { password, mobile_token } = user

    knex(user_table)
      .where('id', '=', user.id)
      .update({ password, mobile_token, updated_at: new Date() })
      .transacting(trx)
      .then(trx.commit)
      .then(result => result)
      .catch((_) => { trx.rollback() })
  }).catch((error: any) => { throw Error(error) })
}


export default {
  deleteById,
  findAll,
  findById,
  findByUsername,
  save,
  truncate,
  update
}
