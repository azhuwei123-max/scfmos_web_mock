import request from '@/config/axios'


export const getApprovalOpinionDetail = async (params) => {
  return await request.get({ url: `/system/modelManage/apply/getModelComment`,params}) 
}

// 提交审批意见
export const saveApprovalOpinion =async (data) =>{
  return await request.post({ url: `/system/modelManage/apply/saveModelComment`, data })
}


export const submitApprovalOpinion =async (data) =>{
  await new Promise((resolve) => setTimeout(resolve,300))

  return {
  }
}



export const deleteApprovalOpinion = async (data) =>{
  return await request.post({ url: `/system/modelManage/apply/deleteModelComment`,data})
}