export const isEmptyString = (text:string = ''): boolean => {
  if (text == undefined || text == '') {
    return true
  }
  return false
}
