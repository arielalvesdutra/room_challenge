import User from "../../entities/User"
import CreateUserDTO from "../../dtos/controllers/user/CreateUserDTO"
import UpdateUserDTO from "../../dtos/controllers/user/UpdateUserDTO"


const validateCreateUserDTO = (dto: CreateUserDTO) => {
  if (!dto || !dto.username || !dto.password) {
    throw new Error('invalid data for create a user')
  } 
}

const validateUpdateUserDTO = (dto: UpdateUserDTO) => {
  if (!dto || (!dto.password && !dto.mobile_token)) {
    throw new Error('invalid data for update a user')
  }
}

export default {
  validateCreateUserDTO,
  validateUpdateUserDTO
}
