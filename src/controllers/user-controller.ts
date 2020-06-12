import { Request, Response } from "express";
import HttpStatus from 'http-status-codes'
import UserDAO from '../daos/UserDAO'
import authService from "../services/auth-service";
import { User } from "../entities/User";
import { isEmptyString } from "../helpers/string-helper";
import UserControllerValidator from "../validators/controllers/user-controller-validator";

export interface UpdateUserDto {
  password: string,
  mobile_token?: string
}

/**
 * Create a user.
 * 
 * @param request 
 * @param response 
 */
const create = async (request: Request, response: Response) => {
  try { 
    const userDto: User = request.body

    UserControllerValidator.validateCreateUserDTO(userDto)

    await UserDAO.save(userDto)

    response
      .status(HttpStatus.CREATED)
      .send({message: "user inserted with success"})

  } catch(error) {
    response
      .status(HttpStatus.BAD_REQUEST)
      .send({message: "something went wrong"})
  }
}

/**
 * Delete a user by id.
 * 
 * The user can delete only it account.
 * 
 * @param request 
 * @param response 
 */
const deleteById = async (request: Request, response: Response) => {
  try {

    const id = parseInt(request.params.id || '')
    const decodedToken: any = authService.decodeRequestToken(request)
    
    if (id != decodedToken.id) {
      return response
          .status(HttpStatus.FORBIDDEN)
          .send({ message: "You don't have permission to execute this action" })
    }

    const user = await UserDAO.findById(id);

    if (!user) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: "Don't exist a user with this ID"})
    }

    await UserDAO.deleteById(id)

    response
      .status(HttpStatus.OK)
      .send({ message: "User excluded with success"})

  } catch(error) {
    console.log(error)

    response
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: error.message})
  }
}

/**
 * Retrieve all users.
 * 
 * @param request 
 * @param response 
 */
const retrieveAll = async (request: Request, response: Response) => {
  try {

    UserDAO.findAll()
      .then(data => response.status(HttpStatus.OK).send(data))

  } catch(error) {
    console.log(error)
    response
      .status(HttpStatus.BAD_REQUEST)
      .send({message: "something went wrong"})
  }
}

/**
 * Retrieve a user by id.
 * 
 * @param request 
 * @param response 
 */
const retrieveById = (request: Request, response: Response) => {
  try {

    const userId: number = parseInt(request.params.id || '') 

    UserDAO.findById(userId).then(data => {
      if (data == undefined) {
        return response
          .status(HttpStatus.OK)
          .send({message: "No record found"})
      }

      response.send(data).status(HttpStatus.OK)
    })

  } catch(error) {
    console.log(error)
    response
      .status(HttpStatus.BAD_REQUEST)
      .send({message: "something went wrong"})
  }
}

/**
 * Update a user password and mobile_token.
 * 
 * @param request 
 * @param response 
 */
const update = async (request: Request, response: Response) => {
  try {
    const updateDto: UpdateUserDto  = request.body
    const decodedToken: any = authService.decodeRequestToken(request)

    UserControllerValidator.validateUpdateUserDTO(updateDto)
  
    const user = await UserDAO.findById(decodedToken.id);
  
    if (!user) {
      return response.status(HttpStatus.BAD_REQUEST).send({ 
        message: "Don't exist a user with this ID"})
    }

    if (!isEmptyString(updateDto.password)) {
      user.password = authService.encriptPassword(updateDto.password)
    }

    if (!isEmptyString(updateDto.mobile_token)) {
      user.mobile_token = updateDto.mobile_token
    }

    await UserDAO.update(user)

    response
      .status(HttpStatus.OK)
      .send({ message: "User updated with success"})
     
  } catch(error) {
    response.status(HttpStatus.BAD_REQUEST)

    if (error.message == 'Authorization header is required')  {
      response.status(HttpStatus.UNAUTHORIZED)
    }

    response.send({message: error.message })
  }
}

export default {
  create,
  deleteById,
  retrieveAll,
  retrieveById,
  update
}
