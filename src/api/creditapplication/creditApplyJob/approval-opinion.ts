import request from '@/config/axios'


export const getApprovalOpinionDetail = async (params) => {
  return await request.get({ url: `/system/bpmComment/get`,params}) 
}

// 提交审批意见
export const saveApprovalOpinion =async (data) =>{
  return await request.post({ url: `/system/bpmComment/save`, data })
}


export const submitApprovalOpinion =async (data) =>{
  await new Promise((resolve) => setTimeout(resolve,300))

  return {

  }
}



export const deleteApprovalOpinion = async (id) =>{
  return await request.delete({ url: `/system/bpmComment/delete?id=`+id })
}

export const removeApprovalOpinion = async (data) =>{
  return await request.post({ url: `/system/bpmComment/remove`,data })
}

// 提交审批意见
export const getFlowTaskByObjNoAndTypeAndPhaseNo =async (params) =>{
  return await request.get({ url: `/system/credit-flow/getFlowTaskByObjNoAndTypeAndPhaseNo`, params })
}

