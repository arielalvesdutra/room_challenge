import { Request, Response } from "express"

/**
 * 
 * @param request 
 * @param response 
 */
const home = (request: Request, response: Response) => {
    response.send({
      message: "Welcome to the room challenge!"
    })
 }

export default {  home }
