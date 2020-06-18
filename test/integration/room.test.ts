import HttpStatus from 'http-status-codes'
import supertest from 'supertest'
import app from '../../src/configs/custom-express'
import { RoomConst } from '../../src/consts/message-consts'
import RoomDAO from '../../src/daos/RoomDAO'
import RoomParticipantDAO from '../../src/daos/RoomParticipantDAO'
import UserDAO from '../../src/daos/UserDAO'
import CreateRoomControllerDTO from '../../src/dtos/controllers/room/CreateRoomDTO'
import CreateRoomDaoDTO from '../../src/dtos/daos/room/CreateRoomDTO'
import Room from '../../src/entities/Room'
import { getValueIfArray } from '../../src/helpers/array-helper'
import authService from '../../src/services/auth-service'

const request = supertest(app)
const defaultRoom: CreateRoomDaoDTO = {
  limit: 5,
  userId: 1,
  name: 'Default room for tests'
}
const defaultUser = {
  password: '123456',
  username: 'geralt',
}
let userId: any


beforeEach(async () => {
  await RoomParticipantDAO.truncate()
  await RoomDAO.truncate()
  await UserDAO.truncate()

  const saveUserResult: any = await UserDAO.save(defaultUser)
  userId = getValueIfArray(saveUserResult)
  await RoomDAO.save({
    limit: defaultRoom.limit,
    name: defaultRoom.name,
    userId
  })
})

describe('Routes: Room', () => {

  describe('POST /rooms', () => {

    test('should create room and return status code 201',
      async (done: any) => {
        const token = authService.generateToken({ id: 1, username: defaultUser.username })
        const createDto: CreateRoomControllerDTO = {
          limit: 5,
          name: 'New test room'
        }
        request
          .post('/rooms')
          .send(createDto)
          .set('Authorization', token)
          .end(async (err: any, response: any) => {

            const createdRoom: Room = await RoomDAO.findById(2)

            expect(response.statusCode).toBe(HttpStatus.CREATED)
            expect(response.body.message).toBe(RoomConst.ROOM_CREATED_WITH_SUCCESS)
            expect(createdRoom).not.toBeNull()
            expect(createdRoom.guid).not.toBeNull()
            expect(createdRoom.created_at).not.toBeNull()
            expect(createdRoom.updated_at).not.toBeNull()
            expect(createdRoom.name).toBe(createDto.name)
            expect(createdRoom.limit).toBe(createDto.limit)
            done(err)
          })
      })

  })
})
