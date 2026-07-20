import {
  DynamicForm,
  DockInfo,
  codeSource,
  newCodeSource,
  base3
} from '@/components/dynamicForm/class.ts'

export const dockList1 = [
  // new DockInfo('基本信息情况', 'BasicPart'),
]

const baseTemp = [
  new DynamicForm('', '电子渠道进件申请编号', 'serialNo', 'input', base3('0', '1', '1')),
  new DynamicForm('', '客户证件号', 'certID', 'input', base3('0', '1', '1')),
  new DynamicForm('', '客户名称', 'customerName', 'input', base3('0', '1', '1')),
  new DynamicForm('', '核心客户号', 'mfCustomerID', 'input', base3('0', '1', '1')),
  new DynamicForm('', '申请金额', 'applySum', 'input', base3('0', '1', '1')),
  new DynamicForm('', '申请期限', 'termMonth', 'input', base3('0', '1', '1')),
  new DynamicForm('', '发生方式', 'occurTypeName', 'input', base3('0', '1', '1')),
  new DynamicForm('', '续作业务合同编号', 'contractNo', 'input', base3('0', '1', '1')),
  new DynamicForm('', '申请渠道', 'channelSource', 'input', base3('0', '1', '1')),
  new DynamicForm('', '是否关联决策白名单', 'isRelWhiteListName', 'input', base3('0', '1', '1')),
  // new DynamicForm('', '推荐利率', 'inputRate', 'input', base3('0', '1', '1')),
  new DynamicForm('', '推送时间', 'inputDate', 'input', base3('0', '1', '1'))
]

const tempList1 = [
  ...baseTemp,
  new DynamicForm('', '申请状态', 'applyStatus', 'input', base3('0', '1', '1'))
]

const tempList2 = [
  ...baseTemp,
  new DynamicForm('', '通过时间', 'passTime', 'input', base3('0', '1', '1')),
  new DynamicForm('', '申请状态', 'applyStatus', 'input', base3('0', '1', '1')),
  new DynamicForm('', '授信申请编号', 'baSerial', 'input', base3('0', '1', '1')),
  new DynamicForm('', '业务合同编号', 'bcSerial', 'input', base3('0', '1', '1')),
]

const tempList3 = [
  ...baseTemp,
  new DynamicForm('', '失效时间', 'invalidTime', 'input', base3('0', '1', '1')),
]

export const getTempList = (key) => {
  return {
    '0101': tempList1,
    '0102': tempList2,
    '0103': tempList3,
  }[key] || tempList1
}
