import request from '@/config/axios'


export const associatedCreditApi  = {
  // 列表
  getList:async(data)=> {
    return await request.post({url:`/system/credit-line/rel-creditline-list`,data})
  },
  // 额度类型lsit
  getTypeList:async(data)=> {
    return await request.post({url:`/system/credit-line/rel-creditline-typelist`,data})
  },
  // 查询可关联额度合同列表
  selectCreditlineBclist:async(data)=> {
    return await request.post({url:`/system/credit-line/select-creditline-bclist`,data})
  },
  // 查询公共
  openSelecter:async(data)=> {
    return await request.post({url:`/system/select-catalog/openSelecter`,data})
  },
  // 新增
  handleCreate:async(data)=> {
    return await request.post({url:`/system/credit-line/create`,data})
  },
  // 查看关联额度想想
  getIframeUrl:async(params)=> {
    return await request.get({url:`/system/codeLibrary/getIframeUrl`,params})
  },
  // 删除
  deleteCreditLine:async(serialno)=> {
    return await request.delete({url:`/system/credit-line/delete?serialno=` + serialno})
  },
  // 查看调查报告
  handleViewDcbg:async(data)=> {
    return await request.post({url:`/system/credit-line/query-creditline-report`,data})
  },
  handleViewEdpfReport:async(data)=> {
    return await request.post({url:`/system/putout-info/viewEdpfReport`,data})
  },

   // 获取合同信息
   getBusinessContract:async(params)=> {
    return await request.get({url:`/system/business-contract/get`,params})
  },
  // 获取合同信息
  getRelativeserialno:async(params)=> {
    return await request.get({url:`/system/business-contract/getRelativeserialno`,params})
  },
  // 获取合同信息
  getOccupyCount:async(params)=> {
    return await request.get({url:`/system/business-contract/getOccupyCount`,params})
  },
  
  // 获取合同信息
  getContractInfo:async(params)=> {
    return await request.get({url:`/system/business-contract/getContractInfo`,params})
  },
}
