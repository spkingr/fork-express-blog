import express from 'express'
import { uploadController } from '../controller/upload.controller.js'
import { userTokenCheckMiddleware } from '../middleware/auth.middleware.js'

const router = express.Router()
const PREFIX = '/upload'

enum uploadEnum {
  IMAGE = 'image',
  ARTICLE = 'article',
  MERGE = 'merge',
}

router.post(
  `${PREFIX}/${uploadEnum.IMAGE}`,
  [
    userTokenCheckMiddleware,
    uploadController.uploadImage,
  ],
)

router.post(
  `${PREFIX}/${uploadEnum.ARTICLE}`,
  [
    userTokenCheckMiddleware,
    uploadController.uploadArticle,
  ],
)

router.post(
  `${PREFIX}/${uploadEnum.MERGE}`,
  [
    userTokenCheckMiddleware,
    uploadController.merge,
  ],
)

export const uploadRouter = router
