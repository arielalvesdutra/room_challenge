/**
 * Case is one array, return the first array value.
 * 
 * Case not, return the parameters itself.
 * 
 * @param parameter 
 */
export const getValueIfArray = (parameter :string) => {
  if (parameter.length) {
    return parameter[0]
  }
  return parameter
}
