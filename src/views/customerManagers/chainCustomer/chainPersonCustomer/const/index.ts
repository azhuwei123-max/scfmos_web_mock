import type { TableColumn } from '@/types/table'

// 默认查询参数
export const defaultQueryParams = {
  pageNo: 1,
  pageSize: 10,
  customerName: undefined, // 客户名称
  idNumber: undefined, // 证件号
  projectName:undefined, 
  projectId:undefined,
  mfCustomerId: undefined
}

// 客户名称操作符选项
// export const customerNameOperatorOptions = [
//   { label: '包含', value: 'contains' },
//   { label: '等于', value: 'equals' },
//   { label: '以...开始', value: 'startsWith' }
// ]

// 证件号操作符选项
export const idNumberOperatorOptions = [
  { label: '以...开始', value: 'startsWith' },
  { label: '包含', value: 'contains' },
  { label: '等于', value: 'equals' }
]

// 表格列配置（根据后端接口字段）
export const tableColumns: TableColumn[] = [
  // { label: '客户编号', field: 'customerId', minWidth: 180 },
  { label: '客户名称', field: 'customerName', minWidth: 150 },
  { label: '证件类型', field: 'certTypeName', minWidth: 120 },
  { label: '证件号', field: 'certId', minWidth: 180 },
  // { label: '机构类型', field: 'orgNatureName', minWidth: 180 },
  { label: '供应链项目名称', field: 'projectName', minWidth: 320 },
  { label: '供应链项目编号', field: 'projectId', minWidth: 260 },
  // { label: '企业规模', field: 'scopeName', minWidth: 150 },
  { label: '是否我行定义小微', field: 'isSmallScopeName', minWidth: 150 },
  { label: '主办客户经理', field: 'managerUserName', minWidth: 150 },
  { label: '主办机构', field: 'managerOrgName', minWidth: 150 },
  { label: '核心客户号', field: 'mfCustomerId', minWidth: 120 },
  // { label: '机构类型', field: 'orgNatureName', minWidth: 120 },
  // { label: '企业规模', field: 'scopeName', minWidth: 120 },
  //{ label: '新建模式', field: 'creatModel', minWidth: 120 },
  // { label: '用户 ', field: 'userId', minWidth: 120 }
]

// 模拟数据配置
export const mockDataConfig = {
  // 客户名称列表
  customerNames: [
    '卢港澳',
    '正邦一',
    '通威一',
    '新希望一',
    '大北农一',
    '海大集团一',
    '双胞胎一',
    '正大集团一',
    '温氏股份一',
    '牧原股份一'
  ],
  // 证件类型列表
  idTypes: [
    '港澳居民来往内',
    '身份证',
    '护照',
    '港澳居民来往内地通行证',
    '台湾居民来往大陆通行证'
  ],
  // 模拟数据总数
  totalCount: 1308
}

// 过滤函数：根据操作符过滤数据
export const filterDataByOperator = (data: any[], field: string, value: string, operator: string) => {
  if (!value) return data

  switch (operator) {
    case 'contains':
      return data.filter(item => item[field]?.includes(value))
    case 'equals':
      return data.filter(item => item[field] === value)
    case 'startsWith':
      return data.filter(item => item[field]?.startsWith(value))
    default:
      return data
  }
}

// 生成模拟数据
export const generateMockData = (count: number = mockDataConfig.totalCount) => {
  const allMockData: any[] = []
  const { customerNames, idTypes } = mockDataConfig

  for (let i = 1; i <= count; i++) {
    const nameIndex = (i - 1) % customerNames.length
    const idTypeIndex = (i - 1) % idTypes.length
    const nameSuffix = Math.floor((i - 1) / customerNames.length) > 0 
      ? Math.floor((i - 1) / customerNames.length) 
      : ''
    
    allMockData.push({
      id: i,
      customerName: customerNames[nameIndex] + nameSuffix,
      customerId: `SC202504${String(Math.floor((i - 1) / 1000) + 1).padStart(2, '0')}${String(i).padStart(6, '0')}`,
      certTypeName: idTypes[idTypeIndex],
      certId: idTypeIndex === 0 
        ? `HA2001${String(i).padStart(8, '0')}` 
        : `${330212}${String(i).padStart(10, '0')}${i % 2 === 0 ? '0055' : '0033'}`,
      isSmallScope: i % 3 === 0 ? '是' : '否',
      mfCustomerID: `101255${String(i % 100).padStart(2, '0')}`,
      belongAttribute: i % 2 === 0 ? '有' : '无',
      belongAttribute2: i % 2 === 0 ? '有' : '无',
      belongAttribute1: '有',
      belongAttribute3: i % 2 === 0 ? '有' : '无'
    })
  }

  return allMockData
}

// Mock 数据获取接口（包含分页和过滤逻辑）
export const getMockListData = async (params: any) => {
  // 模拟接口延迟
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // 生成模拟数据
  const allMockData = generateMockData()
  
  // 分页处理
  const pageNo = params.pageNo || 1
  const pageSize = params.pageSize || 10
  const start = (pageNo - 1) * pageSize
  const end = start + pageSize
  
  // 过滤逻辑
  let filteredData = allMockData
  if (params.customerName) {
    filteredData = filterDataByOperator(
      filteredData,
      'customerName',
      params.customerName,
      params.customerNameOperator || 'contains'
    )
  }
  if (params.idNumber) {
    filteredData = filterDataByOperator(
      filteredData,
      'certId',
      params.idNumber,
      params.idNumberOperator || 'startsWith'
    )
  }
  
  const paginatedList = filteredData.slice(start, end)
  
  return {
    list: paginatedList,
    total: filteredData.length
  }
}

