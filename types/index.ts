import type { Request } from 'express'

export interface BlogRequest extends Request {
  user?: {}
}
