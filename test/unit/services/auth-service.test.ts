import authService from '../../../src/services/auth-service'
import GenerateTokenDTO from '../../../src/dtos/services/auth/GenerateTokenDTO'


describe("Services: AuthService", () => {

  describe('generateToken()', () => {

    test('generate and decode token should work', () => {
      
      const dto: GenerateTokenDTO = {
        id: 1,
        username: 'geralt'
      }

      const token = authService.generateToken(dto)
      const decodedToken:any = authService.decodeToken(token)

      expect(token).not.toBeNull()
      expect(decodedToken.id).toBe(dto.id)
      expect(decodedToken.username).toBe(dto.username)
    })

  })

})
