<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="客户编号" prop="customerid">
        <el-input v-model="formData.customerid" placeholder="请输入客户编号" />
      </el-form-item>
      <el-form-item label="项目名称" prop="projectname">
        <el-input v-model="formData.projectname" placeholder="请输入项目名称" />
      </el-form-item>
      <el-form-item label="开始时间" prop="begindate">
        <el-date-picker
          v-model="formData.begindate"
          type="date"
          value-format="x"
          placeholder="选择开始时间"
        />
      </el-form-item>
      <el-form-item label="结束日期" prop="enddate">
        <el-date-picker
          v-model="formData.enddate"
          type="date"
          value-format="x"
          placeholder="选择结束日期"
        />
      </el-form-item>
      <el-form-item label="金额1" prop="sum1">
        <el-input v-model="formData.sum1" placeholder="请输入金额1" />
      </el-form-item>
      <el-form-item label="金额2" prop="sum2">
        <el-input v-model="formData.sum2" placeholder="请输入金额2" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="录入用户" prop="inputuserid">
        <el-input v-model="formData.inputuserid" placeholder="请输入录入用户" />
      </el-form-item>
      <el-form-item label="录入机构ID" prop="inputorgid">
        <el-input v-model="formData.inputorgid" placeholder="请输入录入机构ID" />
      </el-form-item>
      <el-form-item label="录入日期" prop="inputdate">
        <el-date-picker
          v-model="formData.inputdate"
          type="date"
          value-format="x"
          placeholder="选择录入日期"
        />
      </el-form-item>
      <el-form-item label="更新日期" prop="updatedate">
        <el-date-picker
          v-model="formData.updatedate"
          type="date"
          value-format="x"
          placeholder="选择更新日期"
        />
      </el-form-item>
      <el-form-item label="合作类型" prop="teamworktype">
        <el-select v-model="formData.teamworktype" placeholder="请选择合作类型">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.$dictType.toUpperCase())"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="第三方合作机构类型" prop="thirdorgtype">
        <el-select v-model="formData.thirdorgtype" placeholder="请选择第三方合作机构类型">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.$dictType.toUpperCase())"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="债项规则管理" prop="hasdebtmanage">
        <el-input v-model="formData.hasdebtmanage" placeholder="请输入债项规则管理" />
      </el-form-item>
      <el-form-item label="债项/产品方案" prop="debtproject">
        <el-input v-model="formData.debtproject" placeholder="请输入债项/产品方案" />
      </el-form-item>
      <el-form-item label="授信业务品种" prop="creditbusinesstype">
        <el-select v-model="formData.creditbusinesstype" placeholder="请选择授信业务品种">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.$dictType.toUpperCase())"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用信业务品种" prop="bcbusinesstype">
        <el-select v-model="formData.bcbusinesstype" placeholder="请选择用信业务品种">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.$dictType.toUpperCase())"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="产品名称" prop="detailproperty">
        <el-input v-model="formData.detailproperty" placeholder="请输入产品名称" />
      </el-form-item>
      <el-form-item label="是否自动化合同流程" prop="isautocontractflow">
        <el-input v-model="formData.isautocontractflow" placeholder="请输入是否自动化合同流程" />
      </el-form-item>
      <el-form-item label="合同额度是否循环" prop="cycleflag">
        <el-input v-model="formData.cycleflag" placeholder="请输入合同额度是否循环" />
      </el-form-item>
      <el-form-item label="电子渠道放还款控制" prop="lendback">
        <el-input v-model="formData.lendback" placeholder="请输入电子渠道放还款控制" />
      </el-form-item>
      <el-form-item label="支付方式" prop="paymentmode">
        <el-input v-model="formData.paymentmode" placeholder="请输入支付方式" />
      </el-form-item>
      <el-form-item label="电子渠道受托支付模式" prop="entrustflag">
        <el-input v-model="formData.entrustflag" placeholder="请输入电子渠道受托支付模式" />
      </el-form-item>
      <el-form-item label="贷款投向" prop="direction">
        <el-input v-model="formData.direction" placeholder="请输入贷款投向" />
      </el-form-item>
      <el-form-item label="涉农分类" prop="farmingtype">
        <el-select v-model="formData.farmingtype" placeholder="请选择涉农分类">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.$dictType.toUpperCase())"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否绿色金融" prop="isgreenfinance">
        <el-input v-model="formData.isgreenfinance" placeholder="请输入是否绿色金融" />
      </el-form-item>
      <el-form-item label="利率调整方式" prop="repricetype">
        <el-select v-model="formData.repricetype" placeholder="请选择利率调整方式">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.$dictType.toUpperCase())"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="主要担保方式" prop="vouchtype">
        <el-select v-model="formData.vouchtype" placeholder="请选择主要担保方式">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.$dictType.toUpperCase())"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="还款方式" prop="rpttermid">
        <el-input v-model="formData.rpttermid" placeholder="请输入还款方式" />
      </el-form-item>
      <el-form-item label="电子合同模板" prop="dzhtmodelno">
        <el-input v-model="formData.dzhtmodelno" placeholder="请输入电子合同模板" />
      </el-form-item>
      <el-form-item label="保证金控制范围" prop="guarantycountrange">
        <el-input v-model="formData.guarantycountrange" placeholder="请输入保证金控制范围" />
      </el-form-item>
      <el-form-item label="授信阶段保证金计算规则" prop="guarantycountrule">
        <el-input v-model="formData.guarantycountrule" placeholder="请输入授信阶段保证金计算规则" />
      </el-form-item>
      <el-form-item label="放款阶段保证金计算规则" prop="guarantycountruleforbp">
        <el-input v-model="formData.guarantycountruleforbp" placeholder="请输入放款阶段保证金计算规则" />
      </el-form-item>
      <el-form-item label="核心企业保证金账户" prop="guarantyaccountno">
        <el-input v-model="formData.guarantyaccountno" placeholder="请输入核心企业保证金账户" />
      </el-form-item>
      <el-form-item label="核心企业保证金比例" prop="guarantyratio">
        <el-input v-model="formData.guarantyratio" placeholder="请输入核心企业保证金比例" />
      </el-form-item>
      <el-form-item label="单笔出账期限控制" prop="issinglepaycontrol">
        <el-input v-model="formData.issinglepaycontrol" placeholder="请输入单笔出账期限控制" />
      </el-form-item>
      <el-form-item label="每笔出账业务，不超过（月）" prop="singlepaymonth">
        <el-input v-model="formData.singlepaymonth" placeholder="请输入每笔出账业务，不超过（月）" />
      </el-form-item>
      <el-form-item label="每笔出账业务，不超过（日）" prop="singlepayday">
        <el-input v-model="formData.singlepayday" placeholder="请输入每笔出账业务，不超过（日）" />
      </el-form-item>
      <el-form-item label="是否核心企业通知放款" prop="iscoreloannotice">
        <el-input v-model="formData.iscoreloannotice" placeholder="请输入是否核心企业通知放款" />
      </el-form-item>
      <el-form-item label="提前还款申请" prop="openflag">
        <el-input v-model="formData.openflag" placeholder="请输入提前还款申请" />
      </el-form-item>
      <el-form-item label="是否启用授信决策审批" prop="isautojudge">
        <el-input v-model="formData.isautojudge" placeholder="请输入是否启用授信决策审批" />
      </el-form-item>
      <el-form-item label="授信决策审批模型" prop="jcmodelno">
        <el-input v-model="formData.jcmodelno" placeholder="请输入授信决策审批模型" />
      </el-form-item>
      <el-form-item label="是否启用放款决策审批" prop="isopenputoutmodel">
        <el-input v-model="formData.isopenputoutmodel" placeholder="请输入是否启用放款决策审批" />
      </el-form-item>
      <el-form-item label="放款审批决策模型" prop="putoutjcmodelno">
        <el-input v-model="formData.putoutjcmodelno" placeholder="请输入放款审批决策模型" />
      </el-form-item>
      <el-form-item label="决策适用借款人类型" prop="decisionpersontype">
        <el-select v-model="formData.decisionpersontype" placeholder="请选择决策适用借款人类型">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.$dictType.toUpperCase())"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否关联融资担保额度" prop="hascreditlineguarantee">
        <el-input v-model="formData.hascreditlineguarantee" placeholder="请输入是否关联融资担保额度" />
      </el-form-item>
      <el-form-item label="融资担保客户编号" prop="rzdbcustomerid">
        <el-input v-model="formData.rzdbcustomerid" placeholder="请输入融资担保客户编号" />
      </el-form-item>
      <el-form-item label="是否关联监管方额度" prop="isconnregulator">
        <el-input v-model="formData.isconnregulator" placeholder="请输入是否关联监管方额度" />
      </el-form-item>
      <el-form-item label="监管方客户编号" prop="jgfcustomerid">
        <el-input v-model="formData.jgfcustomerid" placeholder="请输入监管方客户编号" />
      </el-form-item>
      <el-form-item label="项目状态" prop="projectstatus">
        <el-radio-group v-model="formData.projectstatus">
          <el-radio
            v-for="dict in getStrDictOptions(DICT_TYPE.$dictType.toUpperCase())"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="项目协审状态" prop="projectauditstatus">
        <el-radio-group v-model="formData.projectauditstatus">
          <el-radio
            v-for="dict in getStrDictOptions(DICT_TYPE.$dictType.toUpperCase())"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否启用合同决策审批" prop="iscontractautojudge">
        <el-input v-model="formData.iscontractautojudge" placeholder="请输入是否启用合同决策审批" />
      </el-form-item>
      <el-form-item label="合同决策审批模型" prop="contractjcmodelno">
        <el-input v-model="formData.contractjcmodelno" placeholder="请输入合同决策审批模型" />
      </el-form-item>
      <el-form-item label="失效人" prop="invaliduserid">
        <el-input v-model="formData.invaliduserid" placeholder="请输入失效人" />
      </el-form-item>
      <el-form-item label="失效时间" prop="invalidtime">
        <el-date-picker
          v-model="formData.invalidtime"
          type="date"
          value-format="x"
          placeholder="选择失效时间"
        />
      </el-form-item>
      <el-form-item label="失效机构" prop="invalidorgid">
        <el-input v-model="formData.invalidorgid" placeholder="请输入失效机构" />
      </el-form-item>
      <el-form-item label="自动放款标志" prop="autoflowflag">
        <el-input v-model="formData.autoflowflag" placeholder="请输入自动放款标志" />
      </el-form-item>
      <el-form-item label="还款账户" prop="repaymentacctno">
        <el-input v-model="formData.repaymentacctno" placeholder="请输入还款账户" />
      </el-form-item>
      <el-form-item label="放款账户" prop="disbursementacctno">
        <el-input v-model="formData.disbursementacctno" placeholder="请输入放款账户" />
      </el-form-item>
      <el-form-item label="放款保理手续费扣款账号（供应商支付）" prop="feeaccountno">
        <el-input v-model="formData.feeaccountno" placeholder="请输入放款保理手续费扣款账号（供应商支付）" />
      </el-form-item>
      <el-form-item label="预收利息扣款账号（供应商支付）" prop="prededinterestacctno">
        <el-input v-model="formData.prededinterestacctno" placeholder="请输入预收利息扣款账号（供应商支付）" />
      </el-form-item>
      <el-form-item label="是否核心企业转账" prop="corepayflag">
        <el-input v-model="formData.corepayflag" placeholder="请输入是否核心企业转账" />
      </el-form-item>
      <el-form-item label="还款付息方" prop="interestpayer">
        <el-input v-model="formData.interestpayer" placeholder="请输入还款付息方" />
      </el-form-item>
      <el-form-item label="是否校验经营实体规则" prop="iszxentquery">
        <el-input v-model="formData.iszxentquery" placeholder="请输入是否校验经营实体规则" />
      </el-form-item>
      <el-form-item label="账户出入金相关配置" prop="accountopenflag">
        <el-input v-model="formData.accountopenflag" placeholder="请输入账户出入金相关配置" />
      </el-form-item>
      <el-form-item label="电子合同补充条款" prop="dzhtsubdescribe">
        <el-input v-model="formData.dzhtsubdescribe" placeholder="请输入电子合同补充条款" />
      </el-form-item>
      <el-form-item label="还款账户出金管控(CODENO:AccountOpenFlag)" prop="repayaccountflag">
        <el-input v-model="formData.repayaccountflag" placeholder="请输入还款账户出金管控(CODENO:AccountOpenFlag)" />
      </el-form-item>
      <el-form-item label="还款账户自动更新一次性额度(CODENO:AccountOpenFlag)" prop="repayaccountlimitflag">
        <el-input v-model="formData.repayaccountlimitflag" placeholder="请输入还款账户自动更新一次性额度(CODENO:AccountOpenFlag)" />
      </el-form-item>
      <el-form-item label="放款保理手续费扣款账号（核心企业支付）" prop="hxfeeaccountno">
        <el-input v-model="formData.hxfeeaccountno" placeholder="请输入放款保理手续费扣款账号（核心企业支付）" />
      </el-form-item>
      <el-form-item label="预收利息扣款账号（核心企业支付）" prop="hxprededinterestacctno">
        <el-input v-model="formData.hxprededinterestacctno" placeholder="请输入预收利息扣款账号（核心企业支付）" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" tpye="" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { TeamWorkProjectApi, TeamWorkProjectVO } from '@/api/teamwork/project'

