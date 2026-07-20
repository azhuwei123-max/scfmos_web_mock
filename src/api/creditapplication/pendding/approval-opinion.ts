import request from '@/config/axios'


export const getApprovalOpinionDetail = async (businessKey,taskId,processInstanceId) => {
  return await request.get({ url: `/system/work/audit-work/get-comment?businessId=` + businessKey+'&taskId='+taskId+'&processInstanceId='+processInstanceId}) 
}

// 提交审批意见
export const saveApprovalOpinion =async (data) =>{
  return await request.post({ url: `/system/work/audit-work/create-comment`, data })
}


export const submitApprovalOpinion =async (data) =>{
  await new Promise((resolve) => setTimeout(resolve,300))

  return {

  }
}



export const deleteApprovalOpinion =async (data) =>{
  await new Promise((resolve) => setTimeout(resolve,300))

  return {

  }
}