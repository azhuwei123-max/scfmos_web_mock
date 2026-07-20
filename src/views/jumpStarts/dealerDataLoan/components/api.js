import request from '@/config/axios'

// 工作台
export const getTodoCount = (params) => {
  return request.get({ url: '/system/quickStart/getTodoCount', params })
}

// 经销商数据贷
export const coreEntpProList = (params) => {
  return request.get({ url: '/system/business-contract/coreEntpProList', params })
}

// 经销商数据贷
export const customerListByProject = (params) => {
  return request.get({ url: '/system/customerinfo/customerListByProject', params })
}

// 关联主列表
export const getSingUnitCount = (params) => {
  return request.get({ url: '/system/teamwork/team-work-project/getSingUnitCount', params })
}

// // 关联
export const getCompAndSelfList = (params) => {
  return request.get({ url: '/system/customerinfo/getCompAndSelfList', params })
}

// // 关联校验
export const getCustIsProjRelative = (params) => {
  return request.get({ url: '/system/teamwork/team-work-project/getCustIsProjRelative', params })
}

// 关联
export const add = (data) => {
  return request.post({ url: '/system/teamwork/relative/add', data })
}
// 新增
export const addCustomer = (data) => {
  return  request.post({url:`/system/customerinfo/addCustomer`,data})
}


// 手动关联详情
export const getUnderMembersPage = (params) => {
  return request.get({ url: '/system/teamwork/team-work-project/getUnderMembersPage', params })
}



// 待处理的电子渠道进件
export const electronChlAJAX = (params) => {
  return request.get({ url: '/system/index/electronChlAJAX', params })
}
// 待处理的大供进件申请
export const dgApplicationAJAX = (params) => {
  return request.get({ url: '/system/index/dgApplicationAJAX', params })
}
// 待处理的单笔授信业务申请
export const SingCreditLineApplyAJAX = (params) => {
  return request.get({ url: '/system/index/SingCreditLineApplyAJAX', params })
}
// 待处理的供应链决策数据申请
export const DealAutoApplyListAJAX = (params) => {
  return request.get({ url: '/system/index/DealAutoApplyListAJAX', params })
}
// 待处理的业务合同申请
export const SingContractApplyAJAX = (params) => {
  return request.get({ url: '/system/index/SingContractApplyAJAX', params })
}
// 待处理的放贷申请
export const SingPutOutApplyAJAX = (params) => {
  return request.get({ url: '/system/index/SingPutOutApplyAJAX', params })
}
// 链属放贷审批通过的申请
export const PutOutApplyPassAJAX = (params) => {
  return request.get({ url: '/system/index/PutOutApplyPassAJAX', params })
}
// 链属放贷审批交易成功的放贷
export const PutOutApplySuccessAJAX = (params) => {
  return request.get({ url: '/system/index/PutOutApplySuccessAJAX', params })
}