import { Request, Response } from "express"
import authService from "../services/auth-service"
import UserDAO from "../daos/UserDAO"

interface LoginRequestDTO {
  username: string
  password: string
}

/**
 * 
 * @param request 
 * @param response 
 */
const login = async (request: Request, response: Response) => {
  try {
    const requestDto: LoginRequestDTO = request.body || {}

    if (requestDto.username == undefined || requestDto.password == undefined) {
      throw Error("Invalid user or password")
    }

    UserDAO.findByUsername(requestDto.username)
      .then(data => {

        if (data == undefined) {
          throw Error("Invalid user or password")
        }

        const isMatch = authService.comparePasswords(requestDto.password ,data.password)

        if (!isMatch) {
          throw Error("Invalid user or password")
        }

        const token = authService.generateToken({ username: data.username, id: data.id })

        return response.send({ token: token }).status(200)
      })
      .catch(error => {
        if (error.message == 'Invalid user or password') {
          response.status(401)
          return response.send({ message: error.message })
        }
    
        response.status(400)
        return response.send({ message: 'Invalid request '})
      })
  } catch (error) {

    if (error.message == 'Invalid user or password') {
      response.status(401)

      return response.send({ message: error.message })
    }

    response.status(400)
    return response.send({ message: 'Invalid request '})
  }
}

/**
 * This is a method only for tests.
 * 
 * @param request 
 * @param response 
 */
const parseToken = (request: Request, response: Response) => {

  try {
    const decodedToken = authService.decodeRequestToken(request)

    return response.send(decodedToken).status(200)
  } catch (error) {

    if (error.message == "Invalid token") {
      return response.send({ message: "Invalid token" }).status(401)
    }

    return response.send({ message: "Invalid request" }).status(400)
  }
}

export default { login, parseToken }
