import express from 'express'
import cors from 'cors'
import uploader from 'express-fileupload'
import { userRouter } from '../router/user.route.js'
import { uploadRouter } from '../router/upload.route.js'
import { errorHandlerMiddleware } from './errorhandler.js'

const app = express()

// cors
app.use(cors())
// for parsing application/json
app.use(express.json())
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))
// upload
app.use(uploader())

// Routes
app.use(userRouter)
app.use(uploadRouter)
// Error Handler
app.use(errorHandlerMiddleware)

// export
export default app
