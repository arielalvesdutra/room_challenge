import { room_participant_table } from "../consts/tables_names"
import knex from '../configs/db-connection'
import RoomParticipant from "../entities/RoomParticipant"

/**
 * Find all records of room_participant by room_id.
 * 
 * @param roomId 
 */
const findAllByRoomId = async (roomId: number) => {

  const records: RoomParticipant[] = await knex
    .select()
    .distinct('user_id')
    .from(room_participant_table)
    .where('room_id', roomId)
    .then(records => records)
    .catch(error => { throw Error(error) })

  return records  
}


/**
 * Truncate table
 */
const truncate = async () => {
  knex(room_participant_table)
    .truncate()
    .then(() => { })
    .catch(error => { throw error })
}


export default {
  findAllByRoomId,
  truncate
}
