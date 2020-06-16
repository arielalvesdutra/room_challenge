import express from 'express'
import * as dotenv from "dotenv"

import AuthController from '../controllers/auth-controller'
import HomeController from '../controllers/home-controller'
import RoomController from '../controllers/room-controller'
import UserController from '../controllers/user-controller'

const authController = AuthController()
const homeController = HomeController()
const roomController = RoomController()
const userController = UserController()

dotenv.config()

const app = express()
app.use(express.json())

/**
 * Home
 */
app.get('/',homeController.home)

/**
 * Users
 */
app.route('/users')
  .get(userController.retrieveAll)
  .post(userController.create)
app.route('/users/:id')
  .get(userController.retrieveById)
  .put(userController.update)
  .delete(userController.deleteById)

/**
 * Rooms
 */
app.route('/rooms') 
  .get(roomController.retrieveAll)
  .post(roomController.create)
app.route('/rooms/:guid')
  .get(roomController.retrieveByGuid)
app.route('/rooms/:guid/change-host')
  .post(roomController.changeHost)
app.route('/rooms/:guid/join-or-leave')
  .post(roomController.joinOrLeave)

/**
 * Auth
 */
app.post('/auth/login', authController.login)
app.get('/auth/parse', authController.parseToken)

export default app
