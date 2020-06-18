import { v4 as uuidv4 } from 'uuid'
import { QueryBuilder } from "knex";
import knex from '../configs/db-connection'
import { room_table, room_participant_table, user_table } from "../consts/tables_names"
import Room from "../entities/Room";
import User from "../entities/User";
import CreateRoomDTO from '../dtos/daos/room/CreateRoomDTO';
import ChangeHostDTO from '../dtos/daos/room/ChangeHostDTO';
import FilterFindByGuidAndUserIdDTO from '../dtos/daos/room/FilterFindByGuidAndUserIdDTO';
import FilterFindAllDTO from '../dtos/daos/room/FilterFindAllDTO';
import JoinOrLeaveParticipantDTO from '../dtos/daos/room/JoinOrLeaveParticipantDTO';
import { getValueIfArray } from '../helpers/array-helper';


const DEFAULT_ROOM_LIMIT = 5


/**
 * Change the room host.
 * 
 * @param changeHostDto 
 */
const changeHost = (changeHostDto: ChangeHostDTO) => {

  knex(room_participant_table)
    .update({ is_host: false })
    .where('user_id', changeHostDto.currentHostId)
    .andWhere('room_id', changeHostDto.roomId)
    .then(() => {
      knex(room_participant_table)
        .update({ is_host: true })
        .where('user_id', changeHostDto.nextHostId)
        .andWhere('room_id', changeHostDto.roomId)
        .then(() => { })
        .catch(error => { throw Error(error) })
    })
    .catch(error => { throw Error(error) })
}


/**
 * Create a room.
 * 
 * @param createRoomDto
 */
const save = (createRoomDto: CreateRoomDTO) => {

  const currentDate = new Date()
  const roomLimit = createRoomDto.limit != undefined
    ? createRoomDto.limit
    : DEFAULT_ROOM_LIMIT

  const roomToPersist: Room = {
    guid: uuidv4(),
    limit: roomLimit,
    name: createRoomDto.name,
    created_at: currentDate,
    updated_at: currentDate
  }

  return knex.insert(roomToPersist)
    .into(room_table)
    .then((createdRoomId: any) => {
      return knex.insert({
        room_id: getValueIfArray(createdRoomId),
        user_id: createRoomDto.userId,
        is_host: true
      })
        .into(room_participant_table)
        .then(res => createdRoomId)
        .catch(error => { throw Error(error) })
    })
    .catch(error => { throw Error(error) })
}

/**
 * Add a participant (user) to a room.
 * 
 * @param dto 
 */
const addParticipant = async (dto: JoinOrLeaveParticipantDTO) => {
  knex.insert({
    room_id: dto.roomId,
    user_id: dto.userId,
    is_host: false
  })
    .into(room_participant_table)
    .then(resp => resp)
    .catch(error => { throw Error(error) })
}

/**
 * Remove a participant (user) from a room.
 * 
 * @param dto 
 */
const removeParticipant = async (dto: JoinOrLeaveParticipantDTO) => {
  knex(room_participant_table)
    .where('room_id', dto.roomId)
    .andWhere('user_id', dto.userId)
    .del()
    .then(resp => resp)
    .catch(error => { throw Error(error) })
}

/**
 * Find a room host (user) by room id.
 * 
 * @param roomId 
 */
const findHostByRoomId = async (roomId: number) => {
  const record: User = await knex
    .select('user.id', 'user.username', 'user.mobile_token')
    .from(user_table)
    .join('room_participant', 'room_participant.user_id', 'user.id')
    .where('room_participant.room_id', roomId)
    .andWhere('room_participant.is_host', true)
    .first()
    .then(record => record)
    .catch(error => { throw Error(error) })

  return record
}

/**
 * Find a room by guid.
 * 
 * @param roomGuid 
 */
const findByGuid = async (roomGuid: string) => {

  const record: Room = await knex
    .select()
    .from(room_table)
    .where('guid', roomGuid)
    .first()
    .then(record => record)
    .catch(error => { throw Error(error) })

  return record
}

/**
 * Find a room by id.
 * 
 * @param id 
 */
const findById = async (id: number) => {

  const record: Room = await knex
    .select()
    .from(room_table)
    .where('id', id)
    .first()
    .then(record => record)
    .catch(error => { throw Error(error) })

  return record
}

/**
 * Find a room by guid and user id.
 * 
 * @param filter 
 */
const findByGuidAndUserId = async (filter: FilterFindByGuidAndUserIdDTO) => {
  const record: Room = await knex
    .select()
    .from(room_table)
    .join('room_participant', 'room_participant.room_id', 'room.id')
    .join('user', 'user.id', 'room_participant.user_id')
    .where('room.guid', filter.guid)
    .andWhere('user.id', filter.userId)
    .first()
    .then(record => record)
    .catch(error => { throw Error(error) })

  return record
}

/**
 * Find all rooms.
 * 
 * Filters available: Room.guid, User.username
 * 
 * @param filter 
 */
const findAll = async (filter: FilterFindAllDTO) => {
  const records = await knex
    .select('room.id', 'room.guid', 'room.name', 'room.limit')
    .distinct('room.id')
    .from(room_table)
    .join('room_participant', 'room_participant.room_id', 'room.id')
    .join('user', 'user.id', 'room_participant.user_id')
    .where((builder: QueryBuilder) => {
      builder.whereRaw('1 = 1')

      if (filter.guid != undefined) {
        builder.andWhere('room.guid', filter.guid)
      }

      if (filter.participantName != undefined) {
        builder.andWhere('user.username', 'like', filter.participantName)
      }

      return builder
    })
    .then(records => records)
    .catch(error => { throw Error(error) })

  return records
}

/**
 * Truncate table
 */
const truncate = async () => {
  knex(room_table)
    .truncate()
    .then(() => { })
    .catch(error => { throw error })
}


export default {
  save,
  changeHost,
  findAll,
  findById,
  findByGuid,
  findByGuidAndUserId,
  addParticipant,
  removeParticipant,
  findHostByRoomId,
  truncate
}
