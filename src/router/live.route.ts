import express from 'express'
import { liveController } from '../controller/live.controller.js'
import { userTokenCheckMiddleware } from '../middleware/auth.middleware.js'

const router = express.Router()
const PREFIX = '/live'

enum liveEnum {
  GETLIVE = 'getlive',
  ADDLIVE = 'addlive',
  DELETELIVE = 'deletelive',
  JOINLIVE = 'joinlive',
}

// getLive
router.post(
  `${PREFIX}/${liveEnum.GETLIVE}`,
  [
    userTokenCheckMiddleware,
    liveController.getLive,
  ], 
)

// addLive
router.post(
  `${PREFIX}/${liveEnum.ADDLIVE}`,
  [
    userTokenCheckMiddleware,
    liveController.addLive,
  ],
)
