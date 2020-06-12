import jwt from 'jsonwebtoken'
import { User } from '../entities/User'
import * as dotenv from "dotenv"
import { Request } from 'express'
import bcrypt from 'bcrypt-nodejs'


dotenv.config()

interface GenerateTokenDTO {
  username: string
  id: number
}

export interface DecodedTokenDTO {
  username?: string
  id?: number
}

const jwtSecret = process.env.JWT_SECRET != undefined
    ? process.env.JWT_SECRET
    : '12h3u21bndmSndmZAWGsaneno4b23uob'

/**
 * 
 * @param user 
 */
const generateToken = (user:GenerateTokenDTO) => {
  return jwt.sign(user, jwtSecret)
}

/**
 * 
 * @param token 
 */
const decodeToken = (token: string)  => {
  const user = jwt.verify(token, jwtSecret, (err, user) => {
    if (err != undefined) {
      throw Error("Invalid token")
    }

    return user
  })

  return user
}

/**
 * 
 * @param request 
 */
const decodeRequestToken = (request:Request) => {

  const authToken = getTokenFromHeader(request)
  const decodedToken = decodeToken(authToken)

  if (decodedToken == undefined) {
    throw Error("Invalid token")
  }

  return decodedToken
}

/**
 * 
 * @param password 
 */
const encriptPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

/**
 * 
 * @param unencryptedPassword 
 * @param encryptedPassword 
 */
const comparePasswords = (unencryptedPassword: string, encryptedPassword: string) => {
  return bcrypt.compareSync(unencryptedPassword, encryptedPassword)
}

/**
 * 
 * @param request 
 */
const getTokenFromHeader = (request:Request) =>{

  const authHeader = request.header('Authorization') || undefined

  if (authHeader == undefined) {
    throw new Error("Authorization header is required")
  }

  const authToken = authHeader.replace('Bearer ', '')

  if (authToken == undefined || authToken == '') {
    throw new Error("Invalid token")
  }

  return authToken
}


export default {
  generateToken,
  decodeToken,
  decodeRequestToken,
  encriptPassword,
  comparePasswords
}
