import request from '@/config/axios'

// 

export const ydwkhbmdApi = {
  // 查询列表
  getList:async(params) => {
    return await request.get({url:`/system/custom-white-list-apply/page`,params})
  },

  // 详情
  getDetail:async(params) => {
    return await request.get({url:`/system/custom-white-list-apply/get`,params})
  },
  

  // 新增
  add:async (data)=> {
    return await  request.post({
      url:`/system/custom-white-list-apply/create`,
      data
    })
  },
  
  // 保存
  save:async (data)=> {
    return await  request.put({
      url:`/system/custom-white-list-apply/update`,
      data
    })
  },

  // 取消
  cancel:async(serialNo) => {
    return await request.delete({
      url:`/system/custom-white-list-apply/delete?serialNo=`+serialNo
    })  
  },

  // 提交
  submit:async(data) => {
    return await request.post({
      url:`/system/custom-white-list-apply/submit`,
      data
    })
  },

  

  // 企业列表查询

  getEnterpriseList:async(params) => {
    return await request.get({
      url:`/system/customerinfo/ent/base-page`,
      params
    })
  }


}




