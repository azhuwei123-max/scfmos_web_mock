<template>
  <ContentWrap>
    <!-- 查询条件 -->
    <div class="mb-15px">
      <div class="text-16px font-bold mb-15px">查询条件</div>
      <el-form
        ref="queryFormRef"
        :model="queryParams"
        :inline="true"
        label-width="100px"
        class="search-form"
      >
        <el-form-item label="申请流水号" prop="serialNo">
          <el-input
            v-model="queryParams.serialNo"
            placeholder="请输入申请流水号"
            clearable
            class="!w-200px"
          />
        </el-form-item>
        <el-form-item label="客户编号" prop="customerId">
          <el-input
            v-model="queryParams.customerId"
            placeholder="请输入客户编号"
            clearable
            class="!w-200px"
          />
        </el-form-item>
        <el-form-item label="企业名称" prop="enterpriseName">
          <el-input
            v-model="queryParams.enterpriseName"
            placeholder="请输入企业名称"
            clearable
            class="!w-200px"
          />
        </el-form-item>
        <el-form-item label="发生类型" prop="occurType">
          <el-select
            v-model="queryParams.occurType"
            placeholder="请选择发生类型"
            clearable
            class="!w-200px"
          >
            <el-option
              v-for="item in occurrenceTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button tpye="" @click="handleQuery">确定</el-button>
          <el-button @click="handleCancel">取消</el-button>
          <el-button @click="handleClear">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
  </ContentWrap>

  <!-- 操作按钮 -->
  <ContentWrap>
    <div class="mb-15px flex gap-10px">
      <el-button tpye="" @click="handleCreate">
        <Icon icon="ep:plus" class="mr-5px" />
        新增申请
      </el-button>
      
    </div>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <Table
      :columns="tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="{
        total: tableObject.total
      }"
      highlight-current-row
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      @current-change="handleSelectionChange"
      @row-dblclick="handleApplicationDetailByRow"
    >
      <template #serialNo="{ row }">
        <el-button link tpye="" @click="handleApplicationDetailByRow(row)">
          {{ row.serialNo }}
        </el-button>
      </template>
      <template #action="{ row }">
        <div class="flex gap-5px flex-wrap">
          <el-button link tpye="" @click="handleApplicationDetailByRow(row)">
            申请详情
          </el-button>
          <!-- <el-button link tpye="" @click="handleViewCommentsByRow(row)">
            签署意见
          </el-button>
          <el-button link tpye="" @click="handleViewCommentDetailByRow(row)">
            查看意见
          </el-button> -->
          <el-button link type="" @click="handleCancelApplicationByRow(row)">
            取消申请
          </el-button>
          <el-button 
        tpye="" 
        link
        @click="handleSubmit(row)" 
       
      >
      
        提交
      </el-button>
        </div>
      </template>
    </Table>
  </ContentWrap>

  <!-- 查看尽职调查报告对话框 -->
  <Dialog 
    :model-value="dueDiligenceDialogVisible" 
    @update:model-value="dueDiligenceDialogVisible = $event"
    title="查看尽职调查报告" 
    :fullscreen="false"
    :append-to-body="true"
    width="1200px"
  >
    <el-table
      v-loading="dueDiligenceLoading"
      :data="dueDiligenceList"
      border
      style="width: 100%"
      :show-overflow-tooltip="true"
    >
      <el-table-column label="报告编号" prop="reportNo" min-width="150" />
      <el-table-column label="报告名称" prop="reportName" min-width="200" show-overflow-tooltip />
      <el-table-column label="报告类型" prop="reportType" min-width="120" />
      <el-table-column label="调查人" prop="investigator" min-width="120" />
      <el-table-column label="调查日期" prop="investigateDate" min-width="120" />
      <el-table-column label="报告状态" prop="status" min-width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '已完成' ? 'success' : 'info'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="报告摘要" prop="summary" min-width="300" show-overflow-tooltip />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button link tpye="" @click="handleViewReportDetail(row)">
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button @click="dueDiligenceDialogVisible = false">关 闭</el-button>
    </template>
  </Dialog>

  <!-- 签署意见对话框 -->
  <Dialog 
    :model-value="commentDialogVisible" 
    @update:model-value="commentDialogVisible = $event"
    title="签署意见" 
    :fullscreen="false"
    :append-to-body="true"
    width="800px"
  >
    <el-form
      ref="commentFormRef"
      :model="commentFormData"
      :rules="commentFormRules"
      label-width="0"
    >
      <el-form-item prop="comment" required>
        <div class="flex items-center mb-10px">
          <span class="text-14px">意见(限1000汉字)</span>
          <span class="text-red-500 ml-5px">*</span>
        </div>
        <el-input
          v-model="commentFormData.comment"
          type="textarea"
          :rows="8"
          placeholder="请输入意见"
          maxlength="1000"
          show-word-limit
        />
      </el-form-item>
      
      <!-- 登记信息 -->
      <div class="mt-20px pt-20px border-t border-gray-200">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="text-14px text-gray-600 mb-5px">登记机构</div>
            <div class="text-14px">{{ commentFormData.registrationInstitution || '-' }}</div>
          </el-col>
          <el-col :span="8">
            <div class="text-14px text-gray-600 mb-5px">登记人</div>
            <div class="text-14px">{{ commentFormData.registrant || '-' }}</div>
          </el-col>
          <el-col :span="8">
            <div class="text-14px text-gray-600 mb-5px">登记日期</div>
            <div class="text-14px">{{ commentFormData.registrationDate || '-' }}</div>
          </el-col>
        </el-row>
      </div>
    </el-form>
    
    <template #footer>
      <el-button tpye="" :loading="commentSaving" @click="handleSaveComment">
        <Icon icon="ep:document" class="mr-5px" />
        保存
      </el-button>
      <el-button type="" @click="handleDeleteComment" :disabled="!commentFormData.comment">
        <Icon icon="ep:delete" class="mr-5px" />
        删除意见
      </el-button>
      <el-button @click="commentDialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <!-- 查看意见对话框 -->
  <Dialog 
    :model-value="viewCommentDialogVisible" 
    @update:model-value="viewCommentDialogVisible = $event"
    title="查看意见" 
    :fullscreen="false"
    :append-to-body="true"
    width="800px"
  >
    <!-- 信息区域 -->
    <div class="mb-20px">
      <el-row :gutter="20" class="mb-15px">
        <el-col :span="8">
          <div class="text-14px text-gray-600 mb-5px">名称</div>
          <div class="text-14px">{{ viewCommentData.name || '-' }}</div>
        </el-col>
        <el-col :span="8">
          <div class="text-14px text-gray-600 mb-5px">处理人</div>
          <div class="text-14px">{{ viewCommentData.handler || '-' }}</div>
        </el-col>
        <el-col :span="8">
          <div class="text-14px text-gray-600 mb-5px">处理人所属机构</div>
          <div class="text-14px">{{ viewCommentData.handlerOrg || '-' }}</div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb-15px">
        <el-col :span="8">
          <div class="text-14px text-gray-600 mb-5px">审批渠道</div>
          <div class="text-14px">{{ viewCommentData.approvalChannel || '-' }}</div>
        </el-col>
        <el-col :span="8">
          <div class="text-14px text-gray-600 mb-5px">时间</div>
          <div class="text-14px">{{ viewCommentData.time || '-' }}</div>
        </el-col>
        <el-col :span="8">
          <div class="text-14px text-gray-600 mb-5px">完成时间</div>
          <div class="text-14px">{{ viewCommentData.completionTime || '-' }}</div>
        </el-col>
      </el-row>
    </div>

    <!-- 意见内容区域 -->
    <div class="mt-20px">
      <div class="text-14px text-gray-600 mb-10px">意见内容</div>
      <div class="p-15px bg-gray-50 border border-gray-200 rounded min-h-200px">
        <div class="text-14px whitespace-pre-wrap">{{ viewCommentData.comment || '暂无意见' }}</div>
      </div>
    </div>
    
    <template #footer>
      <el-button @click="viewCommentDialogVisible = false">关 闭</el-button>
    </template>
  </Dialog>

  <!-- 企业白名单校验对话框 -->
  <Dialog 
    :model-value="whitelistCheckDialogVisible" 
    @update:model-value="whitelistCheckDialogVisible = $event"
    title="企业白名单" 
    :fullscreen="false"
    :append-to-body="true"
    width="900px"
  >
    <!-- 标题区域 -->
    <div class="flex justify-between items-center mb-20px">
      <div class="flex items-center">
        <el-icon class="text-blue-500 mr-5px" :size="20">
          <InfoFilled />
        </el-icon>
        <span class="text-16px font-bold">企业白名单</span>
      </div>
      <el-tag :type="whitelistCheckResult.status === 'pass' ? 'success' : 'danger'" size="large">
        {{ whitelistCheckResult.status === 'pass' ? '通过' : '未通过' }}
      </el-tag>
    </div>

    <!-- 校验结果表格 -->
    <el-table
      :data="whitelistCheckResult.checkList"
      border
      style="width: 100%"
      :show-header="true"
    >
      <el-table-column label="处理的任务" prop="taskName" min-width="280" />
      <el-table-column label="处理结果" prop="result" width="120" align="center">
        <template #default="{ row }">
          <el-icon v-if="row.result === 'pass'" class="text-green-500" :size="20">
            <Check />
          </el-icon>
          <el-icon v-else class="text-red-500" :size="20">
            <Close />
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column label="提示信息" prop="message" min-width="350">
        <template #default="{ row }">
          <div v-if="Array.isArray(row.messages)">
            <div v-for="(msg, index) in row.messages" :key="index" class="mb-5px">
              {{ msg }}
            </div>
          </div>
          <div v-else>{{ row.message || row.messages || '-' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template #default="{ row }">
          <el-button v-if="row.result === 'fail'" link tpye="" size="small">
            查看详情
          </el-button>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 最终结果 -->
    <div class="mt-20px pt-15px border-t border-gray-200">
      <div class="text-14px mb-5px">最终结果：</div>
      <div :class="whitelistCheckResult.status === 'pass' ? 'text-green-500' : 'text-red-500'" class="text-14px font-bold">
        {{ whitelistCheckResult.status === 'pass' ? '通过' : '未通过' }} {{ whitelistCheckResult.finalMessage }}
      </div>
    </div>
    
    <template #footer>
      <el-button @click="handleRecheck" :loading="recheckLoading">
        <Icon icon="ep:refresh" class="mr-5px" />
        重新检查
      </el-button>
      <el-button tpye="" @click="handleConfirmSubmit" :disabled="whitelistCheckResult.status !== 'pass'">
        确定
      </el-button>
      <el-button @click="whitelistCheckDialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { nextTick, computed } from 'vue'
import { occurrenceTypeOptions } from '@/views/creditapplication/const/pendding'
import type { TableColumn } from '@/types/table'
import { ElMessageBox } from 'element-plus'
import { InfoFilled, Check, Close } from '@element-plus/icons-vue'
import { ydwkhbmdApi } from '@/api/creditapplication/ydwkhbmd'
// @ts-ignore
import Dialog from '@/components/Dialog/src/Dialog.vue'

defineOptions({ name: 'Ydwkhbmd' })

const message = useMessage()
const router = useRouter()

// 查询参数
// 根据后端API字段调整查询参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  flowStatus:0,
  serialNo: undefined, // 申请流水号
  customerId: undefined, // 客户编号
  enterpriseName: undefined, // 企业名称
  occurType: undefined // 发生类型
})

