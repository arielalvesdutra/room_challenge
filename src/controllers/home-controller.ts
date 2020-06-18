import { Request, Response } from "express"
import { HomeConst } from '../consts/message-consts'

/**
 * Home Controller.
 */
const HomeController = () => {

  /**
   * Home route.
   * 
   * @param request 
   * @param response 
   */
  const home = (request: Request, response: Response) => {
    response.send({
      message: HomeConst.WELLCOME_MESSAGE
    })
  }

  return { home }
}

export default HomeController
