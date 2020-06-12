import { User } from "../../entities/User"
import { UpdateUserDto } from "../../controllers/user-controller"

const validateCreateUserDTO = (dto: User) => {
  if (!dto || !dto.username || !dto.password) {
    throw new Error('invalid data for create a user')
  } 
}

const validateUpdateUserDTO = (dto: UpdateUserDto) => {
  if (!dto || !dto.password) {
    throw new Error('invalid data for update a user')
  }
}

export default {
  validateCreateUserDTO,
  validateUpdateUserDTO
}
