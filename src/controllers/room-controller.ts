import { Response, Request } from "express"

const changeHost = (request: Request, response: Response) => {
  response.send({ message: "change the room host"})
}

const create = (request: Request, response: Response) => {
  response.send({ message: "create a room"})
}

const retrieveByGuid = (request: Request, response: Response) => {
  response.send({ message: "return a room by guid"})
}

const retrieveByParticipant = (request: Request, response: Response) => {
  response.send({ message: "return the rooms by participant"})
}

const joinOrLeave = (request: Request, response: Response) => {
  response.send({ message: "join or leave a room"})
}

export default {
  changeHost,
  create,
  joinOrLeave,
  retrieveByGuid,
  retrieveByParticipant
}
