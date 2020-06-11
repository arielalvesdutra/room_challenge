import HttpStatus from 'http-status-codes'
import request  from 'supertest'
import app from '../../src/configs/custom-express'


describe('Routes: Home', () => {

  test('GET /', async (done:any) => {
    request(app)
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

