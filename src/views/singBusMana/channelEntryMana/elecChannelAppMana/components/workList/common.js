const baseCol = [
  { label: '电子渠道进件申请编号', field: 'serialNo', minWidth: 220 },
  { label: '客户证件号', field: 'certID', minWidth: 180 },
  { label: '客户名称', field: 'customerName', minWidth: 180 },
  { label: '核心客户号', field: 'mfCustomerID', minWidth: 100 },
  { label: '申请金额', field: 'applySum' },
  { label: '申请期限', field: 'termMonth' },
  { label: '发生方式', field: 'occurType' },
  { label: '续作业务合同编号', field: 'contractNo', minWidth: 220 },
  { label: '推送时间', field: 'inputDate', minWidth: 120 },
  { label: '申请渠道', field: 'channelSource', minWidth: 100 },
  { label: '是否需要关联决策白名单', field: 'isRelWhiteListName', minWidth: 150 },
  { label: '关联项目名称', field: 'projectName', minWidth: 320 },
  { label: '推送时间', field: 'inputDate', minWidth: 120 },
]

// 待进件
const columns1 = [
  ...baseCol,
  { label: '申请状态', field: 'applyStatus', minWidth: 120 },
]
const columns2 = [
  ...baseCol,
  { label: '通过时间', field: 'passTime', minWidth: 120 },
  { label: '申请状态', field: 'applyStatus', minWidth: 120 },
  { label: '授信申请编号', field: 'baSerial', minWidth: 220 },
  { label: '业务合同编号', field: 'bcSerial', minWidth: 220 },
]

const columns3 = [
  ...baseCol,
  { label: '失效时间', field: 'invalidTime', minWidth: 120 },
]

export const getColumns = (key) => {
  return {
    '0101': columns1,
    '0102': columns2,
    '0103': columns3,
  }[key] || columns1
}