const queryFormRef = ref()
const selectedRows = ref<any[]>([])

// 计算属性：用于按钮禁用状态，确保响应式更新
const hasSelectedRows = computed(() => selectedRows.value && selectedRows.value.length > 0)

// 尽职调查报告相关
const dueDiligenceDialogVisible = ref(false)
const dueDiligenceLoading = ref(false)
const dueDiligenceList = ref<any[]>([])

// 签署意见相关
const commentDialogVisible = ref(false)
const commentSaving = ref(false)
const commentFormRef = ref()
const commentFormData = reactive({
  comment: '',
  registrationInstitution: '',
  registrant: '',
  registrationDate: ''
})

// 签署意见表单验证规则
const commentFormRules = {
  comment: [
    { required: true, message: '请输入意见', trigger: 'blur' },
    { max: 1000, message: '意见不能超过1000个汉字', trigger: 'blur' }
  ]
}

// 查看意见相关
const viewCommentDialogVisible = ref(false)
const viewCommentData = reactive({
  name: '',
  handler: '',
  handlerOrg: '',
  approvalChannel: '',
  time: '',
  completionTime: '',
  comment: ''
})

// 企业白名单校验相关
const whitelistCheckDialogVisible = ref(false)
const recheckLoading = ref(false)
const whitelistCheckResult = reactive({
  status: 'fail', // 'pass' | 'fail'
  finalMessage: '1.企业白名单',
  checkList: [
    {
      taskName: '企业白名单校验-合作方客户项目授信校验',
      result: 'fail',
      messages: [
        '1.该客户不是供应链合作成员!',
        '2.该客户对应的合作方客户项目没有有效的授信额度!'
      ]
    },
    {
      taskName: '企业白名单校验-企业客户开户校验',
      result: 'fail',
      messages: [
        '核心系统该客户已开户,无需添加白名单!'
      ]
    },
    {
      taskName: '企业白名单校验-黑名单系统检查校验',
      result: 'pass',
      messages: ['通过']
    }
  ]
})

