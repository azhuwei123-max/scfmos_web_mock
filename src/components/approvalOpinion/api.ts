import request from '@/config/axios'


export const bpmCommentApi  = {
  // 列表
  getCheckOpinionTab:async(params)=> {
    return await request.get({url:`/system/bpmComment/getCheckOpinionTab`,params})
  },
  getRelativeObjNo:async(params)=> {
    return await request.get({url:`/system/bpmComment/getRelativeObjNo`,params})
  },

  getDetail:async (params) => {
    return await request.get({ url: `/system/bpmComment/get`,params}) 
  },
  saveApprovalOpinion:async (data) =>{
    return await request.post({ url: `/system/bpmComment/save`, data })
  },
  deleteApprovalOpinion:async (id) =>{
    return await request.delete({ url: `/system/bpmComment/delete?id=`+id })
  },

  removeApprovalOpinion:async (data) =>{
    return await request.post({ url: `/system/bpmComment/remove`,data })
  },

  
  getFlowTaskByObjNoAndTypeAndPhaseNo:async (params) => {
    return await request.get({ url: `/system/credit-flow/getFlowTaskByObjNoAndTypeAndPhaseNo`,params}) 
  },

  getBusiConByCreditCon:async (params) => {
    return await request.get({ url: `/system/bpmComment/getBusiConByCreditCon`,params}) 
  },
}