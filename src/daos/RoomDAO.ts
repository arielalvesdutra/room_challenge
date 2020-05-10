import { Room } from "../entities/Room";
import { room_table } from "../consts/tables_names"


export interface ChangeHostDTO {
  roomGuid: string
  currentHostId: number
  nextHostId: number
}

export interface JoinOrLeaveDTO {
  roomGuid: string
  participantId: number
}

const save = (room: Room) => {

}

const changeHost = (changeHostDto: ChangeHostDTO) => {

}

const joinOrLeave = (joinOrLeaveDto: JoinOrLeaveDTO) => {

}

const retrieveByGuid = (roomGuid: string) => {

}

const retrieveAllByParticipantId = (participantId: number) => {

}

export default {
  save,
  changeHost,
  joinOrLeave,
  retrieveAllByParticipantId,
  retrieveByGuid
}
