export type ParamsType = 'detail' | 'edit'
/**
 * @param ParamAdjustApplyDetail 项目参数调整申请详情
 * @param ProjectDetails 项目详情
 */
export type TempType = 'ParamAdjustApplyDetail' | 'ProjectDetails'

export interface ParamAdjustApplyDetailPropsParams {
  serialno: string
  type: ParamsType
  /** 模版类型, 用于确定接口传参
   * @param ParamAdjustApplyDetail 项目参数调整申请详情
   * @param ProjectDetails 项目详情
   */
  tempType?: TempType
  businessType?: string
  /** 用于查看授信额度详情 */
  serialNoByList?: string
  customerId?: string
  /**
   * 是否显示查看历史和查看协审详情
   */
  isHiddenBtn?: boolean
  /**
   * 是否是项目维护详情页
   */
  isMaintainProjectInfo?: boolean
  title?: string,
  /** 查看历史时用于定位tabs */
  activeTabName?: string
  /** 是否为历史查看页面, 值为1 为历史查看页面 */
  isHistory?: string
}
