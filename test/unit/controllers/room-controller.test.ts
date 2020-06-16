import { Request, request } from 'express'
import { v4 as uuidv4 } from 'uuid'
import HttpStatus from 'http-status-codes'
import RoomController from '../../../src/controllers/room-controller'
import RoomDAO from '../../../src/daos/RoomDAO'
import RoomParticipantDAO from '../../../src/daos/RoomParticipantDAO'
import UserDAO from '../../../src/daos/UserDAO'
import authService from '../../../src/services/auth-service'
import { cloneObject } from '../../../src/helpers/object-helper'
import { RoomConst } from '../../../src/consts/message-consts'
import FakeResponse from "../../fakes/fake-respose"


const roomDaoMock = RoomDAO as jest.Mocked<typeof RoomDAO>
const userDaoMock = UserDAO as jest.Mocked<typeof UserDAO>
const roomParticipantDaoMock = RoomParticipantDAO as jest.Mocked<typeof RoomParticipantDAO>
const roomController = RoomController(roomDaoMock, userDaoMock, roomParticipantDaoMock)
const defaultUser = {
  id: 1,
  username: 'geralt'
}
const nextHostUser = {
  id: 2,
  username: 'yennefer'
}
const defaultRoom = {
  name: ' Witcher 3 discussion',
  guid: uuidv4(),
  limit: 5,
  id: 1
}
let defaultRequestMock = cloneObject(request)


beforeEach(() => {
  defaultRequestMock = cloneObject(request)
})

