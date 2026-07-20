import request from '@/config/axios'

export const getMenuList = (params) => {
  return request.get({ url: '/system/business/approveMenu/Menu', params})
}

export const getParamAdjustApplyList = (params) => {
  return request.get({ url: '/system/paramAdjust/page', params})
}

export const getSelectAutoProjectList = (params) => {
  return request.get({ url: '/system/paramAdjust/qryProjectNameListPage', params})
}

/** 申请-新增 */
export const paramAdjustAddApply = (data) => {
  return request.post({ url: '/system/paramAdjust/addApply', data})
}

/** 申请-取消 */
export const paramAdjustCancelApply = (data) => {
  return request.post({ url: '/system/paramAdjust/cancelApply', data})
}

/** 详情保存 */
export const paramAdjustSaveApply = (data) => {
  return request.post({ url: '/system/paramAdjust/saveApply', data})
}

/** 根据项目号获取决策模板页面 */
export const getTemplateInfo = (params) => {
  return request.get({ url: '/system/paramAdjust/getTemplateInfo', params})
}

/** 根据项目号获取模板内容数据 */
export const getTemplateValue = (params) => {
  return request.get({ url: '/system/paramAdjust/getTemplateValue', params})
}

/** 获取客户列表 */
export const selectCustomerInfoPage = (data) => {
  return request.post({ url: '/system/paramAdjust/selectCustomerInfoPage', data})
}

/** 获取客户列表2 */
export const selectParticipantCustomerInfoPageVo = (data) => {
  return request.post({ url: '/system/paramAdjust/selectParticipantCustomerInfoPageVo', data})
}

/** 获取参与维护列表值 */
export const getListValue = (data) => {
  return request.post({ url: '/system/paramAdjust/getTemplatePageValue', data})
}

/** 参与维护新增保存 */
export const dealInfo = (data) => {
  return request.post({ url: '/system/paramAdjust/saveParticipantInfoPageVo', data})
}

/** 参与方关联关系查询 */
export const selectRelativeType = (params) => {
  return request.get({ url: '/system/paramAdjust/selectRelativeType', params})
}

/** 征信查询原因 */
export const selectZXQueryReason = (params) => {
  return request.get({ url: '/system/paramAdjust/selectZXQueryReason', params})
}

/** 征信授权时间 */
export const getMaxZXQueryTime = (params) => {
  return request.get({ url: '/system/paramAdjust/getMaxZXQuery', params})
}

/** 删除参与方 */
export const deleteParticipantInfoPageVo = (data) => {
  return request.post({ url: '/system/paramAdjust/deleteParticipantInfoPageVo', data})
}

/** 获取公司客户信息 */
export const selectCustomerInfo = (params) => {
  return request.get({ url: '/system/paramAdjust/selectCustomerInfo', params})
}
/** 获取个人客户信息 */
export const getCustomerInfo = (params) => {
  return request.get({ url: '/system/paramAdjust/getCustomerInfo', params})
}

/** 受托支付获取行名行号 */
export const selectBankNoName3 = (data) => {
  return request.post({ url: '/system/paramAdjust/selectBankNoName3', data})
}

/** 受托支付信息保存 */
export const savePaymentAdjust = (data) => {
  return request.post({ url: '/system/paramAdjust/savePaymentAdjust', data})
}

/** 删除受托支付信息 */
export const deletePaymentAdjust = (data) => {
  return request.post({ url: '/system/paramAdjust/deletePaymentAdjust', data})
}

/** 核心企业子公司扣款账户维护 保存 */
export const saveSubEntAcctAdjust = (data) => {
  return request.post({ url: '/system/paramAdjust/saveSubEntAcctAdjust', data})
}

/** 核心企业子公司扣款账户维护 删除 */
export const deleteSubEntAcctAdjust = (data) => {
  return request.post({ url: '/system/paramAdjust/deleteSubEntAcctAdjust', data})
}

/** 核心企业保证金账户 保存 */
export const saveCoreBailAdjust = (data) => {
  return request.post({ url: '/system/paramAdjust/saveCoreBailAdjust', data})
}

/** 核心企业保证金账户 删除 */
export const deleteCoreBailAdjust = (data) => {
  return request.post({ url: '/system/paramAdjust/deleteCoreBailAdjust', data})
}

/** 账户出入金管理相关 保存 */
export const saveDepositAcctAdjust = (data) => {
  return request.post({ url: '/system/paramAdjust/saveDepositAcctAdjust', data})
}

/** 账户出入金管理相关 删除 */
export const deleteDepositAcctAdjust = (data) => {
  return request.post({ url: '/system/paramAdjust/deleteDepositAcctAdjust', data})
}

/** 查看意见 */
export const getCoreviewApplyOpinion = (params) => {
  return request.get({ url: '/system/paramAdjust/getApplyOpinion', params })
}

/** 导出多级流转核心企业子账户信息 */
export const exportEntCoreAccountExcel = (params) => {
  return request.download({ url: '/system/paramAdjust/exportEntCoreAccountExcel', params })
}

/** 受托支付信息导出 */
export const exportProjectRelativeExcel = (params) => {
  return request.download({ url: '/system/paramAdjust/exportProjectRelativeExcel', params })
}

// 流转记录
export const getFlowRecordPage = (params) => {
  return request.get({ url: '/system/credit-flow/getFlowRecordPage', params })
}

/** 提交前校验参数是否保存 */
export const paramAdjustCheckDetail= (params) => {
  return request.get({ url: '/system/paramAdjust/checkDetail', params })
}
/** 点击提交前校验是否已经保存签署意见 */
export const checkComment = (params) => {
  return request.get({ url: 'system/modelManage/apply/checkComment', params })
}

/** 新增核心企业子公司信息 */
export const addTeamWorkSettlerPageVo = (data) => {
  return request.post({ url: '/system/paramAdjust/saveChannelMultiLevelFinance', data })
}

/** 删除核心企业子公司信息 */
export const deleteTeamWorkSettlerPageVo = (data) => {
  return request.post({ url: '/system/paramAdjust/deleteChannelMultiLevelFinance', data })
}
