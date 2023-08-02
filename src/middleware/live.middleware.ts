import { body, validationResult } from 'express-validator'
import { LiveErrorEnum, liveError } from '../error/live.error.js'
import type { ExpressValidator } from '../types'

/*
 * 创建房间
 * 数据合法性检查
 */
export const createRoomValidateMiddleware: ExpressValidator = [
  body('host_id').notEmpty().withMessage(LiveErrorEnum.ERROR_PARAMS),
  body('host_name').notEmpty().withMessage(LiveErrorEnum.ERROR_PARAMS),
  body('host_id').isLength({ min: 2, max: 20 }).withMessage(LiveErrorEnum.ERROR_HOST),
  body('host_name').isLength({ min: 2, max: 20 }).withMessage(LiveErrorEnum.ERROR_HOST),
  (req, res, next) => {
    const errors = validationResult(req)
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

/*
 * 查询房间
 * 数据合法性检查
 */
export const queryRoomValidateMiddleware: ExpressValidator = [
  body('room_id').notEmpty().withMessage(LiveErrorEnum.ERROR_PARAMS),
  body('room_id').isLength({ min: 9, max: 9 }).withMessage(LiveErrorEnum.ERROR_PARAMS),
  (req, res, next) => {
    const errors = validationResult(req)
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
