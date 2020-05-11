import e, { Response, Request } from "express"
import authService from "../services/auth-service"
import UserDAO from "../daos/UserDAO"
import RoomDAO, { FindAllFilterDTO } from "../daos/RoomDAO"
import { Room } from "../entities/Room"
import { User } from "../entities/User"
import { RoomParticipant } from "../entities/RoomParticipant"
import RoomParticipantDAO from "../daos/RoomParticipantDAO"

const ERROR_403 = "You don't have permission to execute this action"

export interface CreateRoomRequestDTO {
  name: string
  limit: number
}

/**
 * 
 * @param request 
 * @param response 
 */
const changeHost = async (request: Request, response: Response) => {
  try {
    const guid = request.params.guid
    const next_host_id = request.body.next_host_id
    const decodedToken: any = authService.decodeRequestToken(request)

    if (!guid) {
      throw Error("The guid is mandatory")
    }

    if (!next_host_id) {
      throw Error("The next_host_id is mandatory")
    }

    const room: Room = await RoomDAO.findByGuid(guid)
    
    if (!room.id) {
      throw Error("The room has no id")
    }
    
    const currentHost: User = await RoomDAO.findHostByRoomId(room.id)
    const participants: RoomParticipant[] = 
      await RoomParticipantDAO.findAllByRoomId(room.id)

    if (currentHost.id != decodedToken.id) {
      throw Error(ERROR_403)
    }

    const nextHost: User = await UserDAO.findById(next_host_id)

    if (!isUserInTheRoom(nextHost.id, participants)) {
      throw Error("The user must be already in the room to became a host")
    }

    const filterToChangeHost = {
      currentHostId: currentHost.id,
      nextHostId: nextHost.id,
      roomId: room.id  
    }

    await RoomDAO.changeHost(filterToChangeHost)

    return response.status(200).send({ message: 'Host changed with success' })

  } catch (error) {
    console.log(error)

    if (error.message == ERROR_403) {
      return response.status(403).send({ message: error.message })  
    }

    return response.status(400).send({ message: error.message })
  }
}

/**
 * 
 * @param request 
 * @param response 
 */
const create = async (request: Request, response: Response) => {

  try {

    const createDto: CreateRoomRequestDTO = request.body || {}

    if (!createDto.name || !createDto.limit) {
      throw Error('Invalid request')
    }

    const decodedToken: any = authService.decodeRequestToken(request)

    if (!decodedToken.id || !decodedToken.username) {
      throw Error("Invalid user")
    }

    const user = await UserDAO.findById(decodedToken.id)

    await RoomDAO.save({ userId: user.id, name: createDto.name, limit: createDto.limit })


    response.status(200).send({ message: "Room created with success" })
  } catch (error) {
    console.log(error)

    return response.status(400).send({ message: error.message })
  }

}
/**
 * 
 * @param request 
 * @param response 
 */
const retrieveByGuid = async (request: Request, response: Response) => {
  try {
    const guid = request.params.guid

    if (!guid) {
      throw Error("The guid is mandatory")
    }

    RoomDAO.findByGuid(guid)
      .then(data => {
        if (data == undefined) {
          throw Error("Room not found")
        }

        return response.status(200).send(data)
      })

  } catch (error) {
    console.log(error)

    return response.status(400).send({ message: error.message })
  }
}

/**
 * 
 * @param request 
 * @param response 
 */

const retrieveAll = (request: Request, response: Response) => {
  try {
    const filter: FindAllFilterDTO = request.query || {}

    RoomDAO.findAll(filter)
      .then(data => {
        if (data == undefined) {
          throw Error("Room not found")
        }

        return response.status(200).send(data)
      })
      .catch(error => { return response.status(400).send({ message: error.message }) })

  } catch (error) {
    console.log(error)
    return response.status(400).send({ message: error.message })
  }
}

/**
 * 
 * @param request 
 * @param response 
 */
const joinOrLeave = async (request: Request, response: Response) => {
  try {
    const guid = request.params.guid
    const decodedToken: any = authService.decodeRequestToken(request)
    const room: Room = await RoomDAO.findByGuid(guid)

    if (!guid) {
      throw Error("The guid is mandatory")
    }

    if (!room.id) {
      throw Error("The room has no id")
    }

    const filter = { guid, userId: decodedToken.id }
    const filterToJoinOrLeave = { roomId: room.id, userId: decodedToken.id }

    const userIsInTheRoom: Room = await RoomDAO.findByGuidAndUserId(filter)

    if (!userIsInTheRoom) {
      await RoomDAO.addParticipant(filterToJoinOrLeave)
      return response.status(200).send({ message: 'User added to the room ' })
    } else {
      await RoomDAO.removeParticipant(filterToJoinOrLeave)
      return response.status(200).send({ message: 'User removed from the room' })
    }
  } catch (error) {
    console.log(error)

    return response.status(400).send({ message: error.message })
  }
}

const isUserInTheRoom = (userId:number, participants: RoomParticipant[]) => {
  for (let participant of participants) {
    if (participant.user_id == userId) {
      return true
    }
  }
  return false
}

export default {
  changeHost,
  create,
  joinOrLeave,
  retrieveByGuid,
  retrieveAll
}
