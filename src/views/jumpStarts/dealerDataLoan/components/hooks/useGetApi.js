import { ref, reactive } from 'vue'
import * as Api from '../api'

export default function useGetApi() {
  const loading1 = ref()
  const getList1 = (params) => {
    loading1.value = true
    return Api.electronChlAJAX(params).finally(_ => {
      loading1.value = false
    })
  }
  const loading2 = ref()
  const getList2 = (params) => {
    loading2.value = true
    return Api.dgApplicationAJAX(params).finally(_ => loading2.value = false)
  }
  const loading3 = ref()
  const getList3 = (params) => {
    loading3.value = true
    return Api.SingCreditLineApplyAJAX(params).finally(_ => loading3.value = false)
  }
  const loading4 = ref()
  const getList4 = (params) => {
    loading4.value = true
    return Api.DealAutoApplyListAJAX(params).finally(_ => loading4.value = false)
  }
  const loading5 = ref()
  const getList5 = (params) => {
    loading5.value = true
    return Api.SingContractApplyAJAX(params).finally(_ => loading5.value = false)
  }
  const loading6 = ref()
  const getList6 = (params) => {
    loading6.value = true
    return Api.SingPutOutApplyAJAX(params).finally(_ => loading6.value = false)
  }
  const loading7 = ref()
  const getList7 = (params) => {
    loading7.value = true
    return Api.PutOutApplyPassAJAX(params).finally(_ => loading7.value = false)
  }
  const loading8 = ref()
  const getList8 = (params) => {
    loading8.value = true
    return Api.PutOutApplySuccessAJAX(params).finally(_ => loading8.value = false)
  }


  return ref({
    loading1,
    loading2,
    loading3,
    loading4,
    loading5,
    loading6,
    loading7,
    loading8,
    getList1,
    getList2,
    getList3,
    getList4,
    getList5,
    getList6,
    getList7,
    getList8,
  })
}
