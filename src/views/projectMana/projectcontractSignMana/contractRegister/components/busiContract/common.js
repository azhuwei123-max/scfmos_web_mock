const columns = [
  { label: '合同流水号', field: 'serialNo', minWidth: 190 },
  { label: '批复流水号', field: 'relativeSerialNo', minWidth: 190 },
  { label: '客户编号', field: 'customerID', minWidth: 220 },
  { label: '客户名称', field: 'customerName', minWidth: 320 },
  { label: '电子合同签署状态', field: 'bcdzhtStatus', minWidth: 150 },
  { label: '业务品种', field: 'businessTypeName', minWidth: 190 },
  { label: '币种', field: 'currency' },
  { label: '业务金额', field: 'businessSum1', minWidth: 150 },
  { label: '发生类型', field: 'occurTypeName' },
  { label: '主要担保方式', field: 'vouchTypeName', minWidth: 190 },
  { label: '期限（月）', field: 'termMonth', minWidth: 100 },
  { label: '期限（天）', field: 'termDay', minWidth: 100 },
  { label: '供应链标识', field: 'gylflagName', minWidth: 120 },
  { label: '供应链客户类型', field: 'gylcustomerType', minWidth: 190 },
  { label: '所属项目名称', field: 'projectName', minWidth: 320 },
  { label: '起始日期', field: 'putOutDate', minWidth: 120 },
  { label: '到期日期', field: 'maturity', minWidth: 120 },
  { label: '管户人', field: 'manageUserName' },
  { label: '管户机构', field: 'manageOrgName', minWidth: 120 },
  { label: '登记日期', field: 'inputDate', minWidth: 120 },
  { label: '完成时间', field: 'endTime', minWidth: 150 }
]

const columns1 = [
  { label: '合同流水号', field: 'serialNo', minWidth: 190 },
  { label: '批复流水号', field: 'relativeSerialNo', minWidth: 190 },
  { label: '客户编号', field: 'customerID', minWidth: 220 },
  { label: '客户名称', field: 'customerName', minWidth: 320 },
  { label: '业务品种', field: 'businessTypeName', minWidth: 190 },
  { label: '币种', field: 'currency' },
  { label: '业务金额', field: 'businessSum1', minWidth: 150 },
  { label: '发生类型', field: 'occurTypeName' },
  { label: '主要担保方式', field: 'vouchTypeName', minWidth: 190 },
  { label: '期限（月）', field: 'termMonth', minWidth: 100 },
  { label: '期限（天）', field: 'termDay', minWidth: 100 },
  { label: '供应链标识', field: 'gylflagName', minWidth: 120 },
  { label: '供应链客户类型', field: 'gylcustomerType', minWidth: 190 },
  { label: '所属项目名称', field: 'projectName', minWidth: 320 },
  { label: '起始日期', field: 'putOutDate', minWidth: 120 },
  { label: '到期日期', field: 'maturity', minWidth: 120 },
  { label: '管户人', field: 'manageUserName' },
  { label: '管户机构', field: 'manageOrgName', minWidth: 120 },
  { label: '登记日期', field: 'inputDate', minWidth: 120 },
  { label: '完成时间', field: 'endTime', minWidth: 150 }
]

export const getColumns = (key) => {
  return key === '040010' ? columns : columns1
}