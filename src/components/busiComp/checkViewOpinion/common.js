// 签约发放
const columns1 = [
  { label: '阶段名称', key: 'phaseName' },
  { label: '处理人', key: 'userName' },
  { label: '处理人所属机构', key: 'orgName' },
  { label: '审批渠道', key: 'attribute' },
  { label: '收到时间', key: 'beginTime', span: 2 },
  { label: '完成时间', key: 'endTime', span: 2 },
  { label: '意见', key: 'phaseOpinion', span: 4 }
]



const columns2_base = [
  { label: '阶段名称', key: 'phaseName', },
  { label: '处理人', key: 'userName', },
  { label: '处理人所属机构', key: 'orgName' },
  { label: '审批渠道', key: 'attribute' },
  { label: '收到时间', key: 'beginTime' },
  { label: '完成时间', key: 'endTime' },
  { label: '客户名称', key: 'customerName' },
  { label: '业务品种', key: 'businessTypeName' },
  { label: '申请金额(元)', key: 'baBusinessSum' },
  { label: '申请敞口(元)', key: 'baExposureSum' },
  { label: '申请期限(月)', key: 'baTermMonth' },
  { label: '业务币种', key: 'businessCurrencyName' },
]


const columns3_base = [
  { label: '阶段名称', key: 'phaseName', },
  { label: '处理人', key: 'userName', },
  { label: '处理人所属机构', key: 'orgName' },
  { label: '审批渠道', key: 'attribute' },
  { label: '收到时间', key: 'beginTime' },
  { label: '完成时间', key: 'endTime' },
]

const columns2_1 = [
  ...columns2_base,
  { label: '意见', key: 'phaseOpinion', span: 4 }
]

const columns2_2 = [
  ...columns2_base,
  { label: '授信金额(元)', key: 'businessSum' },
  { label: '授信敞口(元):', key: 'exposureSum' },
  { label: '期限(月):', key: 'termMonth', span: 4 },
  { label: '意见', key: 'phaseOpinion', span: 4 }
]

const columns2_3 = [
  ...columns2_base,
  { label: '授信金额(元)', key: 'businessSum' },
  { label: '授信敞口(元):', key: 'exposureSum' },
  { label: '期限(月):', key: 'termMonth' },
  { label: '额度是否循环', key: 'cycleFlag' },
  { label: '贷后频率:', key: 'afterFrequency' },
  { label: '额度敞口计算维度:', key: 'calculateDimension' },
  { label: '关联交易额度:', key: 'attribute3' },
  { label: '跨额度使用期限(月):', key: 'overTermMonth', span: 4 },
  { label: '意见', key: 'phaseOpinion', span: 4 }
]

const columns3 = [
  ...columns3_base,
  { label: '意见', key: 'phaseOpinion', span: 4 }
]

const getColumns2ByData = (data, map) => {
  const columns = []
  data.forEach(v => {
    if (map['attribute1'].includes(v['phaseNo'])) {
      columns.push({ column: columns2_1, data: v })
    } else if (map['attribute2'].includes(v['phaseNo'])) {
      columns.push({ column: columns2_2, data: v })
    } else if (map['attribute3'].includes(v['phaseNo'])) {
      columns.push({ column: columns2_3, data: v })
    } else {
      columns.push({ column: columns2_3, data: v })
    }

  });

  columns.forEach(col => {
    if (col.data.showField === 'baTermDay') {
      const findCol = col.column.find(v => v.key === 'baTermMonth')
      if (findCol) {
        findCol.label = '申请期限(天)'
        findCol.key = 'baTermDay'
      }

      const findCol2 = col.column.find(v => ['termMonth', 'termDay'].includes(v.key))
      if (findCol2) {
        findCol2.label = '期限(天)'
        findCol2.key = 'termDay'
      }

    } else if (col.data.showField === 'baTermMonth') {
      const findCol = col.column.find(v => v.key === 'baTermDay')
      if (findCol) {
        findCol.label = '申请期限(月)'
        findCol.key = 'baTermMonth'
      }

      const findCol2 = col.column.find(v => ['termMonth', 'termDay'].includes(v.key))
      if (findCol2) {
        findCol2.label = '期限(月)'
        findCol2.key = 'termMonth'
      }

    }
  })

  return columns
}

const getColumns1ByData = (data, map) => {
  return data.map(v => ({
    column: columns1,
    data: v
  }))
}

const getColumns3ByData = (data, map) => {
  return data.map(v => ({
    column: columns3,
    data: v
  }))
}

export const getColumnsByData = (data, map, type) => {
  console.log(type)
  if (type === 'apply') {
    return getColumns2ByData(data, map)
  } else if (type === 'contract') {
    return getColumns1ByData(data, map)
  } else if (type === 'whiteProject'){
    return getColumns3ByData(data, map)
  } else {
    return []
  }
}


