import {
  DynamicForm,
  DockInfo,
  codeSource,
  newCodeSource,
  base3
} from '@/components/dynamicForm/class.ts'

export const dockList1 = [
  new DockInfo('基本信息', 'BasicPart'),
  new DockInfo('项目方案内容', 'ProjectPart'),
  new DockInfo('协审方案内容', 'AssistPart'),
  new DockInfo('审批意见', 'part4', 'part4'),
  new DockInfo('意见信息', 'part5'),
  new DockInfo('操作信息', 'part6')
]

export const dockList2 = [
  new DockInfo('意见信息', 'part5'),
  new DockInfo('操作信息', 'part6')
]

export const tempList = [
  new DynamicForm('BasicPart', '协审编号', 'serialno', 'input', base3('1', '1', '1')),
  new DynamicForm('BasicPart', '客户编号', 'customerid', 'input', base3('1', '1', '1')),
  new DynamicForm('BasicPart', '客户名称', 'customername', 'input', base3('1', '1', '1')),
  new DynamicForm('BasicPart', '项目名称', 'projectname', 'input', base3('1')),
  new DynamicForm('BasicPart', '项目来源', 'channelsource', 'checkbox', {
    ...base3('1'),
    ...codeSource('ProjectChannelSource')
  }),
  new DynamicForm('BasicPart', '所属行业', 'industrytype', 'select', {
    ...base3('1'),
    ...codeSource('ProjectIndustryType')
  }),
  // new DynamicForm('BasicPart', '供应链标识', 'gylflag', 'select', {
  //   ...base3('1', '1', '1'),
  //   ...codeSource('GYLFlag')
  // }),
  new DynamicForm('BasicPart', '产品方案', 'loanproductcategory', 'checkbox', {
    ...base3('1'),
    ...codeSource('GYLLoanProductCategory')
  }),
  new DynamicForm('BasicPart', '是否分行权限', 'branchaccess', 'select', {
    ...base3('1'),
    ...codeSource('YesNo')
  }),
  new DynamicForm('BasicPart', '协审类型', 'coreviewtype', 'select', {
    ...base3('1', '1', '1'),
    ...newCodeSource('coreview_type')
  }),
  new DynamicForm('BasicPart', '协审方式', 'coreviewmethod', 'select', {
    ...base3('1', '1', '1'),
    ...newCodeSource('coreview_method')
  }),
  new DynamicForm('BasicPart', '申请分行', 'branchname', 'input', base3('1')),
  new DynamicForm('BasicPart', '申请分行业务团队', 'inputorgid', 'input', base3('1')),

  // 项目方案内容
  new DynamicForm('ProjectPart', '项目额度（万元）', 'businesssum', 'number', {
    ...base3('1'),
    colunit: '万元'
  }),
  new DynamicForm('ProjectPart', '项目敞口（万元）', 'exposuresum', 'number', {
    ...base3('1'),
    colunit: '万元'
  }),
  new DynamicForm('ProjectPart', '核心企业/合作方经营简介', 'remark', 'textarea', {
    ...base3('1'),
    collimit: '5000'
  }),
  new DynamicForm('ProjectPart', '项目授信方案', 'scenename', 'textarea', {
    ...base3('1'),
    collimit: '5000'
  }),

  // 协审方案内容
  new DynamicForm('AssistPart', '核心企业是否愿意推荐链属企业', 'recommendwill', 'select', {
    ...base3('1'),
    ...codeSource('YesNo')
  }),
  new DynamicForm('AssistPart', '如否，请简述原因', 'noreason', 'textarea', {
    collimit: '5000'
  }),
  new DynamicForm('AssistPart', '链属企业推荐户数', 'recommendnum', 'input', base3('1')),
  new DynamicForm('AssistPart', '调查联系户数', 'searchnum', 'input', base3('1')),
  new DynamicForm('AssistPart', '链属企业名称', 'spcsentname', 'input', base3('1')),
  new DynamicForm('AssistPart', '链属企业配合情况简述', 'spcsentremark', 'textarea', {
    ...base3('1'),
    collimit: '5000'
  }),
  new DynamicForm('AssistPart', '链属企业对方案的建议与顾虑', 'spcsentrecommend', 'textarea', {
    ...base3('1'),
    collimit: '5000'
  }),
  
  new DynamicForm('part5', '意见', 'approvalComment', 'textarea', {
    ...base3('1'),
    collimit: '2000'
  }),

  new DynamicForm('part6', '登记人', 'nickName', 'input', base3('0', '1', '1')),
  new DynamicForm('part6', '登记日期', 'oprDate', 'input', base3('0', '1', '1')),
  new DynamicForm('part6', '登记机构', 'orgName', 'input', base3('0', '1', '1')),
]
