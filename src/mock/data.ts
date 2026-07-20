/**
 * 本地演示数据。只放稳定、脱敏的业务样例，按需可继续补充具体接口。
 * 统一响应在 src/mock/index.ts 中组装为后端约定的 { code, msg, data }。
 */
export const optionData = [
  { label: '是', value: '1', code: '1', name: '是' },
  { label: '否', value: '0', code: '0', name: '否' }
]

export const dictData = [
  { id: 1, dictType: 'common_status', label: '启用', value: '0', colorType: 'success', cssClass: '' },
  { id: 2, dictType: 'common_status', label: '停用', value: '1', colorType: 'danger', cssClass: '' },
  { id: 3, dictType: 'yes_no', label: '是', value: '1', colorType: 'success', cssClass: '' },
  { id: 4, dictType: 'yes_no', label: '否', value: '0', colorType: 'info', cssClass: '' },
  { id: 5, dictType: 'approval_status', label: '待处理', value: '0', colorType: 'warning', cssClass: '' },
  { id: 6, dictType: 'approval_status', label: '已通过', value: '1', colorType: 'success', cssClass: '' }
]

export const pageRecords = [
  {
    id: 10001,
    serialNo: 'SCF202607200001',
    customerId: 'C202607200001',
    customerID: 'C202607200001',
    customerName: '华东供应链有限公司',
    entName: '华东供应链有限公司',
    projectId: 'P20260001',
    projectName: '核心企业供应链金融项目',
    businessNo: 'YW202607200001',
    contractNo: 'HT202607200001',
    creditLineNo: 'ED202607200001',
    amount: 5000000,
    creditAmount: 5000000,
    applyAmount: 1200000,
    status: '0',
    approvalStatus: '0',
    applyStatus: '待审批',
    createTime: '2026-07-20 09:30:00',
    updateTime: '2026-07-20 10:15:00',
    orgName: '总行供应链金融部',
    managerName: '张晨'
  },
  {
    id: 10002,
    serialNo: 'SCF202607190002',
    customerId: 'C202607190002',
    customerID: 'C202607190002',
    customerName: '新城贸易有限公司',
    entName: '新城贸易有限公司',
    projectId: 'P20260002',
    projectName: '经销商融资项目',
    businessNo: 'YW202607190002',
    contractNo: 'HT202607190002',
    creditLineNo: 'ED202607190002',
    amount: 2800000,
    creditAmount: 2800000,
    applyAmount: 800000,
    status: '1',
    approvalStatus: '1',
    applyStatus: '已通过',
    createTime: '2026-07-19 14:20:00',
    updateTime: '2026-07-20 08:45:00',
    orgName: '上海分行',
    managerName: '李敏'
  }
]

export const dashboardTasks = [
  {
    itemNo: 'credit-approval', itemName: '授信审批待办', itemAttribute: '/system/index/mock-credit-pending',
    attribute2: 'credit', attribute3: '授信审批', attribute6: 'credit', backlogGroupName: '授信业务'
  },
  {
    itemNo: 'contract-approval', itemName: '合同审批待办', itemAttribute: '/system/index/mock-contract-pending',
    attribute2: 'contract', attribute3: '合同审批', attribute6: 'contract', backlogGroupName: '合同业务'
  }
]

export const dashboardTabs = [
  { attribute6: 'credit', backlogGroupName: '授信业务', backlogGroupNum: '1', count: 1 },
  { attribute6: 'contract', backlogGroupName: '合同业务', backlogGroupNum: '2', count: 1 }
]

export const permissionInfo = {
  permissions: ['*:*:*'],
  roles: ['admin'],
  roleIds: ['1'],
  user: {
    id: 1,
    username: 'mock_admin',
    nickname: '本地演示用户',
    avatar: '',
    deptId: 1,
    mobile: '13800000000',
    email: 'mock@example.com'
  },
  dept: { id: 1, name: '总行供应链金融部' },
  quickMenus: [],
  menus: [
    {
      id: 100, parentId: 0, name: '客户管理', path: '/customerInfoMGM', icon: 'ep:user', visible: true, keepAlive: true,
      children: [
        { id: 101, parentId: 100, name: '公司客户管理', path: 'companyCustomerMGM/customerMGM', component: 'customerInfoMGM/companyCustomerMGM/customerMGM/index', icon: 'ep:office-building', visible: true, keepAlive: true }
      ]
    },
    {
      id: 200, parentId: 0, name: '授信申请', path: '/creditapplication', icon: 'ep:document', visible: true, keepAlive: true,
      children: [
        { id: 201, parentId: 200, name: '授信申请待办', path: 'pendding', component: 'creditapplication/pendding/index', icon: 'ep:timer', visible: true, keepAlive: true }
      ]
    },
    {
      id: 300, parentId: 0, name: '项目管理', path: '/projectMana', icon: 'ep:files', visible: true, keepAlive: true,
      children: [
        { id: 301, parentId: 300, name: '项目授信审批', path: 'projectCreditMana/xmsxsp', component: 'projectMana/projectCreditMana/xmsxsp/index', icon: 'ep:search', visible: true, keepAlive: true }
      ]
    }
  ]
}
