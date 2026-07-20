import request from '@/config/axios'

// 合作方客户合作项目情况 VO
export interface TeamWorkProjectVO {
  projectid: string // 项目编号
  customerid: string // 客户编号
  projectname: string // 项目名称
  begindate: string // 开始时间
  enddate: string // 结束日期
  sum1: number // 金额1
  sum2: number // 金额2
  remark: string // 备注
  inputuserid: string // 录入用户
  inputorgid: string // 录入机构ID
  inputdate: string // 录入日期
  updatedate: string // 更新日期
  teamworktype: string // 合作类型
  thirdorgtype: string // 第三方合作机构类型
  hasdebtmanage: string // 债项规则管理
  debtproject: string // 债项/产品方案
  creditbusinesstype: string // 授信业务品种
  bcbusinesstype: string // 用信业务品种
  detailproperty: string // 产品名称
  isautocontractflow: string // 是否自动化合同流程
  cycleflag: string // 合同额度是否循环
  lendback: string // 电子渠道放还款控制
  paymentmode: string // 支付方式
  entrustflag: string // 电子渠道受托支付模式
  direction: string // 贷款投向
  farmingtype: string // 涉农分类
  isgreenfinance: string // 是否绿色金融
  repricetype: string // 利率调整方式
  vouchtype: string // 主要担保方式
  rpttermid: string // 还款方式
  dzhtmodelno: string // 电子合同模板
  guarantycountrange: string // 保证金控制范围
  guarantycountrule: string // 授信阶段保证金计算规则
  guarantycountruleforbp: string // 放款阶段保证金计算规则
  guarantyaccountno: string // 核心企业保证金账户
  guarantyratio: number // 核心企业保证金比例
  issinglepaycontrol: string // 单笔出账期限控制
  singlepaymonth: string // 每笔出账业务，不超过（月）
  singlepayday: string // 每笔出账业务，不超过（日）
  iscoreloannotice: string // 是否核心企业通知放款
  openflag: string // 提前还款申请
  isautojudge: string // 是否启用授信决策审批
  jcmodelno: string // 授信决策审批模型
  isopenputoutmodel: string // 是否启用放款决策审批
  putoutjcmodelno: string // 放款审批决策模型
  decisionpersontype: string // 决策适用借款人类型
  hascreditlineguarantee: string // 是否关联融资担保额度
  rzdbcustomerid: string // 融资担保客户编号
  isconnregulator: string // 是否关联监管方额度
  jgfcustomerid: string // 监管方客户编号
  projectstatus: string // 项目状态
  projectauditstatus: string // 项目协审状态
  iscontractautojudge: string // 是否启用合同决策审批
  contractjcmodelno: string // 合同决策审批模型
  invaliduserid: string // 失效人
  invalidtime: string // 失效时间
  invalidorgid: string // 失效机构
  autoflowflag: string // 自动放款标志
  repaymentacctno: string // 还款账户
  disbursementacctno: string // 放款账户
  feeaccountno: string // 放款保理手续费扣款账号（供应商支付）
  prededinterestacctno: string // 预收利息扣款账号（供应商支付）
  corepayflag: string // 是否核心企业转账
  interestpayer: string // 还款付息方
  iszxentquery: string // 是否校验经营实体规则
  accountopenflag: string // 账户出入金相关配置
  dzhtsubdescribe: string // 电子合同补充条款
  repayaccountflag: string // 还款账户出金管控(CODENO:AccountOpenFlag)
  repayaccountlimitflag: string // 还款账户自动更新一次性额度(CODENO:AccountOpenFlag)
  hxfeeaccountno: string // 放款保理手续费扣款账号（核心企业支付）
  hxprededinterestacctno: string // 预收利息扣款账号（核心企业支付）
}

// 合作方客户合作项目情况 API
export const TeamWorkProjectApi = {
  // 查询合作方客户合作项目情况分页
  getTeamWorkProjectPage: async (params: any) => {
    return await request.get({ url: `/system/teamwork/team-work-project/page`, params })
  },

  // 查询合作方客户合作项目情况详情
  getTeamWorkProject: async (id: number) => {
    return await request.get({ url: `/system/teamwork/team-work-project/get?id=` + id })
  },

  // 新增合作方客户合作项目情况
  createTeamWorkProject: async (data: TeamWorkProjectVO) => {
    return await request.post({ url: `/system/teamwork/team-work-project/create`, data })
  },

  // 修改合作方客户合作项目情况
  updateTeamWorkProject: async (data: TeamWorkProjectVO) => {
    return await request.put({ url: `/system/teamwork/team-work-project/update`, data })
  },

  // 删除合作方客户合作项目情况
  deleteTeamWorkProject: async (id: number) => {
    return await request.delete({ url: `/system/teamwork/team-work-project/delete?id=` + id })
  },

  // 导出合作方客户合作项目情况 Excel
  exportTeamWorkProject: async (params) => {
    return await request.download({ url: `/system/teamwork/team-work-project/export-excel`, params })
  },

  // 提交审批
  workProjectApprove: async (id: number) => {
    return await request.get({ url: `/system/teamwork/team-work-project/submit?projectid=2014122400000001`  })
  },

  // 测试
  test: async (id: String) => {
    return await request.get({ url: `/system/teamwork/team-work-project/test?type=2`  })
  },
  // 同步
  // sync: async (id: String) => {
  //   return await request.get({ url: `/system/credit-apply/goToIndebtCredit?serialNo=BA2025111700000009`  })
  // },
  // 同步
  // sync: async (id: String) => {
  //   return await request.get({ url: `/system/dept/sync`  })
  // },
  sync: async (id: String) => {
    return await request.get({ url: `/system/singleCreditApply/getDetailInfo?serialNo=BA2025112100000002&objectType=CreditApply`  })
  },
}
