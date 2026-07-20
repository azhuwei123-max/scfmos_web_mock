import request from '@/config/axios'

// 菜单
export const ywContractTaskList = (params) => {
  return request.get({ url: '/system/ContractTask/ywContractTaskList', params })
}