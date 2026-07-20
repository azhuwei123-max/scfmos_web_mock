import request from '@/config/axios'

// 上传文件
export const updateFile = (data: any) => {
  return request.upload({ url: '/system/common/file/upload', data })
}

// 下载文件
export const downloadFile = (params: any) => {
  return request.download({ url: '/system/common/file/get', params })
}

export interface ImageGallery {
  objectNo: string
  objectType: string
  customerID: string
}
/** 获取影像资料url
 * objectNo  objectType   customerID
 */
export const getImageGalleryInfo = (params: ImageGallery) => {
   return request.get({ url: '/system/image/url-by-credit', params })
}

// 获取文件列表
export const getFileListByBusinessId = (params) => {
   return request.get({ url: '/system/common/file/getByBusinessId', params })
}

// 删除文件
export const delByBusinessId = (businessId) => {
  return request.delete({ url:`/system/common/file/delByBusinessId?businessId=${businessId}` })
}

// 删除文件
export const delByFile = (fileId = "",fileName = "") => {
  return request.delete({ url:`/system/common/file/delByFile?fileId=${fileId}&fileName=${fileName}` })
}

/**
 * 校验是否已经进入下一流程 
 * @param string objectNo
 * @param string objectType
 */ 
export const getCheckBeforeSave = (params) => {
   return request.get({ url: '/system/bpmComment/checkBeforeSave', params })
}

/**
 * 获取参数
 * @param string baSerialNo
 */
export const getAboutInfo = (params) => {
   return request.get({ url: '/system/business-contract/getAboutInfo', params })
}

/**
 * 检查查看意见（针对授信和单笔授信）
 */
export const checkViewComments = () => {
   return request.get({ url: '/system/credit-apply/checkViewComments' })
}