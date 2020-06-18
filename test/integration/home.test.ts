import HttpStatus from 'http-status-codes'
import supertest  from 'supertest'
import app from '../../src/configs/custom-express'

const request = supertest(app)

describe('Routes: Home', () => {

  test('GET /', async (done:any) => {
    request
      .get('/')
      .end((err:any, res: any) => {
        
        expect(res.statusCode).toBe(HttpStatus.OK)
        expect(res.body).toMatchObject({ 
          message: 'Welcome to the room challenge!' 
        })
        done()
      })
  })
})

