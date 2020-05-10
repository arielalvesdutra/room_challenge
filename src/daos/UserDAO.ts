import { User } from "../entities/User"
import { user_table } from "../consts/tables_names"
import knex from '../configs/db-connection'

/**
 * 
 */
const findAll = async ():Promise<User[]>  => {
  const records:User[] = await knex
      .select()
      .from(user_table)
      .then(records => records)
      .catch(error => {throw Error(error)})
  
  return records
}

/**
 * 
 * @param id 
 */
const findById = async (id: number):Promise<User> => {
  const record: User = await knex
      .select()
      .from(user_table)
      .where('id', id)
      .first()
      .then(record => record)
      .catch(error => {throw Error(error)})
  
  return record
}

/**
 * 
 * @param username 
 * @param password 
 */
const findByUsername = async (username:string) => {
  const record: User = await knex
      .select()
      .from(user_table)
      .where('username', username)
      .first()
      .then(record => record)
      .catch(error => {throw Error(error)})
  
  return record  
}

/**
 * 
 * @param user 
 */
const save = async (user: User) => {
  return knex.transaction((trx) => {

    knex.insert<User>(user)
      .into(user_table)
      .transacting(trx)
      .then(trx.commit)
      .catch(error => {
        trx.rollback()
        throw Error(error)})
  }).catch(error => { throw Error(error) })
}

/**
 * Update user password and/or mobile_token.  
 * 
 * @param user 
 */
const update = (user: User) => {

  return knex.transaction((trx) => {

    knex(user_table)
      .where('id', '=', user.id)
      .update({ password: user.password, mobile_token: user.mobile_token})
      .transacting(trx)
      .then(trx.commit)
      .catch(error => {
        trx.rollback()
        throw Error(error)})
  }).catch(error => { throw Error(error) })

}

const deleteById = async (id: number) => {
  return knex.transaction((trx) => {
    
    knex(user_table).where('id', id).del()
      .transacting(trx)
      .then(trx.commit)
      .catch(trx.rollback)
  }).catch(error => { throw Error(error) })
}

export default {
  findAll,
  findById,
  findByUsername,
  save,
  update,
  deleteById
}
