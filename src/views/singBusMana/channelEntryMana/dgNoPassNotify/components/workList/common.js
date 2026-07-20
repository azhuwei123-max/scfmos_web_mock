
export const columns1 = [
  { label: '流水号', field: 'serialNo' },
  { label: '客户名称', field: 'customerName' },
  { label: '客户编号', field: 'customerId' },
  { label: '申请金额', field: 'businessSum1' },
  { label: '项目名称', field: 'projectName' },
  { label: '未通过原因', field: 'unPassResult' }
]

export const columns2 = [
  { label: '流水号', field: 'serialNo' },
  { label: '客户名称', field: 'customerName' },
  { label: '客户编号', field: 'customerId' },
  { label: '申请金额', field: 'businessSum1' },
  { label: '通知时间', field: 'updateDate' },
  { label: '项目名称', field: 'projectName' },
  { label: '未通过原因', field: 'unPassResult' }
]

export const getColumns = (key) => {
  return {
    '0101': columns1,
    '0102': columns2,
    '0103': columns1,
    '0104': columns2,
  }[key] || columns1
}