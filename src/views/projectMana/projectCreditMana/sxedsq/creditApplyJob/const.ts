import type { TableColumn } from '@/types/table'
import { dateFormatter } from '@/utils/formatTime'

// 金额格式化函数
const amountFormatter = (_: any, __: any, cellValue: any) => {
  if (cellValue == null || cellValue === '') return ''
  return new Intl.NumberFormat('zh-CN', {
    style: 'decimal',
    // currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(cellValue)
}

// 默认查询参数
export const defaultQueryParams = {
  pageNo: 1,
  pageSize: 10,
  objectType:'CreditApply',
  phaseType:'1010'
}


// 发生类型选项
export const occurrenceTypeOptions = [
  { label: '新增', value: '新增' },
  // { label: '借新还旧', value: '借新还旧' },
  // { label: '还旧借新-风险化解', value: '还旧借新-风险化解' },
  { label: '续作', value: '续作' },
  { label: '复议', value: '复议' },
  { label: '重组', value: '重组' },
  // { label: '展期', value: '展期' },
  // { label: '提额', value: '提额' },
]

// 表格列配置
export const tableColumns: TableColumn[] = [
  { label: '申请编号', field: 'objectNo', minWidth: 220 },
  { label: '客户名称', field: 'customerName', minWidth: 320 },
  { label: '渠道标识', field: 'mrchFlg', minWidth: 100 },
  { label: '业务品种', field: 'businessTypeName', minWidth: 120 },
  { label: '发生类型', field: 'virtualOccurTypeName', minWidth: 120 },
  { label: '业务流程类型', field: 'applyModelTypeName', minWidth: 120 },
  { label: '币种', field: 'currencyName', minWidth: 80 },
  { label: '名义金额', field: 'businessSum', minWidth: 120, formatter: amountFormatter },
  { label: '敞口金额', field: 'exposureSum', minWidth: 120, formatter: amountFormatter },
  { label: '业务来源', field: 'sourceFrom', minWidth: 100 },
  { label: '申请人', field: 'operateUserName', minWidth: 100 },
  { label: '申请机构', field: 'operateOrgName', minWidth: 120 },
  { label: '当前流程', field: 'flowName', minWidth: 100 },
  { label: '当前阶段', field: 'phaseName', minWidth: 120 },
  { label: '完成时间', field: 'endTime', width: 180, formatter: dateFormatter },
  { label: '合作项目名称', field: 'projectName', minWidth: 320 },
  // { label: '操作', field: 'action', width: 180, fixed: 'right' as const }
]




export const appTypeOptions  =[
     { label: '按核心企业申报', value: '按核心企业' }
]


// 客户类型选项
export const customerTypeOptions = [
  { label: '公司客户', value: '01' },
  // { label: '集团客户', value: '02' },
  // { label: '虚拟方合作', value: '03' },
  { label: '同业客户', value: '04' }
]


export const routeNameTobuttonGroupsMap = {
  // 待处理申请
  creditApplyJob:[
    {label:'新增申请',type:"",key:'handleCreate'},
    {label:'取消申请',type:"",key:'handleCancel'},
    {label:'申请详情',type:"",key:'handleDetail'},
    {label:'签署意见',type:"",key:'doApprovalOpinion'},
    {label:'填写尽职调查报告',type:"",key:'writeDutReport'},
    {label:'删除尽职调查报告',type:"",key:'delDutReport'},
    {label:'查看尽职调查报告',type:"",key:'checkDutReport'},
    {label:'自动风险探测',type:"",key:'doRiskDetection'},
    {label:'提交',type:"",key:'submit'},
    {label:'审批客户分类',type:"",key:'apprCustType'},
    // {label:'关联白名单',type:"",key:'checkWhiteLoading'},
  ],
  //审查审批
  creditScSp:[
    {label:'申请详情',type:"",key:'handleDetail'},
    {label:'查看意见',type:"",key:'viewPhaseOpinion'},
    {label:'查看尽职调查报告',type:"",key:'checkDutReport'},
    {label:'查看流转记录',type:"",key:'toRecord'},
    {label:'收回',type:"",key:'takeBack'},
  ],
  //退回补件申请
  creditThbj:[
    {label:'取消申请',type:"",key:'handleCancel'},
    {label:'申请详情',type:"",key:'handleDetail'},
    {label:'取消申请',type:"",key:'handleCancel'},
    {label:'申请详情',type:"",key:'handleDetail'},
    {label:'查看意见',type:"",key:'viewPhaseOpinion'},
    {label:'签署意见',type:"",key:'doApprovalOpinion'},
    {label:'查看流转记录',type:"",key:'toRecord'},
    {label:'自动风险探测',type:"",key:'doRiskDetection'},
    {label:'提交',type:"",key:'submit'},
  ],
  //退回补充资料
  creditThbczl:[
    {label:'取消申请',type:"",key:'handleCancel'},
    {label:'申请详情',type:"",key:'handleDetail'},
    {label:'查看意见',type:"",key:'viewPhaseOpinion'},
    {label:'签署意见',type:"",key:'doApprovalOpinion'},
    {label:'填写尽职调查报告',type:"",key:'writeDutReport'},
    {label:'删除尽职调查报告',type:"",key:'delDutReport'},
    {label:'查看尽职调查报告',type:"",key:'checkDutReport'},
    {label:'自动风险探测',type:"",key:'doRiskDetection'},
    {label:'提交',type:"",key:'submit'},
  ],
  //审批通过
  creditSptg:[
    {label:'申请详情',type:"",key:'handleDetail'},
    {label:'查看意见',type:"",key:'viewPhaseOpinion'},
    {label:'查看尽职调查报告',type:"",key:'checkDutReport'},
    {label:'查看流转记录',type:"",key:'toRecord'},
    {label:'查看批复通知书',type:"",key:'viewEdpfReport'},
  ],
  //被否决的申请
  creditBfj:[
    {label:'申请详情',type:"",key:'handleDetail'},
    {label:'查看意见',type:"",key:'viewPhaseOpinion'},
    {label:'查看尽职调查报告',type:"",key:'checkDutReport'},
  ],
  //已作废
  creditYzf:[
    {label:'申请详情',type:"",key:'handleDetail'},
    {label:'查看意见',type:"",key:'viewPhaseOpinion'},
    {label:'查看尽职调查报告',type:"",key:'checkDutReport'},
  ],
  //已取消
  creditYqx:[
    {label:'申请详情',type:"",key:'handleDetail'},
    {label:'查看意见',type:"",key:'viewPhaseOpinion'},
    {label:'查看尽职调查报告',type:"",key:'checkDutReport'},
  ]
}
