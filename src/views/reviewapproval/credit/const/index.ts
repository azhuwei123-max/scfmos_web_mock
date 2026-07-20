import type { TableColumn } from '@/types/table'
import { dateFormatter } from '@/utils/formatTime'

// 金额格式化函数
const amountFormatter = (_: any, __: any, cellValue: any) => {
  if (cellValue == null || cellValue === '') return ''
  return new Intl.NumberFormat('zh-CN', {
    style: 'decimal',
    // currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(cellValue)
}

// 默认查询参数
export const defaultQueryParams = {
  pageNo: 1,
  pageSize: 10,
  phaseNo: undefined,
  customerName: undefined, // 客户名称
  flowNo: undefined, 
  virtualOccurType: undefined, // 业务品种
  serialNo: undefined, // 流水编号
  status:undefined,// 补件状态
  endTime:undefined,// 完成时间
  mrchFlg:undefined //商户标识
}

// 发生类型选项
export const occurrenceTypeOptions = [
  { label: '新增', value: '新增' },
  { label: '借新还旧', value: '借新还旧' },
  { label: '还旧借新-风险化解', value: '还旧借新-风险化解' },
  { label: '续作', value: '续作' },
  { label: '复议', value: '复议' },
  { label: '展期', value: '展期' },
  { label: '提额', value: '提额' },
]

// 补件状态
export const statusTypeOptions = [
  { label: '待补件', value: '0' },
  { label: '补件完成', value: '1' },

]



// 客户类型选项
export const customerTypeOptions = [
  { label: '公司客户', value: '01' },
  { label: '个人客户', value: '03' }
]

// 表格列配置
export const tableColumnsY: TableColumn[] = [
  { label: '业务流程类型', field: 'applymodeltypename', minWidth: 100 },
  { label: '供应链标识', field: 'gylflagname', minWidth: 100 },
  { label: '客户名称', field: 'customername', minWidth: 320 },
  { label: '业务品种', field: 'businesstypename', minWidth: 150 },
  { label: '发生类型', field: 'viroccurtypename', minWidth: 120 },
  { label: '币种', field: 'currencyname', minWidth: 80 },
  { label: '申请金额', field: 'businesssum', minWidth: 120, formatter: amountFormatter },
  // { label: '当前处理人', field: 'latestusername', minWidth: 100 },
  // { label: '流程状态', field: 'lateststatus', minWidth: 120 },
  { label: '渠道标识', field: 'mrchflg', minWidth: 120 },
  { label: '供应链客户类型', field: 'gylcustomertype', minWidth: 120 },
  { label: '合作项目名称', field: 'projectname', minWidth: 180 },
  { label: '收到业务时间', field: 'begintime', minWidth: 180 },
  { label: '申请流水编号', field: 'objectno', minWidth: 220 },
  { label: '完成时间', field: 'endtime', width: 180, formatter: dateFormatter},

]

export const tableColumnsN: TableColumn[] = [
  { label: '业务流程类型', field: 'applymodeltypename', minWidth: 100 },
  { label: '供应链标识', field: 'gylflagname', minWidth: 100 },
  { label: '客户名称', field: 'customername', minWidth: 320 },
  { label: '业务品种', field: 'businesstypename', minWidth: 100 },
  { label: '发生类型', field: 'viroccurtypename', minWidth: 120 },
  { label: '币种', field: 'currencyname', minWidth: 80 },
  { label: '申请金额', field: 'businesssum', minWidth: 120, formatter: amountFormatter },
  // { label: '当前处理人', field: 'latestusername', minWidth: 100 },
  // { label: '流程状态', field: 'lateststatus', minWidth: 120 },
  { label: '渠道标识', field: 'mrchflg', minWidth: 120 },
  { label: '供应链客户类型', field: 'gylcustomertype', minWidth: 120 },
  { label: '合作项目名称', field: 'projectname', minWidth: 180 },
  { label: '收到业务时间', field: 'begintime', minWidth: 180 },
  { label: '申请流水编号', field: 'objectno', minWidth: 220 },
  // { label: '完成时间', field: 'endtime', width: 180, formatter: dateFormatter},

]

