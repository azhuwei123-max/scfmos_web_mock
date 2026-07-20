<template>
  <!-- <IFrame src="https://crms-sit.ncbank.cn/Credit/ThirdLogon.jsp?TPUSERID=3087&TPPASSWORD=CC357616CC513B4896F8FED824B3E191&TPOPENTYPE=ZXQueryList&TPSERIALNO=SC2025030500000006&RightType=All" /> -->
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="150px"
    >
      <el-form-item label="工单编号" prop="no">
        <el-input
          v-model="queryParams.no"
          placeholder="请输入工单编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="工作流编号" prop="processInstanceId">
        <el-input
          v-model="queryParams.processInstanceId"
          placeholder="请输入工作流编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="审核状态" prop="auditStatus">
        <el-select
          v-model="queryParams.auditStatus" 
          placeholder="请选择审核状态"
          clearable
          class="!w-240px"
        >
          <el-option label="全部" value="" />
          <el-option label="待审核" value="0" />
          <el-option label="已通过" value="1" />
          <el-option label="已拒绝" value="2" />
          <el-option label="审核中" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="最后审核时间" prop="lastAuditTime">
        <el-date-picker
          v-model="queryParams.lastAuditTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          tpye=""
          plain
          @click="openForm('create')"
          v-hasPermi="['work:audit-work:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type=""
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['work:audit-work:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button
          type="danger"
          plain
          :disabled="isEmpty(checkedIds)"
          @click="handleDeleteBatch"
          v-hasPermi="['work:audit-work:delete']"
        >
          <Icon icon="ep:delete" class="mr-5px" /> 批量删除
        </el-button>
        <el-button
          tpye=""
          plain
          :disabled="!isSingleSelected"
          @click="handleBatchComment"
          v-hasPermi="['work:audit-work:opinion']"
        >
          <Icon icon="ep:delete" class="mr-5px" /> 审批意见
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table
      row-key="id"
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
      @selection-change="handleRowCheckboxChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="工单编号" align="center" prop="no" />
      <el-table-column label="工作流编号" align="center" prop="processInstanceId" />
      <el-table-column label="审核状态" align="center" prop="auditStatus" width="120px">
        <template #default="scope">
          <el-tag :type="getStatusTagType(scope.row.auditStatus)">
            {{ getStatusText(scope.row.auditStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="最后审核时间"
        align="center"
        prop="lastAuditTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" min-width="180px">
        <template #default="scope">
          <el-button
            link
            v-if="scope.row.auditStatus ==5 "
            tpye=""
            @click="handleSubmit(scope.row.id)"
            v-hasPermi="['work:audit-work:query']"
          >
            提交审核
          </el-button>
          <el-button
            link
            v-if="scope.row.auditStatus !== 5 "
            tpye=""
            @click="openDetail(scope.row.id)"
            v-hasPermi="['work:audit-work:query']"
          >
            查看审批
          </el-button>
          <el-button
            link
            tpye=""
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['work:audit-work:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['work:audit-work:delete']"
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
  <AuditWorkForm ref="formRef" @success="getList" />



  
  <!-- 审批意见对话框 -->
  <Dialog
    v-model="commentDialogVisible"
    title="审批意见"
    :fullscreen="false"
    :append-to-body="true"
    width="600px"
  >
    <el-form
      ref="commentFormRef"
      :model="commentFormData"
      :rules="commentFormRules"
      label-width="100px"
      v-loading="commentFetching"
    >
      <el-form-item label="审批意见" prop="comment">
        <el-input
          v-model="commentFormData.comment"
          type="textarea"
          :rows="6"
          placeholder="请输入审批意见"
          maxlength="1000"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button tpye="" :loading="commentLoading" @click="handleSubmitComment">
        提 交
      </el-button>
      <el-button @click="commentDialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <SubmitAuditDialog ref="submitAuditDialogRef" :process-variables-Str="processVariablesStr" :process-defineKey="processDefineKey"   @confirm="handleConfirmSubmit" />
</template>

<script setup lang="ts">
import { isEmpty } from '@/utils/is'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { AuditWorkApi, AuditWorkVO } from '@/api/work/audit'
import AuditWorkForm from './AuditWorkForm.vue'
import SubmitAuditDialog from './SubmitAuditDialog.vue'
import { submitOrder } from '@/api/pay/order'
import { SCOPE } from 'element-plus'
import { refDefault } from '@vueuse/core'

/** 工单审核 列表 */
defineOptions({ name: 'AuditWork' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化


const processDefineKey = 'crm_work_audit' // 流程定义 Key
const processVariablesStr = JSON.stringify({day: 0})

const loading = ref(true) // 列表的加载中
const list = ref<AuditWorkVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  no: undefined,
  processInstanceId: undefined,
  auditStatus: undefined,
  lastAuditTime: [],
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AuditWorkApi.getAuditWorkPage(queryParams)
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

/** 查看详情操作 */
const { push } = useRouter()
const openDetail = (id: number) => {
  push({ name: 'CrmAuditWorkDetail', query: { id } })
}

const submitAuditDialogRef = ref()
const currentSubmitWorkId = ref<number>()

const currentId = ref('')

const handleSubmit = async (id:number) => {
  const data = {id,taskId:'0'}
  console.log('data',data);
  currentId.value = id

  if(submitAuditDialogRef.value) {
    console.log('进来了吗');
    await submitAuditDialogRef.value.open()
  }
  
  // try {
  //    await submitAuditDialogRef.value.open()
  //    await message.confirm('确定提交审核吗？')
  //     await AuditWorkApi.submitOrder(data)
  //   message.success('提交成功')
  //   await getList()
  // } catch {}
}


const handleConfirmSubmit = async(assigness)=> {
    console.log('assigness',assigness);
    const data = {id:currentId.value,taskId:'0'}
    data.startUserSelectAssignees = assigness
    await AuditWorkApi.submitOrder(data)
    await getList()
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await AuditWorkApi.deleteAuditWork(id)
    message.success(t('common.delSuccess'))
    // currentRow.value = {}
    // 刷新列表
    await getList()
  } catch {}
}

/** 批量删除工单审核 */
const handleDeleteBatch = async () => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 批量删除 - 需要实现对应的API
    for (const id of checkedIds.value) {
      await AuditWorkApi.deleteAuditWork(id)
    }
    checkedIds.value = []
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (records: AuditWorkVO[]) => {
  checkedIds.value = records.map((item) => item.id)
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await AuditWorkApi.exportAuditWork(queryParams)
    download.excel(data, '工单审核.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 获取状态标签类型 */
const getStatusTagType = (status: string | number) => {
  const statusMap = {
    '1': 'success', // 已通过
    '2': 'danger', // 已拒绝
    '3': 'warning', // 审核中
    '4': 'danger', // 已取消
    '5': 'info', // 待审核
  }
  return statusMap[status] || 'info'
}

/** 获取状态文本 */
const getStatusText = (status: string | number) => {
  const statusMap = {
    '1': '已通过',
    '2': '已拒绝',
    '3': '审核中',
    '4': '已取消',
    "5": '待审核'
  }
  return statusMap[status] || '未知状态'
}



const isSingleSelected = computed(()=> {
  return checkedIds.value && checkedIds.value.length ===1
})



/** 审批意见相关 */
const commentDialogVisible = ref(false) // 审批意见对话框显示状态
const commentLoading = ref(false) // 审批意见提交加载状态
const commentFetching = ref(false) // 获取审批意见加载状态
const commentFormRef = ref() // 审批意见表单引用
const currentWorkId = ref<number>() // 当前操作的工单ID
const commentFormData = reactive({
  comment: '' // 审批意见内容
})

// 审批意见表单验证规则
const commentFormRules = {
  comment: [
    { required: true, message: '请输入审批意见', trigger: 'blur' },
    { max: 1000, message: '审批意见不能超过1000个字符', trigger: 'blur' }
  ]
}

/** 打开审批意见对话框 */
const openCommentDialog = async (id: number) => {
  currentWorkId.value = id
  commentFormData.comment = ''
  commentDialogVisible.value = true
  commentFetching.value = true

  try {
  const data = await AuditWorkApi.getComment(id)
  console.log('data',data);
  
  if(data && (data.approvalComment)) {
    commentFormData.comment = data.approvalComment
  }else {
    commentFormData.comment=''
  }
  } catch(error: any) {
    console.log('获取失败');
  } finally {
    commentFetching.value = false
     // 重置表单验证状态
    setTimeout(() => {
     commentFormRef.value?.clearValidate()
    }, 0)
  }


}

/** 打开审批意见对话框（仅限一条） */
const handleBatchComment = () => {
  const ids = checkedIds.value
  if (!ids || ids.length === 0) {
    message.warning('请先选择要上报意见的工单')
    return
  }
  if (ids.length > 1) {
    message.warning('请仅选择一条工单进行上报')
    return
  }
  // 打开审批意见对话框
  openCommentDialog(ids[0])
}

/** 提交审批意见 */
const handleSubmitComment = async () => {
  if (!commentFormRef.value) return

  try {
    // 表单验证
    await commentFormRef.value.validate()

    if (!currentWorkId.value) {
      message.warning('工单ID不存在')
      return
    }

    commentLoading.value = true
    // 调用上报审批意见接口
    await AuditWorkApi.submitOrderAd({
      businessId: currentWorkId.value,
      approvalComment: commentFormData.comment,
      taskId:'0'
    })

    message.success('审批意见上报成功')
    commentDialogVisible.value = false
    // 刷新列表
    await getList()
  } catch (error: any) {
    // 如果是表单验证错误，不显示错误提示
    if (error?.errors) {
      return
    }
    console.error('提交审批意见失败:', error)
    message.error('提交审批意见失败')
  } finally {
    commentLoading.value = false
  }
}





/** 初始化 **/
onMounted(() => {
  getList()
})






</script>
