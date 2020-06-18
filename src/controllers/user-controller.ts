import { Request, Response } from "express";
import HttpStatus from 'http-status-codes'
import UserDAO from '../daos/UserDAO'
import authService from "../services/auth-service";
import { isEmptyString } from "../helpers/string-helper";
import UserControllerValidator from "../validators/controllers/user-controller-validator";
import UpdateUserDTO from "../dtos/controllers/user/UpdateUserDTO";
import CreateUserDTO from "../dtos/controllers/user/CreateUserDTO";
import { UserConst, ErrorConst } from '../consts/message-consts'

/**
 * User Controller.
 * 
 * @param userDao 
 */
const UserController = (userDao = UserDAO) => {

  /**
   * Create a user.
   * 
   * @param request 
   * @param response 
   */
  const create = async (request: Request, response: Response) => {
    try {
      const userDto: CreateUserDTO = request.body

      UserControllerValidator.validateCreateUserDTO(userDto)

      await userDao.save(userDto)

      response
        .status(HttpStatus.CREATED)
        .send({ message: UserConst.USER_CREATED_WITH_SUCCESS })

    } catch (error) {
      response
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: ErrorConst.ERROR_400 })
    }
  }

  /**
   * Delete a user by id.
   * 
   * The user can delete only it own account.
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
          .send({ message: ErrorConst.ERROR_403 })
      }

      const user = await userDao.findById(id);

      if (!user) {
        return response
          .status(HttpStatus.BAD_REQUEST)
          .send({ message: UserConst.USER_NOT_FOUND })
      }

      await userDao.deleteById(id)

      response
        .status(HttpStatus.OK)
        .send({ message: UserConst.USER_EXCLUDED_WITH_SUCCESS })

    } catch (error) {
      console.log(error)

      response
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: error.message })
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

      userDao.findAll()
        .then(data => response.status(HttpStatus.OK).send(data))

    } catch (error) {
      response
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: ErrorConst.ERROR_400 })
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

      userDao.findById(userId).then(data => {
        if (data == undefined) {
          return response
            .status(HttpStatus.OK)
            .send({ message: UserConst.USER_NOT_FOUND })
        }

        response.send(data).status(HttpStatus.OK)
      })

    } catch (error) {
      response
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: ErrorConst.ERROR_400 })
    }
  }

  /**
   * Update a user password and/or mobile_token.
   * 
   * @param request 
   * @param response 
   */
  const update = async (request: Request, response: Response) => {
    try {
      const updateDto: UpdateUserDTO = request.body
      const decodedToken: any = authService.decodeRequestToken(request)

      UserControllerValidator.validateUpdateUserDTO(updateDto)

      const user = await userDao.findById(decodedToken.id);

      if (!user) {
        return response.status(HttpStatus.BAD_REQUEST).send({
          message: UserConst.USER_NOT_FOUND
        })
      }

      if (!isEmptyString(updateDto.password)) {
        user.password = authService.encriptPassword(updateDto.password)
      }

      if (!isEmptyString(updateDto.mobile_token)) {
        user.mobile_token = updateDto.mobile_token
      }

      await userDao.update(user)

      response
        .status(HttpStatus.OK)
        .send({ message: UserConst.USER_UPDATED_WITH_SUCCESS })

    } catch (error) {
      response.status(HttpStatus.BAD_REQUEST)

      if (error.message == ErrorConst.ERROR_AUTHORIZATION_HEADER_IS_REQUIRED) {
        response.status(HttpStatus.UNAUTHORIZED)
      }

      response.send({ message: error.message })
    }
  }

  return {
    create,
    deleteById,
    retrieveAll,
    retrieveById,
    update
  }
}


export default UserController
