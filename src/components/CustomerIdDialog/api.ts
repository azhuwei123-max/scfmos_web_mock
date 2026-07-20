import request from '@/config/axios'


export const addCustomerApi = {
  getCustomerOrgType:async(params) => {
    return await request.get({url:`/system/customerinfo/ent/getCustomerOrgType`,params})
  },
  getCodeLibraryList:async(params) => {
    return await request.get({url:`/system/codeLibrary/getCodeLibraryList`,params})
  },
  getEntCertType:async(params) => {
    return await request.get({url:`/system/customerinfo/ent/entCertType`,params})
  },
  checkCertIDValidity:async(data) => {
    return await request.post({url:`/system/customerinfo/checkCertIDValidity`,data})
  },
}