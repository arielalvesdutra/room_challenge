import { Request, Response } from "express"
import HttpStatus from 'http-status-codes'
import UserDAO from "../daos/UserDAO"
import LoginRequestDTO from "../dtos/controllers/auth/LoginRequestDTO"
import authService from "../services/auth-service"
import { AuthConst, ErrorConst } from '../consts/message-consts'

/**
 * Authentication controller.
 */
const AuthController = () => {

  /**
   * Authenticate a user.
   * 
   * @param request 
   * @param response 
   */
  const login = async (request: Request, response: Response) => {

    try {
      const requestDto: LoginRequestDTO = request.body || {}

      if (requestDto.username == undefined || requestDto.password == undefined) {
        throw Error(ErrorConst.ERROR_400_INVALID_REQUEST)
      }

      const user = await UserDAO.findByUsername(requestDto.username)

      if (user == undefined) {
        throw new Error(AuthConst.INVALID_USER_OR_PASSWORD)
      }

      const isMatch = authService.comparePasswords(requestDto.password, user.password)

      if (!isMatch) {
        throw new Error(AuthConst.INVALID_USER_OR_PASSWORD)
      }

      const token = authService.generateToken({ username: user.username, id: user.id })

      return response
        .status(HttpStatus.OK)
        .send({ token: token })

    } catch (error) {
      if (error.message == AuthConst.INVALID_USER_OR_PASSWORD) {
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .send({ message: error.message })
      }

      return response
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: ErrorConst.ERROR_400_INVALID_REQUEST })
    }
  }

  /**
   * This is a method only for tests.
   * 
   * Return one token decoded.
   * 
   * @param request 
   * @param response 
   */
  const parseToken = (request: Request, response: Response) => {
    try {

      if (process.env.NODE_ENV != 'DEV') {
        throw new Error(ErrorConst.ERROR_403)
      }

      const decodedToken = authService.decodeRequestToken(request)

      return response.send({ decodedToken })
    } catch (error) {

      if (error.message == AuthConst.INVALID_TOKEN) {
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .send({ message: AuthConst.INVALID_TOKEN })
      }

      return response
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: ErrorConst.ERROR_400_INVALID_REQUEST })
    }
  }

  return { login, parseToken }
}

export default AuthController