// 表格列配置
// 根据后端API字段映射：
// serialNo: 申请流水号
// customerId: 客户编号
// enterpriseName: 企业名称
// occurType: 发生类型
// flowStatus: 企业白名单状态
// licenseNo: 营业执照号码
// cooPersonName: 法人代表姓名
// basicBankName: 企业基本账户开户银行
const tableColumns: TableColumn[] = [
  { label: '申请流水号', field: 'serialNo', minWidth: 180, fixed: 'left' as const },
  { label: '客户编号', field: 'customerId', minWidth: 220 },
  { label: '企业名称', field: 'enterpriseName', minWidth: 200 },
  { label: '营业执照号码', field: 'licenseNo', minWidth: 180 },
  { label: '法人代表姓名', field: 'cooPersonName', minWidth: 150 },
  { label: '法人代表联系方式', field: 'cooPhoneId', minWidth: 150 },
  { label: '企业基本账户开户银行', field: 'basicBankName', minWidth: 200 },
  { label: '发生类型', field: 'occurType', minWidth: 120 },
  { label: '企业白名单状态', field: 'flowStatus', minWidth: 150 },
  { label: '操作', field: 'action', width: 380, fixed: 'right' as const }
]

// 使用 useTable hook
const { tableObject, tableMethods } = useTable({
  getListApi: async (params: any) => {
    try {
      // 调用接口获取列表数据
      const res = await ydwkhbmdApi.getList(params)
      
      
      
      // 根据接口返回的数据结构处理
      // 如果接口返回的是 { list: [], total: 0 } 格式，直接返回
      // 如果是 { data: { list: [], total: 0 } } 格式，需要提取 data
      if (res ) {
        return {
          list: res.list || res.data.records || [],
          total: res.total || 0
        }
      }
      
      // 如果直接返回数组，包装成标准格式
      // if (Array.isArray(res)) {
      //   return {
      //     list: res,
      //     total: res.length
      //   }
      // }
      
      // 默认返回空数据
      // return {
      //   list: [],
      //   total: 0
      // }
    } catch (error) {
      console.error('获取列表失败：', error)
      message.error('获取列表失败')
      return {
        list: [],
        total: 0
      }
    }
  },
  defaultParams: { ...queryParams }
})

