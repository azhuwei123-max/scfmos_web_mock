import type { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from 'axios'
import { dashboardTabs, dashboardTasks, dictData, optionData, pageRecords, permissionInfo } from './data'
import {
  createInventoryGoodsRecord,
  inventoryGoodsRecords,
  markInventoryGoodsHistory
} from './inventory-goods'
import { projectCreditApplyRecords, projectCreditDetail } from './project-credit-detail'

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))
const urlPath = (url = '') => url.split('?')[0].replace(/^https?:\/\/[^/]+/, '')
const urlQuery = (url = '') => Object.fromEntries(new URLSearchParams(url.split('?')[1] || ''))
const isPage = (url: string) => /(?:^|\/)(?:page|.*Page)$|\/page\//i.test(url)
const isOptionList = (url: string) => /simple-list|\/all$|select|query.*list|menu|tree|codeLibrary|dictionary|dict-data/i.test(url)
const isDetail = (url: string) => /\/get$|\/detail$|info|template|profile|customer/i.test(url)
const cloneMockData = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T
const projectCreditDetailCacheKey = 'scfmos.mock.project-credit-detail-cache'
const loadProjectCreditDetailCache = (): Record<string, Recordable> => {
  if (typeof window === 'undefined') return {}

  try {
    const cached = window.sessionStorage.getItem(projectCreditDetailCacheKey)
    const parsed = cached ? JSON.parse(cached) : {}
    return typeof parsed === 'object' && parsed ? (parsed as Record<string, Recordable>) : {}
  } catch {
    return {}
  }
}
const projectCreditDetailCache = loadProjectCreditDetailCache()
const persistProjectCreditDetailCache = () => {
  if (typeof window === 'undefined') return

  try {
    window.sessionStorage.setItem(projectCreditDetailCacheKey, JSON.stringify(projectCreditDetailCache))
  } catch {
    // 本地演示缓存失败时仍保留本页内存数据，不影响详情页操作。
  }
}
const parseMockPayload = (data: unknown): Recordable => {
  if (typeof data === 'object' && data) return data as Recordable
  if (typeof data !== 'string') return {}

  try {
    const parsed = JSON.parse(data)
    return typeof parsed === 'object' && parsed ? (parsed as Recordable) : {}
  } catch {
    return Object.fromEntries(new URLSearchParams(data))
  }
}

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

const inventoryGoodsPageData = (config: AxiosRequestConfig) => {
  const query = { ...urlQuery(config.url), ...(config.params || {}) }
  const pageNo = Math.max(1, Number(query.pageNo || 1))
  const pageSize = Math.max(1, Number(query.pageSize || 20))
  const largeCategoryCode = String(query.largeCategoryCode || '').trim()
  const largeCategoryName = String(query.largeCategoryName || '').trim()
  const status = String(query.status || '').trim()
  const filtered = inventoryGoodsRecords.filter((record) => {
    const matchesCode = !largeCategoryCode || record.largeCategoryCode.includes(largeCategoryCode)
    const matchesName = !largeCategoryName || record.largeCategoryName.includes(largeCategoryName)
    const matchesStatus = !status || record.status === status
    return matchesCode && matchesName && matchesStatus
  })
  const start = (pageNo - 1) * pageSize
  const list = cloneMockData(filtered.slice(start, start + pageSize))

  return { total: filtered.length, list, records: list, pageNo, pageSize }
}

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
  } else if (/\/system\/creditLimitApply\/qryApplyListPage$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const pageNo = Number(query.pageNo || query.pageNum || 1)
    const pageSize = Number(query.pageSize || 10)
    data = {
      total: projectCreditApplyRecords.length,
      list: projectCreditApplyRecords,
      records: projectCreditApplyRecords,
      pageNo,
      pageSize
    }
  } else if (/\/system\/creditLimitApply\/saveProjectDetail$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const serialNo = String(payload.serialNo || projectCreditDetail.applicationNo)
    const savedDetail = cloneMockData(
      projectCreditDetailCache[serialNo] || (projectCreditDetail as unknown as Recordable)
    )
    const basicFields = Array.isArray(payload.basicFields) ? cloneMockData(payload.basicFields) : undefined

    if (basicFields) {
      const sections = savedDetail.sections as Recordable
      const basic = sections.basic as Recordable
      basic.fields = basicFields

      const coreEnterpriseName = basicFields.find(
        (field: Recordable) => field.key === 'coreEnterpriseName'
      )?.value
      if (typeof coreEnterpriseName === 'string' && coreEnterpriseName) {
        savedDetail.customerName = coreEnterpriseName
        const customer = savedDetail.customer as Recordable
        const customerNameField = (customer.fields as Recordable[]).find(
          (field) => field.label === '客户名称'
        )
        if (customerNameField) customerNameField.value = coreEnterpriseName
      }
    }

    projectCreditDetailCache[serialNo] = savedDetail
    persistProjectCreditDetailCache()
    data = cloneMockData(savedDetail)
  } else if (/\/system\/creditLimitApply\/getProjectDetail$/.test(url)) {
    const serialNo = String(urlQuery(config.url).serialNo || config.params?.serialNo || '')
    const detailKey = serialNo || projectCreditDetail.applicationNo
    const projectDetail = projectCreditDetailCache[detailKey] || (projectCreditDetail as unknown as Recordable)
    data = {
      ...cloneMockData(projectDetail),
      applicationNo: detailKey
    }
  } else if (/\/system\/indebt\/inventory-goods\/page$/.test(url)) {
    data = inventoryGoodsPageData(config)
  } else if (/\/system\/indebt\/inventory-goods\/active-list$/.test(url)) {
    data = cloneMockData(inventoryGoodsRecords.filter((record) => record.status === '启用'))
  } else if (/\/system\/indebt\/inventory-goods\/create$/.test(url)) {
    data = cloneMockData(createInventoryGoodsRecord(parseMockPayload(config.data)))
  } else if (/\/system\/indebt\/inventory-goods\/history$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const ids = Array.isArray(payload.ids) ? payload.ids : []
    data = { updated: markInventoryGoodsHistory(ids) }
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
