/* 上传的报错 一般以800xx开头 */

export enum UploadErrorEnum {
  ERROR_TYPE = 80001,
  ERROR_SIZE = 80002,
  ERROR_FILE_NOT_FOUND = 80003,
}

export const uploadError = {
  [UploadErrorEnum.ERROR_TYPE]: {
    code: UploadErrorEnum.ERROR_TYPE,
    message: '上传的文件类型不允许',
  },
  [UploadErrorEnum.ERROR_SIZE]: {
    code: UploadErrorEnum.ERROR_SIZE,
    message: '上传的文件大小超过限制',
  },
  [UploadErrorEnum.ERROR_FILE_NOT_FOUND]: {
    code: UploadErrorEnum.ERROR_FILE_NOT_FOUND,
    message: '未找到需要合并的文件',
  },
}
