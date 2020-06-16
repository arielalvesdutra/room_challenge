import { Response, Request } from "express"
import HttpStatus from 'http-status-codes'
import RoomDAO from "../daos/RoomDAO"
import RoomParticipantDAO from "../daos/RoomParticipantDAO"
import UserDAO from "../daos/UserDAO"
import CreateRoomDTO from "../dtos/controllers/room/CreateRoomDTO"
import Room from "../entities/Room"
import RoomParticipant from "../entities/RoomParticipant"
import User from "../entities/User"
import authService from "../services/auth-service"
import roomService from "../services/room-service"
import RoomControllerValidator from '../validators/controllers/room-controller-validator'
import AuthServiceValidator from '../validators/services/auth-service-validator'
import FilterFindAllDTO from "../dtos/controllers/room/FilterFindAllDTO"
import { RoomConst, ErrorConst } from '../consts/message-consts'


/**
 * Room Controller.
 * 
 * @param roomDao 
 * @param userDao 
 * @param roomParticipantDao 
 */
 const RoomController = (
      roomDao = RoomDAO,
      userDao = UserDAO,
      roomParticipantDao = RoomParticipantDAO) => {


  /**
   * Change the host of a room.
   * 
   * @param request 
   * @param response 
   */
  const changeHost = async (request: Request, response: Response) => {
    try {
      const decodedToken: any = authService.decodeRequestToken(request)
      const guid = request.params.guid
      const next_host_id = request.body.next_host_id

      RoomControllerValidator.validateChangeHost({ guid, next_host_id })

      const room: Room = await roomDao.findByGuid(guid)

      if (!room || !room.id) {
        throw new Error(RoomConst.ROOM_NOT_FOUND)
      }

      const currentHost: User = await roomDao.findHostByRoomId(room.id)
      const participants: RoomParticipant[] =
        await roomParticipantDao.findAllByRoomId(room.id)

      if (!currentHost || currentHost.id != decodedToken.id) {
        throw new Error(ErrorConst.ERROR_403)
      }

      const nextHost: User = await userDao.findById(next_host_id)

      if (!roomService.isUserInTheRoom(nextHost.id, participants)) {
        throw new Error(RoomConst.USER_MUST_BE_IN_THE_TO_BECAME_HOST)
      }

      const filterToChangeHost = {
        currentHostId: currentHost.id,
        nextHostId: nextHost.id,
        roomId: room.id
      }

      await roomDao.changeHost(filterToChangeHost)

      return response
        .status(HttpStatus.OK)
        .send({ message: RoomConst.ROOM_HOST_CHANGED_WITH_SUCCESS })

    } catch (error) {

      if (error.message == ErrorConst.ERROR_403) {
        return response
          .status(HttpStatus.FORBIDDEN)
          .send({ message: error.message })
      }

      return response
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: error.message })
    }
  }

  /**
   * Create a room.
   * 
   * @param request 
   * @param response 
   */
  const create = async (request: Request, response: Response) => {

    try {

      const createDto: CreateRoomDTO = request.body || {}

      RoomControllerValidator.validateCreateRoomDTO(createDto)

      const decodedToken: any = authService.decodeRequestToken(request)

      AuthServiceValidator.validateDecodedToken(decodedToken)

      const user = await userDao.findById(decodedToken.id)

      await roomDao.save({ userId: user.id, name: createDto.name, limit: createDto.limit })

      return response
        .status(HttpStatus.CREATED)
        .send({ message: RoomConst.ROOM_CREATED_WITH_SUCCESS })

    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: error.message })
    }
  }

  /**
   * Retrieve a room by guid.
   * 
   * @param request 
   * @param response 
   */
  const retrieveByGuid = async (request: Request, response: Response) => {
    try {
      const guid = request.params.guid

      if (!guid) {
        throw Error(RoomConst.GUID_IS_MANDATORY)
      }

      return roomDao.findByGuid(guid)
        .then(data => {
          if (data == undefined) {
            return response
              .status(HttpStatus.OK)
              .send({ message: RoomConst.ROOM_NOT_FOUND})
          }

          return response
            .status(HttpStatus.OK)
            .send(data)
        })

    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: error.message })
    }
  }

  /**
   * Retrieve all rooms.
   * 
   * @param request 
   * @param response 
   */

  const retrieveAll = (request: Request, response: Response) => {
    try {
      const filter: FilterFindAllDTO = request.query || {}

      return roomDao.findAll(filter)
        .then(data => {
          if (data == undefined || data == []) {
            return response
              .status(HttpStatus.OK)
              .send([])
          }

          return response
            .status(HttpStatus.OK)
            .send(data)
        })
    } catch (error) {
      console.log(error)
      return response.status(HttpStatus.BAD_REQUEST).send({ message: error.message })
    }
  }

  /**
   * Join or leave a room.
   * 
   * @param request 
   * @param response 
   */
  const joinOrLeave = async (request: Request, response: Response) => {
    try {
      const guid = request.params.guid
      const decodedToken: any = authService.decodeRequestToken(request)

      RoomControllerValidator.validateJoinOrLeave({guid})
      
      const room: Room = await roomDao.findByGuid(guid)

      if (!room || !room.id) {
        throw new Error(RoomConst.ROOM_NOT_FOUND)
      }

      const filterGuidAndUserId = { guid, userId: decodedToken.id }
      const filterToUpdateJoinOrLeave = { roomId: room.id, userId: decodedToken.id }

      const userIsInTheRoom: Room = await roomDao.findByGuidAndUserId(filterGuidAndUserId)

      if (!userIsInTheRoom) {
        await roomDao.addParticipant(filterToUpdateJoinOrLeave)
        return response
            .status(HttpStatus.OK)
            .send({ message: RoomConst.USER_ADDED_TO_ROOM })
      } else {
        await roomDao.removeParticipant(filterToUpdateJoinOrLeave)
        return response
            .status(HttpStatus.OK)
            .send({ message: RoomConst.USER_REMOVED_FROM_THE_ROOM })
      }
    } catch (error) {
      return response
          .status(HttpStatus.BAD_REQUEST)
          .send({ message: error.message })
    }
  }

  return {
    changeHost,
    create,
    joinOrLeave,
    retrieveByGuid,
    retrieveAll
  }
}


export default RoomController
