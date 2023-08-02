import express from 'express'
import { liveController } from '../controller/live.controller.js'
import { createRoomValidateMiddleware, queryRoomValidateMiddleware } from '../middleware/live.middleware.js'

const router = express.Router()
const PREFIX = '/live'

enum liveEnum {
  GETROOM = 'getRooms',
  ADDROOM = 'addRoom',
  DELETEROOM = 'deleteRoom',
  QUERYROOM = 'queryRoom',
}

/**
 * @params null
 * @return {Array} rooms
 */
router.get(
  `${PREFIX}/${liveEnum.GETROOM}`,
  [
    liveController.getRooms,
  ],
)

/**
 * @params {string} host_id
 * @params {string} host_name
 * @return {Object} roominfo
 * @description create a room
 */
router.post(
  `${PREFIX}/${liveEnum.ADDROOM}`,
  [
    ...createRoomValidateMiddleware,
    liveController.createRoom,
  ],
)

router.post(
  `${PREFIX}/${liveEnum.QUERYROOM}`,
  [
    ...queryRoomValidateMiddleware,
    liveController.queryRoom,
  ],
)

export const liveRouter = router
