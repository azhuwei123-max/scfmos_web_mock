
// 待进件
export const columns1 = [
  { label: '购买流水号', field: 'serialno', minWidth: 220 },
  { label: '出账流水号', field: 'bpserialno', minWidth: 220 },
  { label: '借据编号', field: 'alserialno', minWidth: 220 },
  { label: '客户名称', field: 'customername', minWidth: 320 },
  { label: '出账金额', field: 'businesssum1', minWidth: 120 },
  { label: '子票金额', field: 'subbillamt', minWidth: 120 },
  { label: '客户账号', field: 'accountno', minWidth: 220 },
  { label: '开户银行', field: 'accountbankname', minWidth: 220 },
  { label: '母票票号', field: 'rootbillnum', minWidth: 220 },
  { label: '母票签发人', field: 'coreentpayacctcustnm', minWidth: 130 },
  { label: '母票签发人统一社会信用代码', field: 'coreentcreditcode', minWidth: 200 },
  { label: '子票票号', field: 'subbillnum', minWidth: 220 },
  { label: '出账日期', field: 'putoutdate', minWidth: 120 },
  { label: '保理手续费付款方', field: 'factoringhandlingfeepayer', minWidth: 120 },
  { label: '预付利息付息方', field: 'prepayinterestpayer', minWidth: 120 },
  { label: '生成时间', field: 'inputdate', minWidth: 180 }
]
// 待进件
export const columns1_1 = [
  { label: '购买流水号', field: 'serialno', minWidth: 220 },
  { label: '出账流水号', field: 'bpserialno', minWidth: 220 },
  { label: '借据编号', field: 'alserialno', minWidth: 220 },
  { label: '客户名称', field: 'customername', minWidth: 320 },
  { label: '出账金额', field: 'businesssum1', minWidth: 120 },
  { label: '子票金额', field: 'subbillamt', minWidth: 120 },
  { label: '客户账号', field: 'accountno', minWidth: 220 },
  { label: '开户银行', field: 'accountbankname', minWidth: 220 },
  { label: '母票票号', field: 'rootbillnum', minWidth: 220 },
  { label: '子票票号', field: 'subbillnum', minWidth: 220 },
  { label: '出账日期', field: 'putoutdate', minWidth: 120 },
  { label: '保理手续费付款方', field: 'factoringhandlingfeepayer', minWidth: 120 },
  { label: '预付利息付息方', field: 'prepayinterestpayer', minWidth: 120 },
  { label: '生成时间', field: 'inputdate', minWidth: 180 }
]

// 已进件
export const columns2 = [
  { label: '进件流水号', field: 'serialno', minWidth: 220 },
  { label: '客户名称', field: 'customername', minWidth: 320 },
  { label: '统一社会信用代码', field: 'certid', minWidth: 220 },
  { label: '子票票号', field: 'subbillnum', minWidth: 220 },
  { label: '子票金额', field: 'subbillamt' },
  { label: '融资利率', field: 'interestate' },
  { label: '母票票号', field: 'rootbillnum', minWidth: 220 },
  { label: '母票金额', field: 'rootbillissuamt' },
  { label: '母票签发日期', field: 'rootbillissudt', minWidth: 130 },
  { label: '母票付款日期', field: 'rootbillpaydt', minWidth: 130 },
  { label: '母票签发人', field: 'coreentpayacctcustnm', minWidth: 130 },
  { label: '母票签发人统一社会信用代码', field: 'coreentcreditcode', minWidth: 200 },
  { label: '子票上游供应链', field: 'subbillentnm', minWidth: 150 },
  { label: '客户账号', field: 'accountno', minWidth: 320 },
  { label: '客户账号开户行名称', field: 'accountbankname', minWidth: 180 },
  { label: '保理手续费付款方', field: 'factoringhandlingfeepayer', minWidth: 120 },
  { label: '预付利息付息方', field: 'prepayinterestpayer', minWidth: 120 },
  { label: '进件时间', field: 'inputdate', minWidth: 120 },
  { label: '通过时间', field: 'updatedate', minWidth: 120 },
  { label: '申请状态', field: 'applystatus', minWidth: 120 },
  { label: '授信申请编号', field: 'accountNo', minWidth: 220 },
  { label: '业务合同编号', field: 'accountNo', minWidth: 220 }
]

// 失效
export const columns3 = [
  { label: '进件流水号', field: 'serialno', minWidth: 220 },
  { label: '客户名称', field: 'customername', minWidth: 320 },
  { label: '统一社会信用代码', field: 'certid', minWidth: 220 },
  { label: '子票票号', field: 'subbillnum', minWidth: 220 },
  { label: '子票金额', field: 'subbillamt', minWidth: 120 },
  { label: '融资利率', field: 'interestate', minWidth: 120 },
  { label: '母票票号', field: 'rootbillnum', minWidth: 220 },
  { label: '母票金额', field: 'rootbillissuamt', minWidth: 120 },
  { label: '母票签发日期', field: 'rootbillissudt', minWidth: 130 },
  { label: '母票付款日期', field: 'rootbillpaydt', minWidth: 130 },
  { label: '母票签发人', field: 'coreentpayacctcustnm', minWidth: 130 },
  { label: '母票签发人统一社会信用代码', field: 'coreentcreditcode', minWidth: 200 },
  { label: '子票上游供应链', field: 'subbillentnm', minWidth: 150 },
  { label: '客户账号', field: 'accountno', minWidth: 320 },
  { label: '客户账号开户行名称', field: 'accountbankname', minWidth: 180 },
  { label: '保理手续费付款方', field: 'factoringhandlingfeepayer', minWidth: 120 },
  { label: '预付利息付息方', field: 'prepayinterestpayer', minWidth: 120 },
  { label: '进件时间', field: 'inputdate', minWidth: 180 },
  { label: '失效时间', field: 'updatedate', minWidth: 180 },
]

export const columns4 = [
  ...columns1,
  { label: '状态', field: 'buystatus1', minWidth: 120 },
  { label: '失败原因', field: 'remark', minWidth: 120 },
]
export const columns4_1 = [
  ...columns1_1,
  { label: '状态', field: 'buystatus1', minWidth: 120 },
  { label: '失败原因', field: 'remark', minWidth: 120 },
]

export const columns5 = [
  ...columns1,
  { label: '购买时间', field: 'updatedate', minWidth: 180 },
]

export const columns5_1 = [
  ...columns1_1,
  { label: '购买时间', field: 'updatedate', minWidth: 180 },
]

export const getColumns = (key) => {
  return {
    '1040': columns1,
    '1050': columns1,
    '1060': columns1,
    '2040': columns1_1,
    '2050': columns1_1,
    '2060': columns1_1,
    '1070': columns5,
    '2070': columns5_1,
    '1090': columns4,
    '2090': columns4_1,
  }[key] || columns1
}
