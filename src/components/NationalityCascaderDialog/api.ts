import request from '@/config/axios'

// 待处理申请api

export const NationalityApi = {
  // 查询待处理申请分页
  getNationalityOptions:async(params) => {
    return await request.get({url:`/system/codeLibrary/countryTreeList`,params})
  }
}

