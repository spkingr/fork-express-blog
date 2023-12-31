import express from 'express'
import cors from 'cors'
import uploader from 'express-fileupload'
import { userRouter } from '../router/user.route.js'
import { uploadRouter } from '../router/upload.route.js'
import { liveRouter } from '../router/live.route.js'
import { errorHandlerMiddleware } from './errorhandler.js'
import { setupCron } from './cron.js'

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
app.use(liveRouter)
// Error Handler
app.use(errorHandlerMiddleware)

setupCron()

// export
export default app
