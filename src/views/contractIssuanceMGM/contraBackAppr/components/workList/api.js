import request from '@/config/axios'

// 列表
export const ContractList = (data) => {
  return request.post({ url: '/system/putout-info/reviewLendingApplicationsRecheckPage', data })
}

// 查看批复通知书
export const viewEdpfReport = (data) => {
  return request.post({ url: '/system/putout-info/viewEdpfReport', data })
}

// 导出 Excel
export const handleExport = async (params) => {
  return await request.download({ url: `/system/putout-info/exportExcel`, params })
}