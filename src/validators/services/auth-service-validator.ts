/**
 * Validate the mandatory information that one
 * decoded token must have.
 * 
 * @param decodedToken
 */
const validateDecodedToken = (decodedToken: any) => {
  if (!decodedToken || !decodedToken.id || !decodedToken.username) {
    throw new Error("Invalid user")
  }
}

export default {
  validateDecodedToken
}