const { getList, setSearchParams } = tableMethods

// 表格选择变化
const handleSelectionChange = (val) => {
  // 使用 nextTick 确保响应式更新
  nextTick(() => {
    val ? selectedRows.value = [val] : selectedRows.value = []
  })
}

/** 搜索按钮操作 */
const handleQuery = () => {
  setSearchParams(queryParams)
  getList()
}

/** 取消按钮操作 */
const handleCancel = () => {
  handleQuery()
}

/** 清空按钮操作 */
const handleClear = () => {
  Object.assign(queryParams, {
    pageNo: 1,
    pageSize: 10,
    serialNo: undefined,
    customerId: undefined,
    enterpriseName: undefined,
    occurType: undefined
  })
  handleQuery()
}

/** 签署意见操作（通过行） */
const handleViewCommentsByRow = async (row: any) => {
  if (!row) {
    message.warning('参数错误')
    return
  }
  
  // 打开签署意见对话框
  commentDialogVisible.value = true
  
  // 加载意见数据
  await loadCommentData(row.serialNo)
}

/** 查看意见详情操作（通过行） */
const handleViewCommentDetailByRow = async (row: any) => {
  if (!row) {
    message.warning('参数错误')
    return
  }
  
  // 打开查看意见对话框
  viewCommentDialogVisible.value = true
  
  // 加载意见详情数据
  await loadViewCommentData(row.id)
}

