import type { ErrorMiddleware } from '../../types'

export const errorHandlerMiddleware: ErrorMiddleware = (err, req, res, next) => {
  if (err) {
    const { code, message } = err
    return res.json({
      code,
      message,
      data: null,
    })
  }
  next()
}
