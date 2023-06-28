import express from 'express'
import { articleController } from '../controller/article.controller.js'
import { userTokenCheckMiddleware } from '../middleware/auth.middleware.js'

const router = express.Router()
const PREFIX = '/user'

enum articleEnum {
  GETARTICLE = 'getarticle',
  SUBMITARTICLE = 'submitarticle',
}

// getArticle
router.post(
  `${PREFIX}/${articleEnum.GETARTICLE}`,
  [
    userTokenCheckMiddleware,
    articleController.getArticle,
  ],
)

// emitArticle
router.post(
  `${PREFIX}/${articleEnum.SUBMITARTICLE}`,
  [
    userTokenCheckMiddleware,
    articleController.submitArticle,
  ],
)