/** 取消申请操作（通过行） */
const handleCancelApplicationByRow = async (row: any) => {
  if (!row) {
    message.warning('参数错误')
    return
  }

  try {
    // 确认对话框
    const confirmText = `确定要取消申请流水号为"${row.serialNo || row.serialNumber}"的记录吗？`
    
    await ElMessageBox.confirm(confirmText, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 调用取消接口
    await ydwkhbmdApi.cancel(row.serialNo )
    
    message.success('取消成功')
    
    // 刷新列表
    await getList()
  } catch (error: any) {
    // 用户取消操作时不处理
    if (error !== 'cancel') {
      console.error('取消申请失败：', error)
      message.error('取消申请失败，请重试')
    }
  }
}

/** 新增申请操作 */
const handleCreate = async () => {
  // 跳转到新增页面
  await router.push({
    path: '/customeLevel/ydwkhbmd/detail/create',
    query: {
      title: '企业信息-新增'
    }
  })
}

/** 申请详情操作（通过行点击） */
const handleApplicationDetailByRow = async (row: any) => {
  if (!row) {
    message.warning('参数错误')
    return
  }


//   const openDetail = (id: number) => {
//   push({ name: 'CrmAuditWorkDetail', query: { id } })
// }


  // 跳转到详情页面
  await router.push({
    path: `/customeLevel/ydwkhbmd/detail/${row.serialNo}`,
    query: {
      serialNo: row.serialNo // 传递申请流水号，用于设置标题
    }
  })
}

// 加载意见数据
const loadCommentData = async (_applicationId: number) => {
  try {
    // TODO: 调用实际接口获取意见数据
    // const data = await YdwkhbmdApi.getComment(applicationId)
    // commentFormData.comment = data.comment || ''
    // commentFormData.registrationInstitution = data.registrationInstitution || ''
    // commentFormData.registrant = data.registrant || ''
    // commentFormData.registrationDate = data.registrationDate || ''
    
    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 200))
    commentFormData.comment = ''
    commentFormData.registrationInstitution = '总营公司业务二部'
    commentFormData.registrant = '项猫传'
    commentFormData.registrationDate = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '/')
  } catch (error) {
    console.error('加载意见数据失败：', error)
    message.error('加载意见数据失败')
  }
}

