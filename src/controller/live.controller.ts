import type { Middleware } from '../types'
import { liveService } from '../service/live.service.js'

class LiveController {
  createRoom: Middleware = async (req, res, next) => {
    const data = req.body
    const meetinginfo = await liveService.createRoom(data)
    res.json({
      code: 200,
      message: '会议创建成功',
      data: meetinginfo,
    })
  }

  getRooms: Middleware = async (req, res, next) => {

  }
}

export const liveController = new LiveController()
