// 待进件
const columns_base1_start = [
  { label: '申请流水号', field: 'serialNo', minWidth: 220 },
  { label: '借款人类型', field: 'borrowerType', minWidth: 150 },
  { label: '客户证件号', field: 'certId', minWidth: 180 },
  { label: '客户名称', field: 'borrowerName', minWidth: 320 },
  { label: '核心客户号', field: 'mfCustomerID', minWidth: 150 },
]
const columns_base1_end = [
  { label: '推送时间', field: 'inputDate', minWidth: 150 },
  { label: '申请状态', field: 'applyStatus', minWidth: 150 },
]
// 已进件
const columns_base2_start = [
  { label: '申请流水号', field: 'serialNo', minWidth: 220 },
  { label: '借款人类型', field: 'borrowerType', minWidth: 150 },
  { label: '客户证件号', field: 'certId', minWidth: 180 },
  { label: '客户名称', field: 'borrowerName', minWidth: 320 },
  { label: '核心客户号', field: 'mfCustomerID', minWidth: 150 },
]
const columns_base2_end = [
  { label: '推送时间', field: 'inputDate', minWidth: 150 },
  { label: '通过时间', field: 'passTime', minWidth: 150 },
  { label: '申请状态', field: 'applyStatus', minWidth: 150 },
  { label: '授信申请编号', field: 'baNo', minWidth: 220 },
  { label: '业务合同编号', field: 'bcNo', minWidth: 220 },
]
// 失效
const columns_base3_start = [
  { label: '申请流水号', field: 'serialNo', minWidth: 220 },
  { label: '借款人类型', field: 'borrowerType', minWidth: 150 },
  { label: '客户证件号', field: 'certId', minWidth: 180 },
  { label: '客户名称', field: 'borrowerName', minWidth: 320 },
  { label: '核心客户号', field: 'mfCustomerID', minWidth: 150 },
]
const columns_base3_end = [
  { label: '推送时间', field: 'inputDate', minWidth: 150 },
  { label: '失效时间', field: 'invalidDate', minWidth: 180 },
]
// 有效放贷
const columns_base4_start = [
  { label: '渠道融资编号', field: 'loanChannelNo', minWidth: 220 },
  { label: '客户证件号', field: 'certId', minWidth: 180 },
  { label: '客户名称', field: 'customerName', minWidth: 320 },
  { label: '业务合同编号', field: 'bcSerialNo', minWidth: 220 },
  { label: '融资金额（元）', field: 'businessSum1', minWidth: 150 },
  { label: '融资期限（月）', field: 'termMonth', minWidth: 150 },
  { label: '融资期限（天）', field: 'termDay', minWidth: 150 },
  { label: '融资申请时间', field: 'bpApplyDate', minWidth: 150 },
  { label: '申请有效截至日期', field: 'applyEffectDate', minWidth: 150 },
  { label: '受托支付账号', field: 'accountNo', minWidth: 150 },
  { label: '受托支付账户户名', field: 'openCustomerName', minWidth: 150 },
  { label: '受托支付开户行行号', field: 'openBankNo', minWidth: 150 },
  { label: '受托支付开户行名称', field: 'openBankName', minWidth: 150 },
  { label: '出账流水号', field: 'bpSerialNo', minWidth: 150 },
  { label: '申请状态', field: 'status', minWidth: 150 },
]
const columns_base4_end = []
// 失效放贷
const columns_base5_start = [
  { label: '渠道融资编号', field: 'loanChannelNo', minWidth: 220 },
  { label: '客户证件号', field: 'certId', minWidth: 180 },
  { label: '客户名称', field: 'customerName', minWidth: 320 },
  { label: '业务合同编号', field: 'bcSerialNo', minWidth: 220 },
  { label: '融资金额（元）', field: 'businessSum1', minWidth: 150 },
  { label: '融资期限（月）', field: 'termMonth', minWidth: 150 },
  { label: '融资期限（天）', field: 'termDay', minWidth: 150 },
  { label: '融资申请时间', field: 'bpApplyDate', minWidth: 150 },
  { label: '申请有效截至日期', field: 'applyEffectDate', minWidth: 150 },
  { label: '受托支付账号', field: 'accountNo', minWidth: 150 },
  { label: '受托支付账户户名', field: 'openCustomerName', minWidth: 150 },
  { label: '受托支付开户行行号', field: 'openBankNo', minWidth: 150 },
  { label: '受托支付开户行名称', field: 'openBankName', minWidth: 150 },
  { label: '出账流水号', field: 'bpSerialNo', minWidth: 150 },
  { label: '失效时间', field: 'invalidTime', minWidth: 150 },
]
const columns_base5_end = []
// 取消放贷
const columns_base6_start = [
  { label: '流水号', field: 'serialNo', minWidth: 150 },
  { label: '融资编号（渠道）', field: 'channelApplyNo', minWidth: 220 },
  { label: '客户编号', field: 'customerID', minWidth: 220 },
  { label: '客户名称', field: 'customerName', minWidth: 320 },
  { label: '证件号', field: 'certId', minWidth: 150 },
  { label: '出账流水号', field: 'putOutNo', minWidth: 150 },
  { label: '融资取消原因', field: 'remark', minWidth: 150 },
  { label: '申请时间', field: 'inputDate', minWidth: 150 },
  { label: '状态', field: 'status', minWidth: 150 },
]
const columns_base6_end = [
]

