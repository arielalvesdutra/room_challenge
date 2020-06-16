import HttpStatus from 'http-status-codes'
import supertest from 'supertest'
import app from '../../src/configs/custom-express'
import { AuthConst, ErrorConst } from '../../src/consts/message-consts'
import UserDAO from '../../src/daos/UserDAO'
import LoginRequestDTO from '../../src/dtos/controllers/auth/LoginRequestDTO'
import { cloneObject } from '../../src/helpers/object-helper'

const request = supertest(app)
const defaultUser = {
  password: '123456',
  username: 'geralt'
}

beforeEach(async () => {
  await UserDAO.truncate()

  await UserDAO.save(cloneObject(defaultUser))
})

describe('Routes: Auth', () => {

  describe('POST /auth/login', () => {

    test('login should work', async (done: any) => {

      const loginDto: LoginRequestDTO = {
        password: defaultUser.password,
        username: defaultUser.username
      }

      request
        .post('/auth/login')
        .send(loginDto)
        .end((err: any, response: any) => {
          expect(response.statusCode).toBe(HttpStatus.OK)
          expect(response.body.token).not.toBeNull()
          done()
        })
    })


    test('login with invalid user credential should return error message', async (done: any) => {
      const loginDto: LoginRequestDTO = {
        password: 'sajdisjdiasj',
        username: 'sahdqhasdsas'
      }

      request
        .post('/auth/login')
        .send(loginDto)
        .end((err: any, response: any) => {
          expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED)
          expect(response.body.message).toBe(AuthConst.INVALID_USER_OR_PASSWORD)
          done(err)
        })
    })

    test('login with invalid request body should return error message', async (done: any) => {
      request
        .post('/auth/login')
        .end((err: any, response: any) => {
          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
          expect(response.body.message).toBe(ErrorConst.ERROR_400_INVALID_REQUEST)
          done()
        })
    })

  })

})
