import express from 'express'
import { liveController } from '../controller/live.controller.js'

const router = express.Router()
const PREFIX = '/live'

enum liveEnum {
  GETROOM = 'getrooms',
  ADDROOM = 'addroom',
  DELETEROOM = 'deleteroom',
  JOINROOM = 'joinroom',
}

// getRooms
router.post(
  `${PREFIX}/${liveEnum.GETROOM}`,
  [
    // userTokenCheckMiddleware,
    liveController.getRooms,
  ],
)

// addRoom
router.post(
  `${PREFIX}/${liveEnum.ADDROOM}`,
  [
    // userTokenCheckMiddleware,
    liveController.createRoom,
  ],
)

export const liveRouter = router
