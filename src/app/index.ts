import express from 'express'
import cors from 'cors'
import { userRouter } from '../router/user.route.js'
import { errorHandlerMiddleware } from './errorhandler.js'

const app = express()

// for parsing application/json
app.use(express.json())
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))
// for static file
app.use(express.static('public'))
// cors
app.use(cors())

// Hello World!
// app.get('/', (req, res) => {
//   res.send('<h1>hello world!</H1>')
// })

// Routes
app.use(userRouter)
// Error Handler
app.use(errorHandlerMiddleware)

// export
export default app
