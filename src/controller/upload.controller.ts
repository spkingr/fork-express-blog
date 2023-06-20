import path from 'node:path'
import fs from 'node:fs'
import { rimraf } from 'rimraf'
import type fileUpload from 'express-fileupload'
import type { Middleware } from '../types'
import { UploadErrorEnum, uploadError } from '../error/upload.error.js'

class UploadController {
  public allowedImageType = ['.jpeg', '.jpg', '.png', '.gif', '.webp']
  public allowedArticleType = ['.md']
  public IMAGE_SIZE_LIMIT = 1024 * 1024 * 10
  public ARTICLE_SIZE_LIMIT = 1024 * 1024 * 100

  public imgChunksign = 'IMAGE_CHUNK'
  public articleChunksign = 'ARTICLE_CHUNK'

  uploadImage: Middleware = async (req, res, next) => {
    const fileInfo = req.body
    const file = req.files!.file as fileUpload.UploadedFile
    // 文件名解析
    const parsedPath = path.parse(fileInfo.name)

    // 检查文件类型
    if (!this.extnameCheck(parsedPath.ext))
      return next(uploadError[UploadErrorEnum.ERROR_TYPE])
    // 检查文件大小
    if (!this.sizeCheck(fileInfo.size, 'image'))
      return next(uploadError[UploadErrorEnum.ERROR_SIZE])

    // 检查是否存在文件夹 /public/images/[filename] 不存在则创建
    const dir = path.join(process.cwd(), 'public', 'image', parsedPath.name)
    if (!fs.existsSync(dir))
      fs.mkdirSync(dir, { recursive: true }) // 多级创建

    // 将传入的文件写入到 /public/image/[filename]/[filename][index] 中
    const filePath = path.join(dir, `${parsedPath.name}${this.imgChunksign}${fileInfo.index}`)
    fs.writeFileSync(filePath, file.data)

    // 返回成功
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
    // 文件名解析
    const parsedPath = path.parse(fileInfo.name)

    // 检查文件类型
    if (!this.extnameCheck(parsedPath.ext))
      return next(uploadError[UploadErrorEnum.ERROR_TYPE])
    // 检查文件大小
    if (!this.sizeCheck(fileInfo.size, 'article'))
      return next(uploadError[UploadErrorEnum.ERROR_SIZE])

    // 检查是否存在文件夹 /public/images/[filename] 不存在则创建
    const dir = path.join(process.cwd(), 'public', 'article', parsedPath.name)
    if (!fs.existsSync(dir))
      fs.mkdirSync(dir, { recursive: true }) // 多级创建

    // 将传入的文件写入到 /public/image/[filename]/[filename][index] 中
    const filePath = path.join(dir, `${parsedPath.name}${this.articleChunksign}${fileInfo.index}`)
    fs.writeFileSync(filePath, file.data)

    // 返回成功
    res.json({
      code: 200,
      message: '上传成功',
      data: {
        message: `chunk${fileInfo.index}[上传][写入]成功`,
      },
    })
  }

  merge: Middleware = async (req, res, next) => {
    const { name, type } = req.body
    // 文件名解析
    const parsedPath = path.parse(name)
    // 1. 检查文件类型
    let plublicPath = '' // 文件夹名
    let sign = '' // 文件分割符
    if (type === 'image') {
      sign = this.imgChunksign
      plublicPath = 'image'
    }
    if (type === 'article') {
      sign = this.articleChunksign
      plublicPath = 'article'
    }
    // 2. 找到需要合并的文件 并读取到全部文件信息
    const dir = path.join(process.cwd(), 'public', plublicPath, parsedPath.name)
    const files = fs.readdirSync(dir)
    // 如果没有则返回错误
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
    const mergePath = path.join(process.cwd(), 'public', plublicPath, `${parsedPath.name}${parsedPath.ext}`)
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
        path: mergePath,
      },
    })
  }

  extnameCheck(extname: string): boolean {
    return !!this.allowedImageType.find(ext => ext === extname.toLocaleLowerCase())
  }

  sizeCheck(size: number, type: 'image' | 'article'): boolean {
    if (type === 'image')
      return size <= this.IMAGE_SIZE_LIMIT
    if (type === 'article')
      return size <= this.ARTICLE_SIZE_LIMIT
    return false
  }
}

export const uploadController = new UploadController()
