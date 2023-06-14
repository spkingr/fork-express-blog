import type { NextFunction, Response } from 'express'
import type { BlogRequest } from '../types/index.js'

// 定义一个全局Middleware类型
export type Middleware = (req: BlogRequest, res: Response, next: NextFunction) => void

// 定义一个全局Error Middleware类型
export type ErrorMiddleware = (err: any, req: BlogRequest, res: Response, next: NextFunction) => void
