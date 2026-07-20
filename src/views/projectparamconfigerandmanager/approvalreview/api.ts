import request from '@/config/axios'

export const getMenuList = (params) => {
  return request.get({ url: '/system/paramAdjust/aprrovalTreeList', params})
}

export const getParamAdjustAprrovalPage = (params) => {
  return request.get({ url: '/system/paramAdjust/aprrovalPage', params})
}

export const getSelectAutoProjectList = () => {
  return new Promise((resolve)=> {
    console.log('[ 111 ] >', 111)
    setTimeout(()=>{
      resolve({
        total: 0,
        list: []
      })
    },1000)
  })
}

/** 挑选列表 */
export const aprrovalOptionPage = (params) => {
  return request.get({ url: '/system/paramAdjust/aprrovalOptionPage', params})
}

// 挑选
export const aprrovalOptionConfirm = (data) => {
  return request.post({ url: '/system/projectCoreviewApply/aprrovalOptionConfirm', data })
}

// 挑选取消
export const aprrovalOptionCancel = (data) => {
  return request.post({ url: '/system/projectCoreviewApply/aprrovalOptionCancel', data })
}

export const deleteApprovalOpinion = async (params) =>{
  return await request.delete({ url: `/system/bpmComment/delete`, params })
}

export const removeApprovalOpinion = async (data) =>{
  return await request.post({ url: `/system/bpmComment/remove`, data })
}
/** 点击提交前校验是否已经保存签署意见 */
export const checkComment = (params) => {
  return request.get({ url: 'system/modelManage/apply/checkComment', params })
}