import express from 'express'
import { liveController } from '../controller/live.controller.js'
import { createLiveValidateMiddleware } from '../middleware/live.middleware.js'

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
    ...createLiveValidateMiddleware,
    liveController.createRoom,
  ],
)

export const liveRouter = router
