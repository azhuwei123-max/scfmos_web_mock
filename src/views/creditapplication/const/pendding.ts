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
  applicationNo: undefined,
  applicantName: undefined,
  merchantId: undefined, // 商户标识
  businessType: undefined, // 业务品种
  occurrenceType: undefined,// 发生类型
  phaseType:'1020'
}

// 发生类型选项
export const occurrenceTypeOptions = [
  { label: '新增', value: '新增' },
  { label: '借新还旧', value: '借新还旧' },
  { label: '还旧借新-风险化解', value: '还旧借新-风险化解' },
  { label: '续作', value: '续作' },
  { label: '复议', value: '复议' },
  { label: '展期', value: '展期' },
  { label: '提额', value: '提额' },
]

// 客户类型选项
export const customerTypeOptions = [
  { label: '公司客户', value: '01' },
  { label: '个人客户', value: '03' }
]

// 表格列配置
export const tableColumns: TableColumn[] = [
  { label: '申请编号', field: 'serialNo', minWidth: 220 },
  { label: '链属客户名称', field: 'customerName', minWidth: 320 },
  { label: '渠道标识', field: 'mrchFlg', minWidth: 100 },
  { label: '业务品种', field: 'businessTypeName', minWidth: 180 },
  { label: '发生类型', field: 'virtualOccurTypeName', minWidth: 120 },
  { label: '业务流程类型', field: 'applyModelTypeName', minWidth: 120 },
  { label: '币种', field: 'currencyName', minWidth: 80 },
  { label: '申请金额', field: 'businessSum', minWidth: 120, formatter: amountFormatter },
  { label: '业务来源', field: 'sourceFrom', minWidth: 140 },
  { label: '申请人', field: 'operateUserName', minWidth: 100 },
  { label: '申请机构', field: 'operateOrgName', minWidth: 160 },
  { label: '当前流程', field: 'flowName', minWidth: 160 },
  { label: '当前阶段', field: 'phaseName', minWidth: 120 },
  { label: '完成时间', field: 'endTime', width: 180, formatter: dateFormatter },
  { label: '供应链项目名称', field: 'projectName', minWidth: 320 },
  // { label: '操作', field: 'action', width: 180, fixed: 'right' as const }
]

export const routeNameToProcrssTypeMap = {
  Applicationpendding:'1010', // 待处理申请
  approvalApplication:'1020', //审查审批
  approvalThbj:'1025', //退回补件
  approvalThbczl:'1030', //退回补充资料
  approvalSptg:'1040',//审批通过
  approvalBfj:'1050', // 被否决申请
  approvalYzf:'1070',//已作废
  approvalYqx:'1090' // 已取消
}

export const routeNameTobuttonGroupsMap = {
  // 待处理申请
  Applicationpendding:[
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
    {label:'关联白名单',type:"",key:'relatedWhite'},
    {label:'导出Excel',type:"",key:'handleExport'},
  ],
  //审查审批中
  approvalApplication:[
    {label:'申请详情',type:"",key:'handleDetail'},
    {label:'查看意见',type:"",key:'viewPhaseOpinion'},
    {label:'查看尽职调查报告',type:"",key:'checkDutReport'},
    {label:'查看流转记录',type:"",key:'toRecord'},
    {label:'收回',type:"",key:'takeBack'},
    {label:'导出Excel',type:"",key:'handleExport'},
  ],
  //退回补件
  approvalThbj:[
    {label:'取消申请',type:"",key:'handleCancel'},
    {label:'申请详情',type:"",key:'handleDetail'},
    {label:'查看意见',type:"",key:'viewPhaseOpinion'},
    {label:'签署意见',type:"",key:'doApprovalOpinion'},
    {label:'查看流转记录',type:"",key:'toRecord'},
    {label:'自动风险探测',type:"",key:'doRiskDetection'},
    {label:'提交',type:"",key:'submit'},
  ],
  //退回补充资料
  approvalThbczl:[
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
  approvalSptg:[
    {label:'申请详情',type:"",key:'handleDetail'},
    {label:'查看意见',type:"",key:'viewPhaseOpinion'},
    // {label:'签署意见',type:"",key:'doApprovalOpinion'},
    // {label:'填写尽职调查报告',type:"",key:'writeDutReport'},
    // {label:'删除尽职调查报告',type:"",key:'delDutReport'},
    {label:'查看尽职调查报告',type:"",key:'checkDutReport'},
    {label:'查看流转记录',type:"",key:'toRecord'},
    {label:'查看批复通知书',type:"",key:'viewEdpfReport'},
    // {label:'自动风险探测',type:"",key:'doRiskDetection'},
    {label:'导出Excel',type:"",key:'handleExport'},
    // {label:'提交',type:"",key:'submit'},
  ],
  //被否决的申请
  approvalBfj:[
    {label:'申请详情',type:"",key:'handleDetail'},
    {label:'查看意见',type:"",key:'viewPhaseOpinion'},
    {label:'查看尽职调查报告',type:"",key:'checkDutReport'},
  ],
  //已作废
  approvalYzf:[
    {label:'申请详情',type:"",key:'handleDetail'},
    {label:'查看意见',type:"",key:'viewPhaseOpinion'},
    {label:'查看尽职调查报告',type:"",key:'checkDutReport'},
  ],
  //已取消
  approvalYqx:[
    {label:'申请详情',type:"",key:'handleDetail'},
    {label:'查看意见',type:"",key:'viewPhaseOpinion'},
    {label:'查看尽职调查报告',type:"",key:'checkDutReport'},
  ]
  // ...后面自己配
}
