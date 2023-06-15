import type { Request } from 'express'

// extend the express Request type
export interface BlogRequest extends Request {
  user?: any
}