/** 合作方客户合作项目情况 表单 */
defineOptions({ name: 'TeamWorkProjectForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  projectid: undefined,
  customerid: undefined,
  projectname: undefined,
  begindate: undefined,
  enddate: undefined,
  sum1: undefined,
  sum2: undefined,
  remark: undefined,
  inputuserid: undefined,
  inputorgid: undefined,
  inputdate: undefined,
  updatedate: undefined,
  teamworktype: undefined,
  thirdorgtype: undefined,
  hasdebtmanage: undefined,
  debtproject: undefined,
  creditbusinesstype: undefined,
  bcbusinesstype: undefined,
  detailproperty: undefined,
  isautocontractflow: undefined,
  cycleflag: undefined,
  lendback: undefined,
  paymentmode: undefined,
  entrustflag: undefined,
  direction: undefined,
  farmingtype: undefined,
  isgreenfinance: undefined,
  repricetype: undefined,
  vouchtype: undefined,
  rpttermid: undefined,
  dzhtmodelno: undefined,
  guarantycountrange: undefined,
  guarantycountrule: undefined,
  guarantycountruleforbp: undefined,
  guarantyaccountno: undefined,
  guarantyratio: undefined,
  issinglepaycontrol: undefined,
  singlepaymonth: undefined,
  singlepayday: undefined,
  iscoreloannotice: undefined,
  openflag: undefined,
  isautojudge: undefined,
  jcmodelno: undefined,
  isopenputoutmodel: undefined,
  putoutjcmodelno: undefined,
  decisionpersontype: undefined,
  hascreditlineguarantee: undefined,
  rzdbcustomerid: undefined,
  isconnregulator: undefined,
  jgfcustomerid: undefined,
  projectstatus: undefined,
  projectauditstatus: undefined,
  iscontractautojudge: undefined,
  contractjcmodelno: undefined,
  invaliduserid: undefined,
  invalidtime: undefined,
  invalidorgid: undefined,
  autoflowflag: undefined,
  repaymentacctno: undefined,
  disbursementacctno: undefined,
  feeaccountno: undefined,
  prededinterestacctno: undefined,
  corepayflag: undefined,
  interestpayer: undefined,
  iszxentquery: undefined,
  accountopenflag: undefined,
  dzhtsubdescribe: undefined,
  repayaccountflag: undefined,
  repayaccountlimitflag: undefined,
  hxfeeaccountno: undefined,
  hxprededinterestacctno: undefined,
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await TeamWorkProjectApi.getTeamWorkProject(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as TeamWorkProjectVO
    if (formType.value === 'create') {
      await TeamWorkProjectApi.createTeamWorkProject(data)
      message.success(t('common.createSuccess'))
    } else {
      await TeamWorkProjectApi.updateTeamWorkProject(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    projectid: undefined,
    customerid: undefined,
    projectname: undefined,
    begindate: undefined,
    enddate: undefined,
    sum1: undefined,
    sum2: undefined,
    remark: undefined,
    inputuserid: undefined,
    inputorgid: undefined,
    inputdate: undefined,
    updatedate: undefined,
    teamworktype: undefined,
    thirdorgtype: undefined,
    hasdebtmanage: undefined,
    debtproject: undefined,
    creditbusinesstype: undefined,
    bcbusinesstype: undefined,
    detailproperty: undefined,
    isautocontractflow: undefined,
    cycleflag: undefined,
    lendback: undefined,
    paymentmode: undefined,
    entrustflag: undefined,
    direction: undefined,
    farmingtype: undefined,
    isgreenfinance: undefined,
    repricetype: undefined,
    vouchtype: undefined,
    rpttermid: undefined,
    dzhtmodelno: undefined,
    guarantycountrange: undefined,
    guarantycountrule: undefined,
    guarantycountruleforbp: undefined,
    guarantyaccountno: undefined,
    guarantyratio: undefined,
    issinglepaycontrol: undefined,
    singlepaymonth: undefined,
    singlepayday: undefined,
    iscoreloannotice: undefined,
    openflag: undefined,
    isautojudge: undefined,
    jcmodelno: undefined,
    isopenputoutmodel: undefined,
    putoutjcmodelno: undefined,
    decisionpersontype: undefined,
    hascreditlineguarantee: undefined,
    rzdbcustomerid: undefined,
    isconnregulator: undefined,
    jgfcustomerid: undefined,
    projectstatus: undefined,
    projectauditstatus: undefined,
    iscontractautojudge: undefined,
    contractjcmodelno: undefined,
    invaliduserid: undefined,
    invalidtime: undefined,
    invalidorgid: undefined,
    autoflowflag: undefined,
    repaymentacctno: undefined,
    disbursementacctno: undefined,
    feeaccountno: undefined,
    prededinterestacctno: undefined,
    corepayflag: undefined,
    interestpayer: undefined,
    iszxentquery: undefined,
    accountopenflag: undefined,
    dzhtsubdescribe: undefined,
    repayaccountflag: undefined,
    repayaccountlimitflag: undefined,
    hxfeeaccountno: undefined,
    hxprededinterestacctno: undefined,
  }
  formRef.value?.resetFields()
}
</script>