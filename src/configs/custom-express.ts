
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
app.route('/users/:id/rooms')
  .get(RoomController.retrieveByParticipant)

/**
 * Rooms
 */
app.route('/rooms')
  .post(RoomController.create)
app.route('/rooms/:roomId')
  .get(RoomController.retrieveByGuid)
app.route('/rooms/:roomId/change-host')
  .post(RoomController.changeHost)
app.route('/rooms/:roomId/join-or-leave')
  .post(RoomController.joinOrLeave)


  /**
   * Auth
   */
app.post('/auth/login', AuthController.login)
app.get('/auth/parse', AuthController.parseToken)

export default app
