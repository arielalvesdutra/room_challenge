import HttpStatus from 'http-status-codes'
import supertest from 'supertest'
import app from '../../src/configs/custom-express'
import { ErrorConst } from '../../src/consts/message-consts'
import UserDAO from '../../src/daos/UserDAO'
import User from '../../src/entities/User'
import authService from '../../src/services/auth-service'

const request = supertest(app)
const defaultUser = {
  password: '123456',
  username: 'geralt',
}
let userId: any


beforeEach(async () => {
  await UserDAO.truncate()
  
  let userIdInArray: any = await UserDAO.save(defaultUser)
  userId = userIdInArray && userIdInArray.length ? userIdInArray[0] : -1
})

describe('Routes: User', () => {

  describe('GET /users', () => {
    test('should return a list of users', async (done: any) => {
      request
        .get('/users')
        .end((err: any, response: any) => {
          const firstUser: User = response.body[0]

          expect(response.statusCode).toBe(HttpStatus.OK)
          expect(response.body.length).toBe(1)
          expect(firstUser.username).toBe(defaultUser.username)
          expect(firstUser.id).not.toBeNull()
          expect(firstUser.created_at).not.toBeNull()
          expect(firstUser.updated_at).not.toBeNull()
          done(err)
        })
    })
  })

  describe('POST /users', () => {

    test('should create user and return status code 201',
      async (done: any) => {
        request
          .post('/users')
          .send({
            username: 'yennefer',
            password: '789465'
          })
          .end((err: any, response: any) => {
            expect(response.statusCode).toBe(HttpStatus.CREATED)
            expect(response.body.message).toBe("user inserted with success")
            done(err)
          })
      })

    test('without request body should return status code 400 with error message',
      async (done: any) => {
        request
          .post('/users')
          .send()
          .end((err: any, response: any) => {
            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
            expect(response.body.message).toBe("something went wrong")
            done(err)
          })
      })   

  })

  describe('GET /users/:id', () => {
    test('should return a user by id', async (done: any) => {

      request
        .get(`/users/${userId}`)
        .end((err: any, response: any) => {
          const user: User = response.body

          expect(response.statusCode).toBe(HttpStatus.OK)
          expect(user.username).toBe(defaultUser.username)
          expect(user.id).toBe(1)
          expect(user.created_at).not.toBeNull()
          expect(user.updated_at).not.toBeNull()
          done(err)
        })
    })
  })

  describe('PUT /users/:id', () => {

    test('should update a user by id', async (done: any) => {
      const existingUser: User = await UserDAO.findById(userId)
      const updateDto = {
        password: '789132',
        mobile_token: 'DRUSFYG@BH#NJ@OASD'
      }
      const token = authService.generateToken({ id: userId, username: defaultUser.username })

      request
        .put(`/users/${userId}`)
        .set('Authorization', token)
        .send(updateDto)
        .end(async (err: any, response: any) => {
          const updatedUser: User = await UserDAO.findById(userId)

          expect(response.statusCode).toBe(HttpStatus.OK)
          expect(response.body.message).toBe('User updated with success')
          expect(updatedUser.updated_at).not.toBe(existingUser.updated_at)
          expect(updatedUser.password).not.toBe(existingUser.password)
          expect(updatedUser.mobile_token).not.toBe(existingUser.mobile_token)
          done(err)
        })
    })

    test('without request body should return status code 400', async (done: any) => {
      const token = authService.generateToken({ id: userId, username: defaultUser.username })

      request
        .put(`/users/${userId}`)
        .set('Authorization', token)
        .end((err: any, response: any) => {

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
          expect(response.body.message).toBe('invalid data for update a user')
          done(err)
        })
    })

    test('without token should return status code 401', async (done: any) => {

      const updateDto = {
        password: '789132',
        mobile_token: 'DRUSFYG@BH#NJ@OASD'
      }

      request
        .put(`/users/${userId}`)
        .send(updateDto)
        .end((err: any, response: any) => {

          expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED)
          expect(response.body.message).toBe('Authorization header is required')
          done(err)
        })
    })

  })

  describe('DELETE /users/:id', () => {

    test('should delete a user by id', async (done: any) => {
      
      const token = authService.generateToken({ id: userId, username: defaultUser.username })

      request
        .delete(`/users/${userId}`)
        .set('Authorization', token)        
        .end(async (err: any, response: any) => {
          const fetchedUser: User = await UserDAO.findById(userId)

          expect(response.statusCode).toBe(HttpStatus.OK)
          expect(response.body.message).toBe('User excluded with success')
          expect(fetchedUser).toBe(undefined)
          done(err)
        })
    })

    test('delete another user by id should return status code 403',
         async (done: any) => {
      
      const token = authService.generateToken({ id: userId, username: defaultUser.username })
      const otherUserIdInArray:any = await UserDAO.save({ username:'test', password: 'asdfgh' })

      request
        .delete(`/users/${otherUserIdInArray[0]}`)
        .set('Authorization', token)        
        .end(async (err: any, response: any) => {
          expect(response.statusCode).toBe(HttpStatus.FORBIDDEN)
          expect(response.body.message).toBe(ErrorConst.ERROR_403)
          done(err)
        })
    })

  })
})
