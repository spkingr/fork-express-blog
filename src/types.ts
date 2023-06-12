import type { NextFunction, Request, Response } from 'express'

// 定义一个全局Middleware类型
export type Middleware = (req: Request, res: Response, next: NextFunction) => void
