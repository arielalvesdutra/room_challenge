import { Request, Response } from "express";
import { User } from "../entities/User";
import UserDAO from '../daos/UserDAO'
import authService, { DecodedTokenDTO } from "../services/auth-service";
import { isEmptyString } from "../helpers/string-helper";

interface UpdateUserDto {
  password: string,
  mobile_token?: string
}

const create = async (request: Request, response: Response) => {
  try { 
    const userDto: User = request.body

    userDto.password = authService.encriptPassword(userDto.password)

    await UserDAO.save(userDto)  

    response.send({message: "user inserted with success"}).status(201)

  } catch(error) {
    console.log(error)
    response.send({message: "something went wrong"}).status(400)
  }
}

const deleteById = async (request: Request, response: Response) => {
  try {

    const id = parseInt(request.params.id || '')
    const decodedToken: any = authService.decodeRequestToken(request)
    
    if (id != decodedToken.id) {
      return response.status(403).send({ 
            message: "You don't have permission to execute this action"})
    }

    const user = await UserDAO.findById(id);

    if (!user) {
      return response.status(400).send({ 
        message: "Don't exist a user with this ID"})
    }

    await UserDAO.deleteById(id)

    response.status(200).send({ message: "User excluded with success"})
  } catch(error) {
    console.log(error)

    response.status(400).send({ message: error.message})
  }
}

const retrieveAll = async (request: Request, response: Response) => {
  try {

    UserDAO.findAll().then(data => {
      response.send(data).status(200)
    })

  } catch(error) {
    console.log(error)
    response.send({message: "something went wrong"}).status(400)
  }
}

const retrieveById = (request: Request, response: Response) => {
  try {

    const userId: number = parseInt(request.params.id || '') 

    UserDAO.findById(userId).then(data => {
      if (data == undefined)
        return response.send({message: "No record found"}).status(200)

      response.send(data).status(200)
    })

  } catch(error) {
    console.log(error)
    response.send({message: "something went wrong"}).status(400)
  }
}

const update = async (request: Request, response: Response) => {
  try {
    const updateDto: UpdateUserDto  = request.body
    const decodedToken: any = authService.decodeRequestToken(request)

    if (updateDto.password == undefined && updateDto.password) {
      return response.status(400).send({ 
        message: "Invalid request"})
    }
  
    const user = await UserDAO.findById(decodedToken.id);
  
    if (!user) {
      return response.status(400).send({ 
        message: "Don't exist a user with this ID"})
    }

    if (!isEmptyString(updateDto.password)) {
      user.password = authService.encriptPassword(updateDto.password)
    }

    if (!isEmptyString(updateDto.mobile_token)) {
      user.mobile_token = updateDto.mobile_token
    }

    await UserDAO.update(user)

    response.status(200).send({ message: "User updated with success"})
     
  } catch(error) {
    console.log(error)
    response.send({message: error.message }).status(400)
  }
}

export default {
  create,
  deleteById,
  retrieveAll,
  retrieveById,
  update
}
