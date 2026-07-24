import type { AssetLedgerProject, AssetLedgerRecord } from '@/api/indebt/assetLedgerQuery'
import { orderContractLedgerProjects, orderContractLedgerRecords } from './order-contract-ledger-query'

export const assetLedgerProjects: AssetLedgerProject[] = orderContractLedgerProjects

const categoryByPlan = (plan: string, index: number) =>
  plan === '货押融资'
    ? { largeCategory: '有色金属', middleCategory: '铜材', smallCategory: index % 2 ? '电解铜' : '铜杆' }
    : { largeCategory: '钢铁', middleCategory: index % 2 ? '板材' : '型材', smallCategory: index % 2 ? '热轧卷板' : '螺纹钢' }

export const assetLedgerRecords: AssetLedgerRecord[] = orderContractLedgerRecords.map((record, index) => {
  const category = categoryByPlan(record.productPlan, index)
  const quantity = 120 + index * 35
  const unitPrice = 6800 + index * 260
  const marketPrice = unitPrice + (index % 3 === 0 ? -180 : 120)
  const status = index % 4 === 0 ? 'pendingInbound' : index % 5 === 0 ? 'outbound' : index === 3 ? 'invalid' : 'inStock'
  return {
    id: record.id,
    projectId: record.projectId,
    status,
    productCode: `SP${record.projectId}00${index + 1}`,
    productName: category.smallCategory,
    ...category,
    orderContractNo: record.orderContractNo,
    orderContractFlowNo: record.orderContractFlowNo,
    customerName: record.customerName,
    coreCustomerNo: record.coreCustomerNo,
    relatedBusinessContractNo: record.relatedBusinessContractNo,
    batchNo: `B${record.projectNo.slice(2)}${index + 1}`,
    cabinetNo: `柜-${String(index + 1).padStart(3, '0')}`,
    origin: index % 2 ? '江苏' : '上海',
    warehouseName: index % 2 ? '苏州综合保税仓' : '上海临港监管仓',
    specification: index % 2 ? '厚度 2.0mm' : '标准规格',
    inStockLatestPrice: unitPrice,
    benchmarkPrice: unitPrice - 180,
    initialPricing: unitPrice - 320,
    latestMarketPrice: marketPrice,
    initialQuantityOrWeight: quantity + 25,
    inStockQuantityOrWeight: status === 'outbound' ? quantity - 45 : quantity,
    inStockLatestValue: quantity * unitPrice,
    benchmarkValue: quantity * (unitPrice - 180),
    initialPricingValue: (quantity + 25) * (unitPrice - 320),
    latestMarketValue: quantity * marketPrice,
    priceTrigger: index % 3 === 0 ? '已触发' : '未触发',
    dropRate: index % 3 === 0 ? 2.65 : 0.85,
    unitPriceUpdatedAt: `2026-07-${String(10 + index).padStart(2, '0')}`,
    priceCompensationAmount: index % 3 === 0 ? 18500 + index * 1200 : 0,
    currency: record.currency,
    goodsOwnership: index % 2 ? '借款人自己' : '核心企业',
    goodsStartDate: '2026-07-01',
    goodsEndDate: '2027-06-30',
    latestPickupDate: '2027-05-30',
    inStockDuration: `${18 + index}天`,
    goodsStatus: status === 'inStock' ? '正常' : status === 'pendingInbound' ? '待入库' : status === 'outbound' ? '已出库' : '失效',
    remark1: '系统生成',
    remark2: index % 2 ? '定期盘点' : '监管仓保管',
    loanStartDate: '2026-07-02',
    loanEndDate: '2027-06-30',
    generatedAt: `2026-07-${String(12 + index).padStart(2, '0')}`,
    inboundDate: status !== 'pendingInbound' ? '2026-07-03' : undefined,
    outboundDate: status === 'outbound' ? '2026-07-20' : undefined,
    invalidDate: status === 'invalid' ? '2026-07-18' : undefined
  }
})

