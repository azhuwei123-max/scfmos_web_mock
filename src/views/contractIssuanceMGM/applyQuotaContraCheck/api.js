import request from '@/config/axios'

// 菜单
export const ContractTaskList = (params) => {
  return request.get({ url: '/system/ContractTask/ContractTaskList', params })
}