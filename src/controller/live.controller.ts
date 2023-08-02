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

  queryRoom: Middleware = async (req, res, next) => {
    const { room_id } = req.body
    const checkinfo = await liveService.queryRoom(room_id)
    return res.json({
      code: 200,
      message: '会议查询成功',
      data: checkinfo,
    })
  }

  getRooms: Middleware = async (req, res, next) => {

  }
}

export const liveController = new LiveController()