// 保存意见
const handleSaveComment = async () => {
  try {
    // 表单验证
    await commentFormRef.value?.validate()
    
    // if (!selectedRows.value.length) {
    //   message.warning('请选择一条记录')
    //   return
    // }
    
    commentSaving.value = true
    
    // TODO: 调用实际接口保存意见
    // await YdwkhbmdApi.saveComment({
    //   applicationId: selectedRows.value[0].id,
    //   comment: commentFormData.comment
    // })
    
    // 模拟接口调用
    // await new Promise(resolve => setTimeout(resolve, 500))
    
    message.success('保存成功')
    
    // 关闭对话框
    commentDialogVisible.value = false
  } catch (error: any) {
    if (error !== false) {
      console.error('保存意见失败：', error)
      message.error('保存意见失败，请检查输入')
    }
  } finally {
    commentSaving.value = false
  }
}

// 删除意见
const handleDeleteComment = async () => {
  if (!commentFormData.comment) {
    message.warning('当前没有意见可删除')
    return
  }
  
  try {
    await ElMessageBox.confirm('确定要删除当前意见吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    if (!selectedRows.value.length) {
      message.warning('请选择一条记录')
      return
    }
    
    // TODO: 调用实际接口删除意见
    // await YdwkhbmdApi.deleteComment(selectedRows.value[0].id)
    
    // 模拟接口调用
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 清空意见内容
    commentFormData.comment = ''
    
    message.success('删除成功')
  } catch (error: any) {
    // 用户取消操作时不处理
    if (error !== 'cancel') {
      console.error('删除意见失败：', error)
      message.error('删除意见失败，请重试')
    }
  }
}

/** 查看尽职调查报告 */
const handleViewDueDiligence = async () => {
  if (selectedRows.value.length !== 1) {
    message.warning('请选择一条记录')
    return
  }
  const row = selectedRows.value[0]
  
  dueDiligenceDialogVisible.value = true
  
  // 加载尽职调查报告数据
  await getDueDiligenceList(row.id)
}

/** 获取尽职调查报告列表 */
const getDueDiligenceList = async (_applicationId: number) => {
  try {
    dueDiligenceLoading.value = true
    
    // TODO: 调用实际接口
    // const data = await YdwkhbmdApi.getDueDiligenceReports(applicationId)
    // dueDiligenceList.value = data
    
    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 300))
    dueDiligenceList.value = [
      {
        id: 1,
        reportNo: 'DD202401001',
        reportName: '客户信用调查报告',
        reportType: '信用调查',
        investigator: '张三',
        investigateDate: '2024-01-15',
        status: '已完成',
        summary: '客户信用状况良好，无不良记录，经营稳定，具备还款能力。'
      },
      {
        id: 2,
        reportNo: 'DD202401002',
        reportName: '企业经营状况调查报告',
        reportType: '经营调查',
        investigator: '李四',
        investigateDate: '2024-01-16',
        status: '已完成',
        summary: '企业经营状况良好，财务状况健康，现金流充足，具备良好的还款能力。'
      }
    ]
  } catch (error) {
    console.error('获取尽职调查报告失败：', error)
    message.error('获取尽职调查报告失败')
  } finally {
    dueDiligenceLoading.value = false
  }
}

/** 查看报告详情 */
const handleViewReportDetail = (row: any) => {
  message.info(`查看报告详情功能待实现 - 报告编号: ${row.reportNo}`)
  // TODO: 实现查看报告详情功能
}

/** 查看流转记录 */
const handleViewFlowRecord = () => {
  if (selectedRows.value.length !== 1) {
    message.warning('请选择一条记录')
    return
  }
  const row = selectedRows.value[0]
  message.info(`查看流转记录功能待实现 - 申请编号: ${row.applicationNo}`)
  // TODO: 实现查看流转记录功能
}

