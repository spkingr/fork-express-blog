import cron from 'node-cron'
import { liveService } from '../service/live.service'

// 每分钟清理一次人数为0的房间
cron.schedule('0 3 * * *', () => {
  liveService.clearRoom()
})
