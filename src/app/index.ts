import express from 'express'
import { userRouter } from '../router/user.route.js'
import { errorHandlerMiddleware } from './errorhandler.js'

const app = express()

// base--------------------------------------------------
// for parsing application/json
app.use(express.json())
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))
// for static file
app.use(express.static('public'))
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})
// --------------------------------------------------------

// Routes
app.use(userRouter)
// Error Handler
app.use(errorHandlerMiddleware)

// export
export default app
