import { isEmptyString } from '../../../src/helpers/string-helper'


describe('Helpers: string-helper', () => {
  describe('isEmptyString()', () => {
    
    test('empty string should return true', () => {

     const isEmpty: boolean = isEmptyString('')

     expect(isEmpty).toBe(true)
    })


    test('not empty string should return false', () => {

      const isEmpty: boolean = isEmptyString('teste')
 
      expect(isEmpty).toBe(false)
     })
    
  })
})