// 加载查看意见数据
const loadViewCommentData = async (_applicationId: number) => {
  try {
    // TODO: 调用实际接口获取意见详情
    // const data = await YdwkhbmdApi.getCommentDetail(applicationId)
    // Object.assign(viewCommentData, data)
    
    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 200))
    Object.assign(viewCommentData, {
      name: '主办客户经理',
      handler: '项猫传',
      handlerOrg: '总营公司业务二部',
      approvalChannel: '信贷',
      time: '2025/11/20 10:56:35',
      completionTime: '',
      comment: '见】啊'
    })
  } catch (error) {
    console.error('加载意见详情失败：', error)
    message.error('加载意见详情失败')
  }
}

// 提交操作
const handleSubmit = async (row) => {
 

  // 打开企业白名单校验对话框
  // whitelistCheckDialogVisible.value = true
  
  // 执行校验
  await performWhitelistCheck(row)
}

// 执行企业白名单校验
const performWhitelistCheck = async (row) => {
  try {
    const confirmText =
       `确定要提交申请编号为"${row.serialNo}"的记录吗？`
    
    await ElMessageBox.confirm(confirmText, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    // TODO: 调用实际接口进行校验
    const data = await ydwkhbmdApi.submit(row)
    console.log('data',data)
    if(data) {
      message.success(`提交成功`)
    }
    
    // Object.assign(whitelistCheckResult, data)
    
    // 模拟校验结果
    // await new Promise(resolve => setTimeout(resolve, 500))
    
    // 保持当前的模拟数据，或者根据实际情况更新
    // 这里使用已有的模拟数据
  } catch (error) {
    console.error('企业白名单校验失败：', error)
    message.error('企业白名单校验失败')
  }
}

// 重新检查
const handleRecheck = async () => {
  try {
    recheckLoading.value = true
    
    // TODO: 调用实际接口重新检查
    // const data = await YdwkhbmdApi.recheckWhitelist(selectedRows.value[0].id)
    // Object.assign(whitelistCheckResult, data)
    
    // 模拟重新检查
    await new Promise(resolve => setTimeout(resolve, 500))
    
    message.success('重新检查完成')
  } catch (error) {
    console.error('重新检查失败：', error)
    message.error('重新检查失败')
  } finally {
    recheckLoading.value = false
  }
}

// 确认提交
const handleConfirmSubmit = async () => {
  if (whitelistCheckResult.status !== 'pass') {
    message.warning('校验未通过，无法提交')
    return
  }

  if (selectedRows.value.length === 0) {
    message.warning('请选择要提交的记录')
    return
  }

  try {
    // 调用提交接口，支持批量提交
    const ids = selectedRows.value.map(row => row.id)
    await ydwkhbmdApi.submit({ ids })
    
    message.success('提交成功')
    
    // 关闭对话框
    whitelistCheckDialogVisible.value = false
    
    // 清空选中状态
    selectedRows.value = []
    
    // 刷新列表
    await getList()
  } catch (error) {
    console.error('提交失败：', error)
    // message.error('提交失败，请重试')
  }
}

/** 收回操作 */
const handleRecall = async () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择要收回的记录')
    return
  }
  
  try {
    // 确认对话框
    const count = selectedRows.value.length
    const confirmText = count === 1 
      ? `确定要收回申请编号为"${selectedRows.value[0].applicationNo}"的记录吗？`
      : `确定要收回选中的 ${count} 条记录吗？`
    
    await ElMessageBox.confirm(confirmText, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 执行收回操作
    const ids = selectedRows.value.map(row => row.id)
    
    // TODO: 调用收回接口
    // await YdwkhbmdApi.recallApplications(ids)
    
    // 模拟接口调用
    console.log('收回申请ID:', ids)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    message.success(`成功收回 ${count} 条记录`)
    
    // 清空选中状态
    selectedRows.value = []
    
    // 刷新列表
    await getList()
  } catch (error: any) {
    // 用户取消操作时不处理
    if (error !== 'cancel') {
      console.error('收回失败：', error)
      message.error('收回失败，请重试')
    }
  }
}

/** 导出EXCEL */
const handleExport = () => {
  message.info('导出EXCEL功能待实现')
  // TODO: 实现导出EXCEL功能
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

