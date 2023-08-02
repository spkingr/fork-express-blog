import { v4 as uuidv4 } from 'uuid'
import type { LiveAttributes } from '../model/live.model.js'
import { Live } from '../model/live.model.js'

class LiveService {
  async createRoom(live: LiveAttributes) {
    const { host_id, host_name } = live
    const room_id = uuidv4().substring(0, 9)

    const res = await Live.create({
      host_id,
      host_name,
      room_id,
    })
    return res.dataValues
  }

  async queryRoom(room_id: string) {
    const res = await Live.findOne({
      where: { room_id },
    })
    return res ? res.dataValues : null
  }
}

export const liveService = new LiveService()
