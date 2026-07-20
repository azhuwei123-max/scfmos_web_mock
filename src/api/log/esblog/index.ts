import request from '@/config/axios'

// esb日志 VO
export interface EsbLogVO {
  id: string // 主键
  serviceId: string // 服务编码
  consumerSeqNo: string // 业务流水号
  orgConsumerSeqNo: string // 原交易流水号
  reqParam: string // 请求参数
  respResult: string // 响应结果
  returnCode: string // 响应结果
  returnMsg: string // 执行信息
  reqTime: Date // 请求时间
  respTime: Date // 响应时间
  remark: string // 备注
  remark1: string // 备用字段
}

// esb日志 API
export const EsbLogApi = {
  // 查询esb日志分页
  getEsbLogPage: async (params: any) => {
    return await request.get({ url: `/system/esb-transport-log/page`, params })
  },

  // 查询esb日志详情
  getEsbLog: async (id: number) => {
    return await request.get({ url: `/system/esb-transport-log/get?id=` + id })
  },

  // 新增esb日志
  createEsbLog: async (data: EsbLogVO) => {
    return await request.post({ url: `/log/esb-log/create`, data })
  },

  // 修改esb日志
  updateEsbLog: async (data: EsbLogVO) => {
    return await request.put({ url: `/log/esb-log/update`, data })
  },

  // 删除esb日志
  deleteEsbLog: async (id: number) => {
    return await request.delete({ url: `/log/esb-log/delete?id=` + id })
  },

  // 导出esb日志 Excel
  exportEsbLog: async (params) => {
    return await request.download({ url: `/log/esb-log/export-excel`, params })
  },
}
