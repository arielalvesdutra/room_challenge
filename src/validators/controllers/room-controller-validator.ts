import CreateRoomDTO from "../../dtos/controllers/room/CreateRoomDTO"

interface ValidateChangeHost {
  guid: string
  next_host_id: number
}

interface ValidateJoinOrLeave {
  guid: string
}

const validateCreateRoomDTO = (dto:CreateRoomDTO) => {
  if (!dto.name || !dto.limit) {
    throw new Error('Invalid request')
  }
}

const validateChangeHost = (dto: ValidateChangeHost) => {
  if (!dto.guid) {
    throw Error("The guid is mandatory")
  }

  if (!dto.next_host_id) {
    throw Error("The next_host_id is mandatory")
  }
}

const validateJoinOrLeave = (dto: ValidateJoinOrLeave) => {
  if (!dto || !dto.guid) {
    throw new Error("The guid is mandatory")
  }
}

export default {
  validateCreateRoomDTO,
  validateChangeHost,
  validateJoinOrLeave
}
