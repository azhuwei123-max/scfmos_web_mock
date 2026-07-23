import type {
  OrderContractLedgerAssetItem,
  OrderContractLedgerProject,
  OrderContractLedgerRecord
} from '@/api/indebt/orderContractLedgerQuery'

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

export const orderContractLedgerProjects: OrderContractLedgerProject[] = [
  {
    id: 1,
    projectNo: 'PJ202607010001',
    projectName: '钢贸供应链融资项目',
    coreEnterpriseName: '阿姆特拉斯供应链有限公司',
    coreCustomerNo: 'C2025040300000003',
    productPlan: '先票/款后货'
  },
  {
    id: 2,
    projectNo: 'PJ202606180006',
    projectName: '金属库存融资项目',
    coreEnterpriseName: '华东金属贸易有限公司',
    coreCustomerNo: 'C2025051200000018',
    productPlan: '货押融资'
  },
  {
    id: 3,
    projectNo: 'PJ202605080007',
    projectName: '煤炭库存融资项目',
    coreEnterpriseName: '华南能源有限公司',
    coreCustomerNo: 'C2025050600000052',
    productPlan: '货押融资'
  }
]

export const orderContractLedgerRecords: OrderContractLedgerRecord[] = [
  {
    id: 1,
    status: 'valid',
    orderContractFlowNo: 'OCF202607210001',
    orderContractNo: 'HT202607210001',
    customerName: '南京瑞钢贸易有限公司',
    coreCustomerNo: 'C2025040300000003',
    partyOne: '阿姆特拉斯供应链有限公司',
    partyTwo: '南京瑞钢贸易有限公司',
    partyThree: '中储南京物流有限公司',
    contractTotalAmount: 12000000,
    currentUsedAmount: 3600000,
    remainingAvailableAmount: 8400000,
    currency: '人民币',
    contractStartDate: '2026-07-01',
    contractEndDate: '2027-06-30',
    relatedBusinessContractNo: 'BC202607010001',
    dataSource: '客户经理录入',
    applicationDate: '2026-07-21',
    effectiveDate: '2026-07-22',
    projectId: 1,
    projectNo: 'PJ202607010001',
    projectName: '钢贸供应链融资项目',
    coreEnterpriseName: '阿姆特拉斯供应链有限公司',
    productPlan: '先票/款后货'
  },
  {
    id: 2,
    status: 'valid',
    orderContractFlowNo: 'OCF202607180002',
    orderContractNo: 'HT202607180002',
    customerName: '上海铜鑫实业有限公司',
    coreCustomerNo: 'C2025051200000018',
    partyOne: '华东金属贸易有限公司',
    partyTwo: '上海铜鑫实业有限公司',
    partyThree: '上海物流监管服务有限公司',
    contractTotalAmount: 8800000,
    currentUsedAmount: 2500000,
    remainingAvailableAmount: 6300000,
    currency: '人民币',
    contractStartDate: '2026-06-20',
    contractEndDate: '2027-06-19',
    relatedBusinessContractNo: 'BC202606180006',
    dataSource: '系统同步',
    applicationDate: '2026-07-18',
    effectiveDate: '2026-07-19',
    projectId: 2,
    projectNo: 'PJ202606180006',
    projectName: '金属库存融资项目',
    coreEnterpriseName: '华东金属贸易有限公司',
    productPlan: '货押融资'
  },
  {
    id: 3,
    status: 'invalid',
    orderContractFlowNo: 'OCF202606260003',
    orderContractNo: 'HT202606260003',
    customerName: '唐山港能贸易有限公司',
    coreCustomerNo: 'C2025050600000052',
    partyOne: '华南能源有限公司',
    partyTwo: '唐山港能贸易有限公司',
    partyThree: '中储能源监管有限公司',
    contractTotalAmount: 15000000,
    currentUsedAmount: 0,
    remainingAvailableAmount: 0,
    currency: '人民币',
    contractStartDate: '2026-06-01',
    contractEndDate: '2027-05-31',
    relatedBusinessContractNo: 'BC202605080007',
    dataSource: '客户经理录入',
    applicationDate: '2026-06-26',
    effectiveDate: '2026-06-27',
    invalidDate: '2026-07-20',
    projectId: 3,
    projectNo: 'PJ202605080007',
    projectName: '煤炭库存融资项目',
    coreEnterpriseName: '华南能源有限公司',
    productPlan: '货押融资'
  }
]

export const orderContractLedgerAssetItems: Record<number, OrderContractLedgerAssetItem[]> = {
  1: [
    {
      id: 1,
      productCode: 'GC-HRB400-001',
      productName: '螺纹钢 HRB400E',
      largeCategory: '黑色金属',
      middleCategory: '钢材',
      smallCategory: '螺纹钢',
      origin: '江苏南京',
      warehouseName: '南京滨江钢材仓',
      quantityOrWeight: 780,
      latestUnitPrice: 3920,
      latestInventoryValue: 3057600,
      currency: '人民币'
    }
  ],
  2: [
    {
      id: 2,
      productCode: 'YS-CU-001',
      productName: '电解铜',
      largeCategory: '有色金属',
      middleCategory: '铜',
      smallCategory: '电解铜',
      origin: '江西贵溪',
      warehouseName: '上海临港有色仓',
      quantityOrWeight: 36,
      latestUnitPrice: 71200,
      latestInventoryValue: 2563200,
      currency: '人民币'
    }
  ],
  3: [
    {
      id: 3,
      productCode: 'NY-MT-001',
      productName: '动力煤',
      largeCategory: '能源化工',
      middleCategory: '煤炭',
      smallCategory: '动力煤',
      origin: '山西大同',
      warehouseName: '唐山港煤炭监管仓',
      quantityOrWeight: 5200,
      latestUnitPrice: 780,
      latestInventoryValue: 4056000,
      currency: '人民币'
    }
  ]
}

export const getOrderContractLedgerRecord = (id: number | string) =>
  orderContractLedgerRecords.find((item) => item.id === Number(id))

export const getOrderContractLedgerAssetItems = (id: number | string) =>
  clone(orderContractLedgerAssetItems[Number(id)] || [])
