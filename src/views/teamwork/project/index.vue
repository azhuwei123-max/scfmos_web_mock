<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="项目编号" prop="projectid">
        <el-input
          v-model="queryParams.projectid"
          placeholder="请输入项目编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="客户编号" prop="customerid">
        <el-input
          v-model="queryParams.customerid"
          placeholder="请输入客户编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="项目名称" prop="projectname">
        <el-input
          v-model="queryParams.projectname"
          placeholder="请输入项目名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="begindate">
        <el-date-picker
          v-model="queryParams.begindate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="结束日期" prop="enddate">
        <el-date-picker
          v-model="queryParams.enddate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="金额1" prop="sum1">
        <el-input
          v-model="queryParams.sum1"
          placeholder="请输入金额1"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="金额2" prop="sum2">
        <el-input
          v-model="queryParams.sum2"
          placeholder="请输入金额2"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="queryParams.remark"
          placeholder="请输入备注"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="录入用户" prop="inputuserid">
        <el-input
          v-model="queryParams.inputuserid"
          placeholder="请输入录入用户"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="录入机构ID" prop="inputorgid">
        <el-input
          v-model="queryParams.inputorgid"
          placeholder="请输入录入机构ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="录入日期" prop="inputdate">
        <el-date-picker
          v-model="queryParams.inputdate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="更新日期" prop="updatedate">
        <el-date-picker
          v-model="queryParams.updatedate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="合作类型" prop="teamworktype">
        <el-select
          v-model="queryParams.teamworktype"
          placeholder="请选择合作类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.COLLABORATION_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
     
    
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          tpye=""
          plain
          @click="openForm('create')"
          v-hasPermi="['teamwork:team-work-project:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type=""
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['teamwork:team-work-project:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      <el-button @click="handlerApprovw"><Icon icon="ep:search" class="mr-5px" /> 审批</el-button>
      <el-button @click="handlerOpen"><Icon icon="ep:search" class="mr-5px" /> open</el-button>

      <el-button @click="test"><Icon icon="ep:search" class="mr-5px" /> 测试</el-button>

      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="项目编号" align="center" prop="projectid" />
      <el-table-column label="客户编号" align="center" prop="customerid" />
      <el-table-column label="项目名称" align="center" prop="projectname" />
      <el-table-column label="开始时间" align="center" prop="begindate" />
      <el-table-column label="结束日期" align="center" prop="enddate" />
      <el-table-column label="金额1" align="center" prop="sum1" />
      <el-table-column label="金额2" align="center" prop="sum2" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="录入用户" align="center" prop="inputuserid" />
      <el-table-column label="录入机构ID" align="center" prop="inputorgid" />
      <el-table-column label="录入日期" align="center" prop="inputdate" />
      <el-table-column label="更新日期" align="center" prop="updatedate" />
      <el-table-column label="合作类型" align="center" prop="teamworktype" />
      <el-table-column label="第三方合作机构类型" align="center" prop="thirdorgtype" />
      <el-table-column label="债项规则管理" align="center" prop="hasdebtmanage" />
      <el-table-column label="债项/产品方案" align="center" prop="debtproject" />
      <el-table-column label="授信业务品种" align="center" prop="creditbusinesstype" />
      <el-table-column label="用信业务品种" align="center" prop="bcbusinesstype" />
      <el-table-column label="产品名称" align="center" prop="detailproperty" />
      <el-table-column label="是否自动化合同流程" align="center" prop="isautocontractflow" />
      <el-table-column label="合同额度是否循环" align="center" prop="cycleflag" />
      <el-table-column label="电子渠道放还款控制" align="center" prop="lendback" />
      <el-table-column label="支付方式" align="center" prop="paymentmode" />
      <el-table-column label="电子渠道受托支付模式" align="center" prop="entrustflag" />
      <el-table-column label="贷款投向" align="center" prop="direction" />
      <el-table-column label="涉农分类" align="center" prop="farmingtype" />
      <el-table-column label="是否绿色金融" align="center" prop="isgreenfinance" />
      <el-table-column label="利率调整方式" align="center" prop="repricetype" />
      <el-table-column label="主要担保方式" align="center" prop="vouchtype" />
      <el-table-column label="还款方式" align="center" prop="rpttermid" />
      <el-table-column label="电子合同模板" align="center" prop="dzhtmodelno" />
      <el-table-column label="保证金控制范围" align="center" prop="guarantycountrange" />
      <el-table-column label="授信阶段保证金计算规则" align="center" prop="guarantycountrule" />
      <el-table-column label="放款阶段保证金计算规则" align="center" prop="guarantycountruleforbp" />
      <el-table-column label="核心企业保证金账户" align="center" prop="guarantyaccountno" />
      <el-table-column label="核心企业保证金比例" align="center" prop="guarantyratio" />
      <el-table-column label="单笔出账期限控制" align="center" prop="issinglepaycontrol" />
      <el-table-column label="每笔出账业务，不超过（月）" align="center" prop="singlepaymonth" />
      <el-table-column label="每笔出账业务，不超过（日）" align="center" prop="singlepayday" />
      <el-table-column label="是否核心企业通知放款" align="center" prop="iscoreloannotice" />
      <el-table-column label="提前还款申请" align="center" prop="openflag" />
      <el-table-column label="是否启用授信决策审批" align="center" prop="isautojudge" />
      <el-table-column label="授信决策审批模型" align="center" prop="jcmodelno" />
      <el-table-column label="是否启用放款决策审批" align="center" prop="isopenputoutmodel" />
      <el-table-column label="放款审批决策模型" align="center" prop="putoutjcmodelno" />
      <el-table-column label="决策适用借款人类型" align="center" prop="decisionpersontype" />
      <el-table-column label="是否关联融资担保额度" align="center" prop="hascreditlineguarantee" />
      <el-table-column label="融资担保客户编号" align="center" prop="rzdbcustomerid" />
      <el-table-column label="是否关联监管方额度" align="center" prop="isconnregulator" />
      <el-table-column label="监管方客户编号" align="center" prop="jgfcustomerid" />
      <el-table-column label="项目状态" align="center" prop="projectstatus" />
      <el-table-column label="项目协审状态" align="center" prop="projectauditstatus" />
      <el-table-column label="是否启用合同决策审批" align="center" prop="iscontractautojudge" />
      <el-table-column label="合同决策审批模型" align="center" prop="contractjcmodelno" />
      <el-table-column label="失效人" align="center" prop="invaliduserid" />
      <el-table-column label="失效时间" align="center" prop="invalidtime" />
      <el-table-column label="失效机构" align="center" prop="invalidorgid" />
      <el-table-column label="自动放款标志" align="center" prop="autoflowflag" />
      <el-table-column label="还款账户" align="center" prop="repaymentacctno" />
      <el-table-column label="放款账户" align="center" prop="disbursementacctno" />
      <el-table-column label="放款保理手续费扣款账号（供应商支付）" align="center" prop="feeaccountno" />
      <el-table-column label="预收利息扣款账号（供应商支付）" align="center" prop="prededinterestacctno" />
      <el-table-column label="是否核心企业转账" align="center" prop="corepayflag" />
      <el-table-column label="还款付息方" align="center" prop="interestpayer" />
      <el-table-column label="是否校验经营实体规则" align="center" prop="iszxentquery" />
      <el-table-column label="账户出入金相关配置" align="center" prop="accountopenflag" />
      <el-table-column label="电子合同补充条款" align="center" prop="dzhtsubdescribe" />
      <el-table-column label="还款账户出金管控(CODENO:AccountOpenFlag)" align="center" prop="repayaccountflag" />
      <el-table-column label="还款账户自动更新一次性额度(CODENO:AccountOpenFlag)" align="center" prop="repayaccountlimitflag" />
      <el-table-column label="放款保理手续费扣款账号（核心企业支付）" align="center" prop="hxfeeaccountno" />
      <el-table-column label="预收利息扣款账号（核心企业支付）" align="center" prop="hxprededinterestacctno" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            tpye=""
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['teamwork:team-work-project:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['teamwork:team-work-project:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <TeamWorkProjectForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { TeamWorkProjectApi, TeamWorkProjectVO } from '@/api/teamwork/project'
import TeamWorkProjectForm from './TeamWorkProjectForm.vue'

/** 合作方客户合作项目情况 列表 */
defineOptions({ name: 'TeamWorkProject' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<TeamWorkProjectVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  projectid: undefined,
  customerid: undefined,
  projectname: undefined,
  begindate: [],
  enddate: [],
  sum1: undefined,
  sum2: undefined,
  remark: undefined,
  inputuserid: undefined,
  inputorgid: undefined,
  inputdate: [],
  updatedate: [],
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
  invalidtime: [],
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
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await TeamWorkProjectApi.getTeamWorkProjectPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await TeamWorkProjectApi.deleteTeamWorkProject(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await TeamWorkProjectApi.exportTeamWorkProject(queryParams)
    download.excel(data, '合作方客户合作项目情况.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const handlerApprovw = async () => {
   await TeamWorkProjectApi.workProjectApprove()
}

const test = async () => {
  const url =  await TeamWorkProjectApi.sync();
  // window.open(url);
}
const handlerOpen = async() => {
  window.open("http://192.168.160.43/standardize/creditApply?creditApplyNo=BA2025111700000009&prdNo=GYL12&userId=ZH0765&userPwd=CC357616CC513B4896F8FED824B3E191");
  // window.open("http://192.168.168.26:8082/creditmaven/ThirdLogon.jsp?TPUSERID=3087&TPPASSWORD=CC357616CC513B4896F8FED824B3E191&TPOPENTYPE=Loan&TPSERIALNO=2025091000001501&RightType=ReadOnly")
}


/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
