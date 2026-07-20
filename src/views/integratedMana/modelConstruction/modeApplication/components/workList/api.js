import request from '@/config/axios'

// 列表接口
export const getProjectCoreviewPage = (params) => {
  return request.get({ url: '/system/modelManage/apply/getModelReqPage',params})
}

// 新增
export const qryCoreviewApplyCustomerPage = (params) => {
  return request.get({ url: '/system/projectCoreviewApply/qryCoreviewApplyCustomerPage', params })
}

// 删除
export const deleteApply = (id) => {
  return request.delete({ url: `/system/modelManage/apply/deleteModelReq?serialNo=${id}`})
}



/** 根据项目号获取决策模板页面 */
export const getTemplateInfo = (params) => {
  return request.get({ url: '/system/modelManage/apply/getTemplateInfo', params})
}

/** 根据项目号获取模板内容数据 */
export const getTemplateValue = (params) => {
  return request.get({ url: '/system/modelManage/apply/getTemplateValue', params})
}


/** 获取uuid */
export const getModelAddReq = (params) => {
  return request.get({ url: '/system/modelManage/apply/modelAddReq', params})
}


// 保存

export const addSave = (params) =>{
  return request.get({ url: '/system/modelManage/apply/addSave', params})
}

// 点击提交前校验是否已经保存签署意见

export const checkComment = (params) =>{
  return request.get({ url: '/system/modelManage/apply/checkComment', params})
}