describe('Controllers: RoomController', () => {

  describe('create()', () => {

    test('create a room should work', async () => {
      roomDaoMock.save = jest.fn()
      userDaoMock.findById = jest
        .fn()
        .mockImplementationOnce((id: number) => defaultUser)

      const mockResponse: any = new FakeResponse()
      const mockRequest: any = defaultRequestMock
      mockRequest.headers = []
      mockRequest.headers['authorization'] = authService.generateToken(defaultUser)
      mockRequest.body = {
        name: defaultUser.username,
        limit: 10
      }

      const response: any = await roomController.create(mockRequest, mockResponse)

      expect(response.statusCode).toBe(HttpStatus.CREATED)
      expect(response.body.message).toBe('Room created with success')
      expect(userDaoMock.findById).toHaveBeenCalledTimes(1)
      expect(roomDaoMock.save).toHaveBeenCalledTimes(1)
    })

    test('without token should return invalid required token message', async () => {
      const mockResponse: any = new FakeResponse()
      const mockRequest: any = defaultRequestMock
      mockRequest.headers = []
      mockRequest.headers['authorization'] = ''
      mockRequest.body = {
        name: 'Geralt',
        limit: 10
      }

      const response: any = await roomController.create(mockRequest, mockResponse)

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
      expect(response.body.message).toBe('Authorization header is required')
    })

    test('without body should return invalid request message', async () => {

      const mockRequest = {} as Request
      const mockResponse: any = new FakeResponse()

      const response: any = await roomController.create(mockRequest, mockResponse)

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
      expect(response.body.message).toBe('Invalid request')
    })

  })

  describe('retrieveAll()', () => {

    test('retrieve all should return a list of rooms ', async () => {
      roomDaoMock.findAll = jest
        .fn().mockImplementationOnce((guid: string) => {
          return new Promise((resolve) => resolve([defaultRoom]))
        })
      const mockResponse: any = new FakeResponse()
      const mockRequest: any = defaultRequestMock
      mockRequest.params = {}

      const response: any = await roomController.retrieveAll(mockRequest, mockResponse)

      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.body).toMatchObject([defaultRoom])
      expect(roomDaoMock.findAll).toHaveBeenCalledTimes(1)
    })

    test('without room should return a empty list ', async () => {
      roomDaoMock.findAll = jest
        .fn().mockImplementationOnce((guid: string) => {
          return new Promise((resolve) => resolve(undefined))
        })
      const mockResponse: any = new FakeResponse()
      const mockRequest: any = defaultRequestMock
      mockRequest.params = {}

      const response: any = await roomController.retrieveAll(mockRequest, mockResponse)

      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.body).toMatchObject([])
      expect(roomDaoMock.findAll).toHaveBeenCalledTimes(1)
    })

  })

  describe('retrieveByGuid()', () => {

    test('retrieve by id should return a room ', async () => {
      roomDaoMock.findByGuid = jest
        .fn().mockImplementationOnce((guid: string) => {
          return new Promise((resolve) => resolve(defaultRoom))
        })
      const mockResponse: any = new FakeResponse()
      const mockRequest: any = defaultRequestMock
      mockRequest.params = {
        guid: defaultRoom.guid
      }
      mockRequest.headers = []

      const response: any = await roomController.retrieveByGuid(mockRequest, mockResponse)

      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.body).toMatchObject(defaultRoom)
      expect(roomDaoMock.findByGuid).toHaveBeenCalledTimes(1)
    })

    test('without guid query param should return a error', async () => {
      const mockResponse: any = new FakeResponse()
      const mockRequest: any = defaultRequestMock
      mockRequest.params = {}
      mockRequest.headers = []

      const response: any = await roomController.retrieveByGuid(mockRequest, mockResponse)

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
      expect(response.body.message).toBe('The guid is mandatory!')
    })

    test('not found room should return not found message ', async () => {
      roomDaoMock.findByGuid = jest
        .fn().mockImplementationOnce((guid: string) => {
          return new Promise((resolve) => resolve(undefined))
        })
      const mockResponse: any = new FakeResponse()
      const mockRequest: any = defaultRequestMock
      mockRequest.params = {
        guid: defaultRoom.guid
      }
      mockRequest.headers = []

      const response: any = await roomController.retrieveByGuid(mockRequest, mockResponse)

      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.body.message).toBe('Room not found!')
      expect(roomDaoMock.findByGuid).toHaveBeenCalledTimes(1)
    })

  })

  describe('changeHost()', () => {

    test('change host should work', async () => {
      roomParticipantDaoMock.findAllByRoomId = jest
        .fn().mockImplementationOnce(() => [
          { is_host: true, user_id: defaultUser.id, room_id: defaultRoom.id },
          { is_host: false, user_id: nextHostUser.id, room_id: defaultRoom.id }
        ])
      userDaoMock.findById = jest
        .fn().mockImplementationOnce((id: number) => nextHostUser)
      roomDaoMock.findByGuid = jest
        .fn().mockImplementationOnce((guid: string) => defaultRoom)
      roomDaoMock.findHostByRoomId = jest
        .fn().mockImplementationOnce((id: number) => defaultUser)
      roomDaoMock.changeHost = jest.fn()

      const mockResponse: any = new FakeResponse()
      const mockRequest: any = defaultRequestMock
      mockRequest.params = {
        guid: defaultRoom.guid,
      }
      mockRequest.body = {
        next_host_id: nextHostUser.id
      }
      mockRequest.headers = []
      mockRequest.headers['authorization'] = authService.generateToken(defaultUser)
      mockRequest.somas = 'wqewqewqe'

      const response: any = await roomController.changeHost(mockRequest, mockResponse)

      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.body.message).toBe('Host changed with success!')
      expect(roomDaoMock.findByGuid).toHaveBeenCalledTimes(1)
      expect(roomDaoMock.findHostByRoomId).toHaveBeenCalledTimes(1)
      expect(roomParticipantDaoMock.findAllByRoomId).toHaveBeenCalledTimes(1)
      expect(userDaoMock.findById).toHaveBeenCalledTimes(1)
      expect(roomDaoMock.changeHost).toHaveBeenCalledTimes(1)
    })

    test('without token should return invalid required token message', async () => {

      const mockRequest: any = defaultRequestMock
      const mockResponse: any = new FakeResponse()
      mockRequest.params = {}
      mockRequest.headers = []
      mockRequest.headers['authorization'] = ''

      const response: any = await roomController.changeHost(mockRequest, mockResponse)

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
      expect(response.body.message).toBe('Authorization header is required')

    })

    test('without guid query parameter should return error message', async () => {

      const mockResponse: any = new FakeResponse()
      const mockRequest: any = defaultRequestMock
      mockRequest.params = {}
      mockRequest.body = {}
      mockRequest.headers = []
      mockRequest.headers['authorization'] = authService.generateToken(defaultUser)

      const response: any = await roomController.changeHost(mockRequest, mockResponse)

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
      expect(response.body.message).toBe('The guid is mandatory')
    })

    test('without next_host_it body parameter should return error message', async () => {

      const mockRequest: any = defaultRequestMock
      const mockResponse: any = new FakeResponse()
      mockRequest.params = {
        guid: defaultRoom.guid
      }
      mockRequest.body = {}
      mockRequest.headers = []
      mockRequest.headers['authorization'] = authService.generateToken(defaultUser)

      const response: any = await roomController.changeHost(mockRequest, mockResponse)

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
      expect(response.body.message).toBe('The next_host_id is mandatory')
    })

    test('without a existing room should return error message', async () => {
      roomDaoMock.findByGuid = jest
        .fn().mockImplementationOnce((guid: string) => { })
      const mockResponse: any = new FakeResponse()
      const mockRequest: any = defaultRequestMock
      mockRequest.params = {
        guid: defaultRoom.guid,
      }
      mockRequest.body = {
        next_host_id: 2
      }
      mockRequest.headers = []
      mockRequest.headers['authorization'] = authService.generateToken(defaultUser)

      const response: any = await roomController.changeHost(mockRequest, mockResponse)

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
      expect(response.body.message).toBe(RoomConst.ROOM_NOT_FOUND)
      expect(roomDaoMock.findByGuid).toHaveBeenCalledTimes(1)
    })

    test('with a user that is not the room host should return an error', async () => {

      roomParticipantDaoMock.findAllByRoomId = jest.fn()
      roomDaoMock.findByGuid = jest
        .fn().mockImplementationOnce((guid: string) => defaultRoom)
      roomDaoMock.findHostByRoomId = jest
        .fn().mockImplementationOnce((id: number) => { })

      const mockResponse: any = new FakeResponse()
      const mockRequest: any = defaultRequestMock
      mockRequest.params = {
        guid: defaultRoom.guid,
      }
      mockRequest.body = {
        next_host_id: 2
      }
      mockRequest.headers = []
      mockRequest.headers['authorization'] = authService.generateToken(defaultUser)

      const response: any = await roomController.changeHost(mockRequest, mockResponse)

      expect(response.statusCode).toBe(HttpStatus.FORBIDDEN)
      expect(response.body.message).toBe("You don't have permission to execute this action!")
      expect(roomDaoMock.findByGuid).toHaveBeenCalledTimes(1)
      expect(roomParticipantDaoMock.findAllByRoomId).toHaveBeenCalledTimes(1)
    })

    test('with a next_host that is not in the room should return a error', async () => {
      roomParticipantDaoMock.findAllByRoomId = jest
        .fn().mockImplementationOnce(() => [
          { is_host: true, user_id: defaultUser.id, room_id: defaultRoom.id }
        ])
      userDaoMock.findById = jest
        .fn().mockImplementationOnce((id: number) => nextHostUser)
      roomDaoMock.findByGuid = jest
        .fn().mockImplementationOnce((guid: string) => defaultRoom)
      roomDaoMock.findHostByRoomId = jest
        .fn().mockImplementationOnce((id: number) => defaultUser)

      const mockResponse: any = new FakeResponse()
      const mockRequest: any = defaultRequestMock
      mockRequest.params = {
        guid: defaultRoom.guid,
      }
      mockRequest.body = {
        next_host_id: nextHostUser.id
      }
      mockRequest.headers = []
      mockRequest.headers['authorization'] = authService.generateToken(defaultUser)

      const response: any = await roomController.changeHost(mockRequest, mockResponse)

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
      expect(response.body.message).toBe('The user must be already in the room to became a host!')
      expect(roomDaoMock.findByGuid).toHaveBeenCalledTimes(1)
    })
  })

  describe('joinOrLeave()', () => {

    test('join a room should work', async () => {
      roomDaoMock.findByGuid = jest
      .fn().mockImplementationOnce((guid: string) => defaultRoom)
      roomDaoMock.findByGuidAndUserId = jest
          .fn().mockImplementationOnce(( filter: any) => undefined)
      roomDaoMock.addParticipant = jest.fn()      
      const mockResponse: any = new FakeResponse()
      const mockRequest: any = defaultRequestMock
      mockRequest.params = { guid: defaultRoom.guid }
      mockRequest.body = {}
      mockRequest.headers = []
      mockRequest.headers['authorization'] = authService.generateToken(defaultUser)

      const response: any = await roomController.joinOrLeave(mockRequest, mockResponse)

      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.body.message).toBe('User added to the room!')
      expect(roomDaoMock.findByGuid).toHaveBeenCalledTimes(1)
      expect(roomDaoMock.findByGuidAndUserId).toHaveBeenCalledTimes(1)
      expect(roomDaoMock.addParticipant).toHaveBeenCalledTimes(1)
    })


    test('leave a room should work', async () => {
      roomDaoMock.findByGuid = jest
          .fn().mockImplementationOnce((guid: string) => defaultRoom)
      roomDaoMock.findByGuidAndUserId = jest
          .fn().mockImplementationOnce(( filter: any) => defaultRoom)
      roomDaoMock.removeParticipant = jest.fn()
      const mockResponse: any = new FakeResponse()
      const mockRequest: any = defaultRequestMock
      mockRequest.params = { guid: defaultRoom.guid }
      mockRequest.body = {}
      mockRequest.headers = []
      mockRequest.headers['authorization'] = authService.generateToken(defaultUser)

      const response: any = await roomController.joinOrLeave(mockRequest, mockResponse)

      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.body.message).toBe('User removed from the room!')
      expect(roomDaoMock.findByGuid).toHaveBeenCalledTimes(1)
      expect(roomDaoMock.findByGuidAndUserId).toHaveBeenCalledTimes(1)
      expect(roomDaoMock.removeParticipant).toHaveBeenCalledTimes(1)
    })

    test('without token header should return error message', async () => {

      const mockResponse: any = new FakeResponse()
      const mockRequest: any = defaultRequestMock
      mockRequest.params = {}
      mockRequest.body = {}
      mockRequest.headers = []
      mockRequest.headers['authorization'] = ''

      const response: any = await roomController.joinOrLeave(mockRequest, mockResponse)

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
      expect(response.body.message).toBe('Authorization header is required')
    })


    test('without guid query parameter should return error message', async () => {

      const mockResponse: any = new FakeResponse()
      const mockRequest: any = defaultRequestMock
      mockRequest.params = {}
      mockRequest.body = {}
      mockRequest.headers = []
      mockRequest.headers['authorization'] = authService.generateToken(defaultUser)

      const response: any = await roomController.joinOrLeave(mockRequest, mockResponse)

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
      expect(response.body.message).toBe('The guid is mandatory')
    })

    test('without room for join or leave should return error message', async () => {
      roomDaoMock.findByGuid = jest
          .fn().mockImplementationOnce((guid: string) => undefined)
      const mockResponse: any = new FakeResponse()
      const mockRequest: any = defaultRequestMock
      mockRequest.params = { guid: defaultRoom.guid }
      mockRequest.body = {}
      mockRequest.headers = []
      mockRequest.headers['authorization'] = authService.generateToken(defaultUser)

      const response: any = await roomController.joinOrLeave(mockRequest, mockResponse)

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
      expect(response.body.message).toBe(RoomConst.ROOM_NOT_FOUND)
      expect(roomDaoMock.findByGuid).toHaveBeenCalledTimes(1)
    })

  })
})
