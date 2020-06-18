import RoomParticipant from "../entities/RoomParticipant"

/**
 * Verify if the user id is present in the array
 * of room participants.
 * 
 * @param userId 
 * @param participants 
 */
const isUserInTheRoom = (userId: number, participants: RoomParticipant[]) => {
  for (let participant of participants) {
    if (participant.user_id == userId) {
      return true
    }
  }
  return false
}


export default {
  isUserInTheRoom
}
