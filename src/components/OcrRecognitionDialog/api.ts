import request from '@/config/axios'

// 待处理申请api

export const OcrRecognitionApi = {
  // 查询待处理申请分页
  indCertTypeList:async(params) => {
    return await request.get({url:`/system/customerinfo/ent/indCertType`,params})
  },

  getCodeLibraryList:async(params) => {
    return await request.get({url:`/system/codeLibrary/getCodeLibraryList`,params})
  },
  getCountryTreeList:async(params) => {
    return await request.get({url:`/system/codeLibrary/countryTreeList `,params})
  },
  recognize:async(data) => {
    return await request.upload({url:`/system/customerinfo/getCertInfoByOCR `,data})
  },
}

