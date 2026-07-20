import type { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from 'axios'
import { dashboardTabs, dashboardTasks, dictData, optionData, pageRecords, permissionInfo } from './data'

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))
const urlPath = (url = '') => url.split('?')[0].replace(/^https?:\/\/[^/]+/, '')
const urlQuery = (url = '') => Object.fromEntries(new URLSearchParams(url.split('?')[1] || ''))
const isPage = (url: string) => /(?:^|\/)(?:page|.*Page)$|\/page\//i.test(url)
const isOptionList = (url: string) => /simple-list|\/all$|select|query.*list|menu|tree|codeLibrary|dictionary|dict-data/i.test(url)
const isDetail = (url: string) => /\/get$|\/detail$|info|template|profile|customer/i.test(url)

const pageData = (config: AxiosRequestConfig) => {
  const query = { ...urlQuery(config.url), ...(config.params || {}) }
  const pageNo = Number(query.pageNo || query.pageNum || 1)
  const pageSize = Number(query.pageSize || 10)
  const list = pageRecords.map((item, index) => ({ ...item, id: item.id + (pageNo - 1) * pageSize + index }))
  return { total: 26, list, records: list, pageNo, pageSize }
}

const detailData = (config: AxiosRequestConfig) => ({
  ...pageRecords[0],
  ...(config.params || {}),
  ...(typeof config.data === 'object' && config.data ? config.data : {}),
  customerType: '企业客户',
  certType: '统一社会信用代码',
  certNo: '91310000MA1H000001',
  address: '上海市浦东新区金融街88号',
  contactName: '王磊',
  contactMobile: '13800000000'
})

export const mockAdapter: AxiosAdapter = async (config) => {
  await sleep(120)
  const url = urlPath(config.url)

  if (config.responseType === 'blob') {
    return {
      data: new Blob(['供应链金融管理作业平台 Mock 导出数据\n'], { type: 'text/plain;charset=utf-8' }),
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'text/plain;charset=utf-8' },
      config,
      request: { responseType: 'blob' }
    }
  }

  let data: unknown
  if (/\/system\/auth\/login$|\/sms-login$/.test(url)) {
    data = { id: 1, accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token', userId: 1, userType: 1, clientId: 'mock-web-client', expiresTime: Date.now() + 24 * 60 * 60 * 1000 }
  } else if (/\/system\/auth\/get-permission-info$/.test(url)) {
    data = permissionInfo
  } else if (/\/system\/dict-data\/simple-list$/.test(url)) {
    data = dictData
  } else if (/\/system\/index\/allCount$/.test(url)) {
    data = 0
  } else if (/\/system\/index\/getWaitDealQueryListGroup$/.test(url)) {
    data = dashboardTabs
  } else if (/\/system\/index\/getWaitDealQueryListGroupWithCount$/.test(url)) {
    const attribute6 = String(urlQuery(config.url).attribute6 || config.params?.attribute6 || '')
    data = { count: attribute6 === 'credit' || attribute6 === 'contract' ? 1 : 2 }
  } else if (/\/system\/index\/getWaitDealQueryListByAttribute$/.test(url)) {
    const attribute6 = String(urlQuery(config.url).attribute6 || config.params?.attribute6 || '')
    const list = attribute6 ? dashboardTasks.filter((item) => item.attribute6 === attribute6) : dashboardTasks
    data = { total: list.length, list }
  } else if (/\/system\/index\/mock-credit-pending$/.test(url)) {
    data = [{ name: '华东供应链有限公司 授信申请 SCF202607200001', serialNo: 'SCF202607200001' }]
  } else if (/\/system\/index\/mock-contract-pending$/.test(url)) {
    data = [{ name: '新城贸易有限公司 合同审批 HT202607190002', serialNo: 'HT202607190002' }]
  } else if (/\/system\/index\/getWorkMessage$/.test(url)) {
    data = [{ businessRemindGroup: '项目即将到期', businessRemindGroupNum: 1, attribute5: '请及时处理项目续期' }]
  } else if (/\/system\/index\/getNoticeMessage$/.test(url)) {
    data = [{ title: 'Mock 演示数据已启用', businessRemindGroup: '系统提示', itemno: 'NOTICE001' }]
  } else if (/\/system\/credit-apply\/todolist$/.test(url)) {
    data = {
      total: 2,
      list: [
        { serialNo: 'SCF202607200001', customerID: 'C202607200001', customerName: '华东供应链有限公司', mrchFlg: '直营网银', businessTypeName: '供应链流动资金贷款', virtualOccurTypeName: '新增', applyModelTypeName: '授信审批', currencyName: '人民币', businessSum: 1200000, sourceFrom: '供应链金融平台', operateUserName: '张晨', operateOrgName: '总行供应链金融部', flowName: '授信申请流程', phaseName: '待审批', endTime: '', projectName: '核心企业供应链金融项目', objectType: 'CreditApply', phaseNo: '1020' },
        { serialNo: 'SCF202607190002', customerID: 'C202607190002', customerName: '新城贸易有限公司', mrchFlg: '线下录入', businessTypeName: '经销商融资', virtualOccurTypeName: '续作', applyModelTypeName: '授信审批', currencyName: '人民币', businessSum: 800000, sourceFrom: '客户经理录入', operateUserName: '李敏', operateOrgName: '上海分行', flowName: '授信申请流程', phaseName: '待审批', endTime: '', projectName: '经销商融资项目', objectType: 'CreditApply', phaseNo: '1020' }
      ]
    }
  } else if (/captcha\/(get|check)$/.test(url)) {
    data = { repCode: '0000', repMsg: '校验成功', uuid: 'mock-captcha', captchaType: 'blockPuzzle' }
  } else if (/auth\/logout|\/create$|\/update$|\/delete$|\/save|\/submit|\/cancel|\/approve|\/reject|\/withdraw|\/add$|\/edit$|\/upload/i.test(url)) {
    data = typeof config.data === 'object' && config.data ? { id: (config.data as { id?: number }).id || Date.now(), ...(config.data as object) } : true
  } else if (isPage(url)) {
    data = pageData(config)
  } else if (isOptionList(url)) {
    data = optionData
  } else if (isDetail(url)) {
    data = detailData(config)
  } else {
    data = { success: true, ...detailData(config) }
  }

  const response: AxiosResponse = {
    data: { code: 200, msg: 'mock success', data },
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
    request: { responseType: config.responseType }
  }
  return response
}
