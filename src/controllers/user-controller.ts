import { Request, Response } from "express";

const create = (request: Request, response: Response) => {
  response.send({ message: "create user"})
}

const deleteById = (request: Request, response: Response) => {
  response.send({ message: "delete user by id"})
}

const retrieveAll = (request: Request, response: Response) => {
  response.send([
    { username: "Ragnar", mobile_token: "" },
    { username: "Bjorn", mobile_token: "" }
  ]);
}

const retrieveById = (request: Request, response: Response) => {
  response.send({ username: "Ragnar", mobile_token: "" })
}

const update = (request: Request, response: Response) => {
  response.send({ message: "update user"})
}

export default {
  create,
  deleteById,
  retrieveAll,
  retrieveById,
  update
}