const columns_base = {
  1: {
    start: columns_base1_start,
    end: columns_base1_end,
  },
  2: {
    start: columns_base2_start,
    end: columns_base2_end,
  },
  3: {
    start: columns_base3_start,
    end: columns_base3_end,
  },
  4: {
    start: columns_base4_start,
    end: columns_base4_end,
  },
  5: {
    start: columns_base5_start,
    end: columns_base5_end,
  },
  6: {
    start: columns_base6_start,
    end: columns_base6_end,
  },
}

// 海大
const columns1 = [
  { label: '近一年交易金额', field: 'haidaTransSumOfYear1', minWidth: 150 },
  { label: '核心企业推荐额度', field: 'haidaRecommendSum1', minWidth: 150 },
  { label: '推荐利率', field: 'haidaRecommendRate', minWidth: 150 },
  { label: '经销商类型', field: 'haidaDealerType', minWidth: 150 },
]

// 双胞胎
const columns2 = [
  { label: '预计采购金额', field: 'sbtCaiGouSum1', minWidth: 150 },
  { label: '核心企业推荐额度', field: 'sbtRecommendSum1', minWidth: 150 },
  { label: '推荐利率', field: 'sbtRecommendRate', minWidth: 150 },
  { label: '双胞胎（饲料）', field: 'sbtDealerType', minWidth: 150 },
]

// 双胞胎饲料
const columns2_1 = [
  { label: '预计采购金额', field: 'sbtCaiGouSum1', minWidth: 150 },
  { label: '核心企业推荐额度', field: 'sbtRecommendSum1', minWidth: 150 },
  { label: '推荐利率', field: 'sbtRecommendRate', minWidth: 150 },
  { label: '双胞胎（饲料）', field: 'sbtDealerType', minWidth: 150 },
]

// 正邦
const columns3 = [
  { label: '预计采购金额', field: 'sbtCaiGouSum1', minWidth: 150 },
  { label: '核心企业推荐额度', field: 'sbtRecommendSum1', minWidth: 150 },
  { label: '推荐利率', field: 'sbtRecommendRate', minWidth: 150 },
  { label: '双胞胎（饲料）', field: 'sbtDealerType', minWidth: 150 },
]

// 通威
const columns4 = [
  { label: '授信申请编号（通威）', field: 'twChannelSerialNo', minWidth: 170 },
  { label: '核心企业推荐额度', field: 'twRecommendSum', minWidth: 150 },
  { label: '经销商类型', field: 'twDealerType', minWidth: 150 },
  { label: '饲料厂名称', field: 'twFeedFactory', minWidth: 150 },
  // { label: '经营区域', field: 'twBelongArea', minWidth: 150 },
  // { label: '核心企业推荐额度', field: 'twRecommendSum1', minWidth: 150 },
  // { label: '推荐利率', field: 'haidaRecommendRate', minWidth: 150 },
]

// 天马
const columns5 = [
  { label: '授信申请编号（天马）', field: 'tmChannelSerialNo', minWidth: 170 },
  { label: '核心企业推荐额度', field: 'tmRecommendSum1', minWidth: 150 },
  { label: '经营区域', field: 'tmBelongArea', minWidth: 150 },
  { label: '归属子公司', field: 'tmMatchProject', minWidth: 150 },
  { label: '饲料类型', field: 'tmDealerType', minWidth: 150 },
]

// 美团
const columns6 = [
  { label: '预计采购额', field: 'mtCaiGouSum', minWidth: 120 },
  { label: '推荐采购金额', field: 'mtRecommendSum', minWidth: 120 },
]

/**
 * 
 * @param {*} key haida01 (海大)
 * @param {*} type 1 待进件授信
 * @returns 
 */
export const getColumns = (key, type) => {
  const keys = {
    'haida01': columns1,
    'SBT001': columns2,
    'SBT002': columns2_1,
    'ZBKJ001': columns3,
    'tongwei01': columns4,
    'zytm001': columns5,
    'MTCDB001': columns6,
  }


  const columns = []
  
  columns.push(...columns_base[type].start)

  // 只有授信才需要加上这段
  if (type <= 3) columns.push(...keys[key])

  columns.push(...columns_base[type].end)

  return columns
}
