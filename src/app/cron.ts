import cron from 'node-cron'
import { liveService } from '../service/live.service.js'

export function setupCron() {
  cron.schedule('0 3 * * *', () => {
    liveService.clearRoom()
  })
}
