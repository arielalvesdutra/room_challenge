import { cloneObject } from '../../../src/helpers/object-helper'


describe('Helpers: object-helper', () => {
  describe('cloneObject()', () => {
    
    test('clone object should work', () => {

      const originalObject:any = {
        name: 'Geralt'
      }
  
      const clonedObject:any = cloneObject(originalObject)
      clonedObject.name = 'Yennefer'
  
      expect(originalObject.name).toBe('Geralt')
      expect(clonedObject.name).toBe('Yennefer')
    })
    
  })
})
