import path from 'node:path'
import fs from 'node:fs'
import { rimraf } from 'rimraf'
import type fileUpload from 'express-fileupload'
import type { Middleware } from '../../types'
import { UploadErrorEnum, uploadError } from '../error/upload.error.js'

enum uploadFile {
  ASSETS = 'assets',
  ARTICLE = 'article',
}

// 允许的类型
const ASSETS_TYPE = ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.mp4']
const ARTICLE_TYPE = ['.md']
// 允许类型的大小上限
const ASSETS_SIZE_LIMIT = 1024 * 1024 * 100
const ARTICLE_SIZE_LIMIT = 1024 * 1024 * 100
// 各个类型去往哪个文件夹
const BASE_PATH = path.join(process.cwd(), 'public')
const ASSETS_PATH = path.join(BASE_PATH, uploadFile.ASSETS)
const ARTICLE_PATH = path.join(BASE_PATH, uploadFile.ARTICLE)
// 碎片的标志
const ASSETS_CHUNK = 'ASSETS_CHUNK'
const ARTICLE_CHUNK = 'ARTICLE_CHUNK'
// 策略模式
const uploadFileOptions = {
  [uploadFile.ASSETS]: () => ({
    SIGN: ASSETS_CHUNK,
    PATH: ASSETS_PATH,
    SIZE_LIMIT: ASSETS_SIZE_LIMIT,
    ALLOW_TYPE: ASSETS_TYPE,
  }),
  [uploadFile.ARTICLE]: () => ({
    SIGN: ARTICLE_CHUNK,
    PATH: ARTICLE_PATH,
    SIZE_LIMIT: ARTICLE_SIZE_LIMIT,
    ALLOW_TYPE: ARTICLE_TYPE,
  }),
}

// todo
// 1. [x]前端分片文件哈希计算
// 2. [x]断点续传
// 3. [o]秒传
// 4. [x]错误重传

class UploadController {
  private currentType: uploadFile = uploadFile.ASSETS

  writeFileToPublic: Middleware = async (req, res, next) => {
    const fileInfo = req.body
    const file = req.files!.file as fileUpload.UploadedFile

    // 获取path和sign
    const { PATH, SIGN } = uploadFileOptions[this.currentType]()

    // 获取文件信息
    const parsedPath = path.parse(fileInfo.name)

    // 检查文件类型
    if (!this.extnameCheck(parsedPath.ext, this.currentType))
      return next(uploadError[UploadErrorEnum.ERROR_TYPE])
    // 检查文件大小
    if (!this.sizeCheck(fileInfo.size, this.currentType))
      return next(uploadError[UploadErrorEnum.ERROR_SIZE])

    // 检查是否存在文件夹 /public/images/[filename] 不存在则创建
    const dir = path.join(PATH, parsedPath.name)
    if (!fs.existsSync(dir))
      fs.mkdirSync(dir, { recursive: true }) // 递归创建文件夹

    // 将传入的文件写入到 /public/image/[filename]/[filename][index] 中
    const filePath = path.join(dir, `${parsedPath.name}${SIGN}${fileInfo.index}`)
    fs.writeFileSync(filePath, file.data)
  }

  uploadAssets: Middleware = async (req, res, next) => {
    const fileInfo = req.body
    this.currentType = uploadFile.ASSETS
    if (this.identifierCheck(fileInfo.identifier, this.currentType))
      return next(uploadError[UploadErrorEnum.ERROR_IDENTIFIER])
    // 写入文件碎片
    await this.writeFileToPublic(req, res, next)
    // 返回成功
    res.json({
      code: 200,
      message: '上传成功',
      data: {
        message: `静态文件chunk${fileInfo.index}[上传][写入]成功`,
      },
    })
  }

  uploadArticle: Middleware = async (req, res, next) => {
    const fileInfo = req.body
    this.currentType = uploadFile.ASSETS
    if (this.identifierCheck(fileInfo.identifier, this.currentType))
      return next(uploadError[UploadErrorEnum.ERROR_IDENTIFIER])
    // 写入文件碎片
    await this.writeFileToPublic(req, res, next)
    // 返回成功
    res.json({
      code: 200,
      message: '上传成功',
      data: {
        message: `文章chunk${fileInfo.index}[上传][写入]成功`,
      },
    })
  }

  merge: Middleware = async (req, res, next) => {
    const { name } = req.body
    const parsedPath = path.parse(name)
    // 1. 区分文件类型
    const { SIGN, PATH } = uploadFileOptions[this.currentType]()
    // 2. 找到需要合并的文件 并读取到全部文件信息
    const dir = path.join(PATH, parsedPath.name) // /public/[filetype]/[filename] 之前的临时文件
    try {
      fs.accessSync(dir)
    }
    catch (err) {
      return next(uploadError[UploadErrorEnum.ERROR_FILE_NOT_FOUND])
    }
    const files = fs.readdirSync(dir)
    if (!files.length)
      return next(uploadError[UploadErrorEnum.ERROR_FILE_NOT_FOUND])
    // 如果有则合并 并放入 /public/images/[filename]
    // 然后删除 /public/images/[filename]下的所有文件
    // 2.1 排序
    const arr: any[] = []
    files.forEach((file) => {
      const index = Number(file.split(SIGN)[1])
      arr[index] = file
    })
    // 2.2 合并文件
    const mergePath = path.join(PATH, `${parsedPath.name}${parsedPath.ext}`)
    arr.forEach((file) => {
      const targetFile = fs.readFileSync(path.join(dir, file))
      fs.appendFileSync(mergePath, targetFile)
    })
    // 3 删除之前的临时文件
    rimraf.sync(dir)

    res.json({
      code: 200,
      message: '文件合并成功',
      // 给出path
      data: {
        path: mergePath,
      },
    })
  }

  // utils ------------------------------------------
  extnameCheck(extname: string, type: uploadFile): boolean {
    return uploadFileOptions[type]().ALLOW_TYPE.includes(extname)
  }

  sizeCheck(size: number, type: uploadFile): boolean {
    return size <= uploadFileOptions[type]().SIZE_LIMIT
  }

  identifierCheck(identifier: string, type: uploadFile): boolean {
    // 查看对应文件夹下有没有这个文件
    const { PATH } = uploadFileOptions[type]()
    const dir = path.join(PATH, identifier)
    return fs.existsSync(dir)
  }
}

export const uploadController = new UploadController()
