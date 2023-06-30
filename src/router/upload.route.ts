import express from 'express'
import { uploadController } from '../controller/upload.controller.js'

const router = express.Router()
const PREFIX = '/upload'

enum uploadEnum {
  ASSETS = 'assets',
  ARTICLE = 'article',
  MERGE = 'merge',
}

/**
 * @params {string} name
 * @params {number} size
 * @params {number} index
 * @params {number} total
 * @params {string} type
 */
router.post(
  `${PREFIX}/${uploadEnum.ASSETS}`,
  [
    // userTokenCheckMiddleware,
    uploadController.uploadAssets,
  ],
)

/**
 * @params {string} name
 * @params {number} size
 * @params {number} index
 * @params {number} total
 * @params {string} type
 */
router.post(
  `${PREFIX}/${uploadEnum.ARTICLE}`,
  [
    // userTokenCheckMiddleware,
    uploadController.uploadArticle,
  ],
)

/**
 * @params {string} name
 * @params {string} type
 */
router.post(
  `${PREFIX}/${uploadEnum.MERGE}`,
  [
    // userTokenCheckMiddleware,
    uploadController.merge,
  ],
)

export const uploadRouter = router
