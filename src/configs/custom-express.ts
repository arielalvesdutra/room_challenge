
import HomeController from '../controllers/home-controller'
import RoomController from '../controllers/room-controller'
import UserController from '../controllers/user-controller'
import express from 'express'
import AuthController from '../controllers/auth-controller'

const app = express()
app.use(express.json())

/**
 * Home
 */
app.get('/',HomeController.home)

/**
 * Users
 */
app.route('/users')
  .get(UserController.retrieveAll)
  .post(UserController.create)
app.route('/users/:id')
  .get(UserController.retrieveById)
  .put(UserController.update)
  .delete(UserController.deleteById)

/**
 * Rooms
 */
app.route('/rooms') 
  .get(RoomController.retrieveAll)
  .post(RoomController.create)
app.route('/rooms/:guid')
  .get(RoomController.retrieveByGuid)
app.route('/rooms/:guid/change-host')
  .post(RoomController.changeHost)
app.route('/rooms/:guid/join-or-leave')
  .post(RoomController.joinOrLeave)

/**
 * Auth
 */
app.post('/auth/login', AuthController.login)
app.get('/auth/parse', AuthController.parseToken)

export default app
