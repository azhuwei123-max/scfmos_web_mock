import request from '@/config/axios'



export const personalApi = {
  // 分页
  getList:async(params) => {
    return await request.get({url:`/system/custom-self-employed/page`,params})
  },

  // 详情
  getDetail:async(params) => {
    return await request.get({url:`/system/custom-self-employed/get`,params})
  },

  // 新增
  addCustomer:async(data) => {
    return await request.post({url:`/system/customerinfo/addCustomer`,data})
  },
 // 左侧树图的
 getCsutomerView:async(params) => {
  return await request.get({url:`/system/custom-self-employed/getCustomerView`,params})
 },
 // 模板对应页面
 getPageVO:async(params) => {
  return await request.get({url:`/system/customerinfo/ent/getPageVO`,params})
 },
 getPiion:async(params) => {
  return await request.get({url:`/system/custom-self-employed/get`,params})
 },
  getCustomerRight:async(params) => {
    return await request.get({url:`/system/customerinfo/getCustomerRight`,params})
  },
  // 同步额度系统
  synchronizeCustomer: (data)=> {
    return request.post({url:`/system/customerinfo/synchronizeCustomer`,data})
  },

  // 自雇人士脱敏导出
  exportSelfExcel:async (params)=> {
    return request.download({url:`/system/custom-self-employed/export-excel`,params})
  },
  // 删除
  deleteBelongAttribute1 :async(data) => {
    return  request.post({url:`system/customerinfo/deleteBelongAttribute1`,data})
  },
  // 查找客户的一些信息
  getCustomerInfo:async(params) => {
    return await request.get({url:`system/paramAdjust/getCustomerInfo`,params})
  }
}



