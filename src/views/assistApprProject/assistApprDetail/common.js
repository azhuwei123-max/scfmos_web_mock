import { DynamicForm, DockInfo, codeSource, newCodeSource } from '@/components/dynamicForm/class.ts'

export const dockList1 = [
  new DockInfo('基本信息情况', 'BasicPart'),
  new DockInfo('项目方案内容', 'ProjectPart'),
  new DockInfo('协审方案内容', 'AssistPart')
]

export const tempList = [
  new DynamicForm('BasicPart', '协审编号', 'MFCustomerID', 'input'),
  new DynamicForm('BasicPart', '客户编号', 'MFCustomerID', 'input'),
  new DynamicForm('BasicPart', '客户名称', 'MFCustomerID', 'input'),
  new DynamicForm('BasicPart', '项目名称', 'MFCustomerID', 'input'),
  new DynamicForm('BasicPart', '项目来源', 'MFCustomerID', 'select', codeSource('ProjectChannelSource')),
  new DynamicForm('BasicPart', '所属行业', 'MFCustomerID', 'select', codeSource('ProjectIndustryType')),
  new DynamicForm('BasicPart', '供应链标识', 'MFCustomerID', 'select', codeSource('GYLFlag')),
  new DynamicForm('BasicPart', '产品方案', 'MFCustomerID', 'input'),
  new DynamicForm('BasicPart', '是否分行权限', 'MFCustomerID', 'select', codeSource('YesNo')),
  new DynamicForm('BasicPart', '协审类型', 'MFCustomerID', 'select', newCodeSource('coreview_type')),
  new DynamicForm('BasicPart', '协审方式', 'MFCustomerID', 'select', newCodeSource('coreview_method')),
  new DynamicForm('BasicPart', '申请分行', 'MFCustomerID', 'input'),
  new DynamicForm('BasicPart', '申请分行业务团队', 'MFCustomerID', 'input'),

  // 项目方案内容
  new DynamicForm('ProjectPart', '项目额度', 'MFCustomerID', 'number', {
    colunit: '万元'
  }),
  new DynamicForm('ProjectPart', '项目敞口', 'MFCustomerID', 'number', {
    colunit: '万元'
  }),
  new DynamicForm('ProjectPart', '核心企业/合作方经营简介', 'MFCustomerID', 'textarea', {
    collimit: '5000'
  }),
  new DynamicForm('ProjectPart', '项目授信方案', 'MFCustomerID', 'textarea', {
    collimit: '5000'
  }),

  // 协审方案内容
  new DynamicForm('AssistPart', '核心企业是否愿意推荐链属企业', 'MFCustomerID', 'select', codeSource('YesNo')),
  new DynamicForm('AssistPart', '如否，请简述原因', 'MFCustomerID', 'textarea', { collimit: '5000' }),
  new DynamicForm('AssistPart', '链属企业推荐户数', 'MFCustomerID', 'number'),
  new DynamicForm('AssistPart', '调查联系户数', 'MFCustomerID', 'number'),
  new DynamicForm('AssistPart', '链属企业名称', 'MFCustomerID', 'input'),
  new DynamicForm('AssistPart', '链属企业配合情况简述', 'MFCustomerID', 'textarea', { collimit: '5000' }),
  new DynamicForm('AssistPart', '链属企业对方案的建议与顾虑', 'MFCustomerID', 'textarea', { collimit: '5000' }),
]
