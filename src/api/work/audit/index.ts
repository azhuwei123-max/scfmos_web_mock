import request from '@/config/axios'

// 工单审核 VO
export interface AuditWorkVO {
  id: number // id
  no: string // 工单编号
  processInstanceId: string // 工作流编号
  auditStatus: number // 审核状态
  lastAuditTime: Date // 最后审核时间
  createTime?: Date // 创建时间
  updateTime?: Date // 更新时间
}

// 工单审核 API
export const AuditWorkApi = {
  // 查询工单审核分页
  getAuditWorkPage: async (params: any) => {
    return await request.get({ url: `/system/work/audit-work/page`, params })
  },

  // 查询工单审核详情
  getAuditWork: async (id: number) => {
    return await request.get({ url: `/system/work/audit-work/get?id=` + id })
  },

  // 新增工单审核
  createAuditWork: async (data: AuditWorkVO) => {
    return await request.post({ url: `/system/work/audit-work/create`, data })
  },

  // 修改工单审核
  updateAuditWork: async (data: AuditWorkVO) => {
    return await request.put({ url: `/system/work/audit-work/update`, data })
  },

  // 删除工单审核
  deleteAuditWork: async (id: number) => {
    return await request.delete({ url: `/system/work/audit-work/delete?id=` + id })
  },

  // 导出工单审核 Excel
  exportAuditWork: async (params) => {
    return await request.download({ url: `/system/work/audit-work/export-excel`, params })
  },
  // 提交审核
  submitOrder:async (data) => {
    return await request.post({ url: `/system/work/audit-work/submit`, data })
  },
  // 提交审批意见
  submitOrderAd:async (data) => {
    return await request.post({ url: `/system/work/audit-work/create-comment`, data })
  },
  // 获取审批意见
  getComment:async (id: number) => {
    return await request.get({ url: `/system/work/audit-work/get-comment?businessId=` + id+'&taskId=0'}) 
  },
  getNewComment:async (params) => {
    return await request.get({ url: `/system/work/audit-work/get-comment`,params}) 
  },
  // 异地白名单的提交 到时候优化区别
  submitYdOrder:async (data) => {
    return await request.post({ url: `/system/custom-white-list-apply/submit`, data })
  },
}
