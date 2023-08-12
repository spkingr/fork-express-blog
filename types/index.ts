import type { NextFunction, Request, Response } from 'express'
import type { Socket } from 'socket.io'
import type { ValidationChain } from 'express-validator'

// 继承Request-------------------------------------
export interface BlogRequest extends Request {
  user?: any
}

// 继承Socket--------------------------------------
export interface ISocket extends Socket {
  roomID?: string
}

// 定义一个全局Middleware类型------------------------
export type Middleware = (req: BlogRequest, res: Response, next: NextFunction) => void

// 定义一个全局Error Middleware类型-------------------------------------
export type ErrorMiddleware = (err: any, req: BlogRequest, res: Response, next: NextFunction) => void

// 定义一个全局Validator类型，基于express-validate-----------------------
export type Validator = ValidationChain[]
export type ExpressValidator = [...Validator, Middleware]
