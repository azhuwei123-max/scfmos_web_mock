import request from "@/config/axios";


export type CreditFlowSubmitReqVo = {
  serialNo: string
  phaseNo: string
  nextUserRole: string
  nextUserInfo: string
}

// 流程提交
export const submit = async (data: CreditFlowSubmitReqVo) => {
  return await request.post({
    url: '/system/credit-flow/submit',
    data: data
  })
}

export const backHost = async (data) => {
  return await request.post({
    url: '/system/credit-flow/back',
    data: data
  })
}

export const getNextSelectUsers = async (params) => {
  return await request.get({
    url: '/system/credit-flow/next-select-users',
      params
  })
}

export const CreditFlowSubksk = {
  // 查询待处理申请分页
  submit:async(data) => {
    return await request.get({url: '/system/credit-flow/submit', data: data})
  }
}

// 流程收回
export const withdraw = async (data: CreditFlowSubmitReqVo) => {
  return await request.post({
    url: '/system/credit-flow/withdraw',
    data: data
  })
}


