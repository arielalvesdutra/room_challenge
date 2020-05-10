import app from './configs/custom-express'
import * as dotenv from "dotenv"

dotenv.config()
const port = process.env.PORT;

if (port == undefined) {
  throw Error('Please, is mandatory to specify the server port!')
}

app.listen(port, () => console.log(`Server is listening on ${port}`))
