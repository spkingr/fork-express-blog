import { body, validationResult } from 'express-validator'
import { LiveErrorEnum, liveError } from '../error/live.error.js'
import type { ExpressValidator } from '../types'

/* 数据合法性检查 */
export const createLiveValidateMiddleware: ExpressValidator = [
  body('host_id').notEmpty().withMessage(LiveErrorEnum.ERROR_PARAMS),
  body('host_name').notEmpty().withMessage(LiveErrorEnum.ERROR_PARAMS),
  body('host_id').isLength({ min: 2, max: 20 }).withMessage(LiveErrorEnum.ERROR_HOST),
  body('host_name').isLength({ min: 2, max: 20 }).withMessage(LiveErrorEnum.ERROR_HOST),
  (req, res, next) => {
    const errors = validationResult(req.body)
    if (!errors.isEmpty()) {
      // 取出第一个错误
      const firstError = errors.array()[0]
      // 找到与第一个错误匹配的枚举类型
      const error = liveError[firstError.msg as LiveErrorEnum]
      return next(error)
    }
    next()
  },
]
