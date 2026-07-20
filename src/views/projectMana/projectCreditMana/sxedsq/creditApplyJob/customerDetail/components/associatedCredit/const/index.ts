

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


// 表格列配置
export const tableColumns: TableColumn[] = [
  { label: '额度协议号', field: 'relativeserialno', minWidth: 180 },
  { label: '客户名称', field: 'customername', minWidth: 150 },
  { label: '额度名称', field: 'businesstypename', minWidth: 100 },
  { label: '额度金额', field: 'businesssum', minWidth: 120,formatter: amountFormatter },
  { label: '敞口金额', field: 'exposuresum', minWidth: 120 ,formatter: amountFormatter},
  { label: '当前业务敞口', field: 'curexposuresum', minWidth: 120 },
  { label: '额度起始日', field: 'putoutdate', minWidth: 120,formatter: dateFormatter},
  { label: '额度到期日', field: 'maturity', minWidth: 120, formatter: dateFormatter },
]

