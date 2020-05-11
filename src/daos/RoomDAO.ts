import { Room } from "../entities/Room";
import { room_table, room_participant_table, user_table } from "../consts/tables_names"
import knex from '../configs/db-connection'
import { v4 as uuidv4 } from 'uuid'
import { QueryBuilder } from "knex";
import { User } from "../entities/User";

const DEFAULT_ROOM_LIMIT = 5

export interface FindAllFilterDTO {
  guid?: string
  participantName?: string
}

export interface FindByGuidAnUserId {
  guid: string
  userId: number
}

export interface CreateRoomDTO {
  userId: number
  name: string
  limit: number
}

export interface ChangeHostDTO {
  roomId: number
  currentHostId: number
  nextHostId: number
}

export interface JoinOrLeaveParticipantDTO {
  roomId: number
  userId: number
}

/**
 * 
 * @param createRoomDto
 */
const save = (createRoomDto: CreateRoomDTO) => {

  const roomLimit = createRoomDto.limit != undefined
    ? createRoomDto.limit
    : DEFAULT_ROOM_LIMIT

  knex.insert({
    name: createRoomDto.name,
    limit: roomLimit,
    guid: uuidv4()
  })
    .into(room_table)
    .then((id: any) => {
      knex.insert({
        room_id: id,
        user_id: createRoomDto.userId,
        is_host: true
      })
        .into(room_participant_table).then(res => res)
        .then(res => res)
        .catch(error => { throw Error(error) })
    })
    .catch(error => { throw Error(error) })
}

const changeHost = (changeHostDto: ChangeHostDTO) => {

  knex(room_participant_table)
    .update({ is_host: false})
    .where('user_id', changeHostDto.currentHostId)
    .andWhere('room_id', changeHostDto.roomId)
    .then(() => {
      knex(room_participant_table)
      .update({ is_host: true})
      .where('user_id', changeHostDto.nextHostId)
      .andWhere('room_id', changeHostDto.roomId)
      .then(() => {})
      .catch(error => { throw Error(error) })
    })
    .catch(error => { throw Error(error) })
}

/**
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

const findHostByRoomId = async (roomId:number) => {
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
 * 
 * @param filter 
 */
const findByGuidAndUserId = async (filter: FindByGuidAnUserId) => {
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
 * 
 * @param filter 
 */
const findAll = async (filter: FindAllFilterDTO) => {
  const records = await knex
    .select('room.id', 'room.guid', 'room.name','room.limit')
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


export default {
  save,
  changeHost,
  findByGuid,
  findAll,
  findByGuidAndUserId,
  addParticipant,
  removeParticipant,
  findHostByRoomId
}
