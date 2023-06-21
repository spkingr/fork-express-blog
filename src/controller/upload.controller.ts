import path from 'node:path'
import fs from 'node:fs'
import { rimraf } from 'rimraf'
import type fileUpload from 'express-fileupload'
import type { Middleware } from '../types'
import { UploadErrorEnum, uploadError } from '../error/upload.error.js'

enum uploadFile {
  ASSETS = 'assets',
  ARTICLE = 'article',
}

// todo
// 1. 前端分片文件哈希计算
// 2. 断点续传
// 3. 秒传
// 4. 错误重传

class UploadController {
  public allowedAssetsType = ['.jpeg', '.jpg', '.png', '.gif', '.webp']
  public allowedArticleType = ['.md']

  public IMAGE_SIZE_LIMIT = 1024 * 1024 * 10
  public ARTICLE_SIZE_LIMIT = 1024 * 1024 * 100

  public BASE_PATH = path.join(process.cwd(), 'public')
  public ASSETS_PATH = path.join(this.BASE_PATH, uploadFile.ASSETS)
  public ARTICLE_PATH = path.join(this.BASE_PATH, uploadFile.ARTICLE)

  public assetsChunksign = 'IMAGE_CHUNK'
  public articleChunksign = 'ARTICLE_CHUNK'

  private currentType: uploadFile = uploadFile.ASSETS

  uploadAssets: Middleware = async (req, res, next) => {
    const fileInfo = req.body
    const file = req.files!.file as fileUpload.UploadedFile

    const parsedPath = path.parse(fileInfo.name)

    // 检查文件类型
    if (!this.extnameCheck(parsedPath.ext, uploadFile.ASSETS))
      return next(uploadError[UploadErrorEnum.ERROR_TYPE])
    // 检查文件大小
    if (!this.sizeCheck(fileInfo.size, uploadFile.ASSETS))
      return next(uploadError[UploadErrorEnum.ERROR_SIZE])

    // 检查是否存在文件夹 /public/images/[filename] 不存在则创建
    const dir = path.join(this.ASSETS_PATH, parsedPath.name)
    if (!fs.existsSync(dir))
      fs.mkdirSync(dir, { recursive: true }) // 多级创建

    // 将传入的文件写入到 /public/image/[filename]/[filename][index] 中
    const filePath = path.join(dir, `${parsedPath.name}${this.assetsChunksign}${fileInfo.index}`)
    fs.writeFileSync(filePath, file.data)

    // 返回成功
    this.currentType = uploadFile.ASSETS
    res.json({
      code: 200,
      message: '上传成功',
      data: {
        message: `chunk${fileInfo.index}[上传][写入]成功`,
      },
    })
  }

  uploadArticle: Middleware = async (req, res, next) => {
    const fileInfo = req.body
    const file = req.files!.file as fileUpload.UploadedFile

    const parsedPath = path.parse(fileInfo.name)

    // 检查文件类型
    if (!this.extnameCheck(parsedPath.ext, uploadFile.ARTICLE))
      return next(uploadError[UploadErrorEnum.ERROR_TYPE])
    // 检查文件大小
    if (!this.sizeCheck(fileInfo.size, uploadFile.ARTICLE))
      return next(uploadError[UploadErrorEnum.ERROR_SIZE])

    // 检查是否存在文件夹 /public/images/[filename] 不存在则创建
    const dir = path.join(this.ARTICLE_PATH, parsedPath.name)
    if (!fs.existsSync(dir))
      fs.mkdirSync(dir, { recursive: true }) // 多级创建

    // 将传入的文件写入到 /public/image/[filename]/[filename][index] 中
    const filePath = path.join(dir, `${parsedPath.name}${this.articleChunksign}${fileInfo.index}`)
    fs.writeFileSync(filePath, file.data)

    // 返回成功
    this.currentType = uploadFile.ARTICLE
    res.json({
      code: 200,
      message: '上传成功',
      data: {
        message: `chunk${fileInfo.index}[上传][写入]成功`,
      },
    })
  }

  merge: Middleware = async (req, res, next) => {
    const { name } = req.body
    const parsedPath = path.parse(name)
    // 1. 区分文件类型
    const { sign, path: filePath } = this.getUploadabpout()
    // 2. 找到需要合并的文件 并读取到全部文件信息
    const dir = path.join(filePath, parsedPath.name) // /public/[filetype]/[filename] 之前的临时文件
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
      const index = Number(file.split(sign)[1])
      arr[index] = file
    })
    // 2.2 合并文件
    const mergePath = path.join(filePath, `${parsedPath.name}${parsedPath.ext}`)
    arr.forEach((file) => {
      const targetFile = fs.readFileSync(path.join(dir, file))
      fs.appendFileSync(mergePath, targetFile)
    })
    // 3 删除之前的临时文件
    rimraf.sync(dir)

    res.json({
      code: 200,
      message: '文件合并成功',
      data: {
        path: mergePath.slice(this.BASE_PATH.length),
      },
    })
  }

  // utils ------------------------------------------
  extnameCheck(extname: string, type: uploadFile): boolean {
    if (type === uploadFile.ASSETS)
      return this.allowedAssetsType.includes(extname.toLocaleLowerCase())
    if (type === uploadFile.ARTICLE)
      return this.allowedArticleType.includes(extname.toLocaleLowerCase())
    return false
  }

  sizeCheck(size: number, type: uploadFile): boolean {
    if (type === uploadFile.ASSETS)
      return size <= this.IMAGE_SIZE_LIMIT
    if (type === uploadFile.ARTICLE)
      return size <= this.ARTICLE_SIZE_LIMIT
    return false
  }

  getUploadabpout() {
    if (this.currentType === uploadFile.ASSETS) {
      return {
        path: this.ASSETS_PATH,
        sign: this.assetsChunksign,
      }
    }
    if (this.currentType === uploadFile.ARTICLE) {
      return {
        path: this.ARTICLE_PATH,
        sign: this.articleChunksign,
      }
    }
    return {
      path: '',
      sign: '',
    }
  }
}

export const uploadController = new UploadController()
