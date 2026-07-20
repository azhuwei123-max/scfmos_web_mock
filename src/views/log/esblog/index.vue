<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="120px"
    >
      <el-form-item label="服务编码" prop="serviceId">
        <el-input
          v-model="queryParams.serviceId"
          placeholder="请输入服务编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="业务流水号" prop="consumerSeqNo">
        <el-input
          v-model="queryParams.consumerSeqNo"
          placeholder="请输入业务流水号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <!-- <el-form-item label="原交易流水号" prop="orgConsumerSeqNo">
        <el-input
          v-model="queryParams.orgConsumerSeqNo"
          placeholder="请输入原交易流水号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item label="traceId" prop="orgConsumerSeqNo">
        <el-input
          v-model="queryParams.traceId"
          placeholder="请输入traceId"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <!-- <el-form-item label="请求参数" prop="reqParam">
        <el-input
          v-model="queryParams.reqParam"
          placeholder="请输入请求参数"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <!-- <el-form-item label="响应结果" prop="respResult">
        <el-input
          v-model="queryParams.respResult"
          placeholder="请输入响应结果"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <!-- <el-form-item label="响应结果" prop="returnCode">
        <el-input
          v-model="queryParams.returnCode"
          placeholder="请输入响应结果"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item label="执行信息" prop="returnMsg">
        <el-input
          v-model="queryParams.returnMsg"
          placeholder="请输入执行信息"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="请求时间" prop="reqTime">
        <el-date-picker
          v-model="queryParams.reqTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="响应时间" prop="respTime">
        <el-date-picker
          v-model="queryParams.respTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
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
      <el-form-item label="备用字段" prop="remark1">
        <el-input
          v-model="queryParams.remark1"
          placeholder="请输入备用字段"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
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
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <!-- <el-button
          tpye=""
          plain
          @click="openForm('create')"
          v-hasPermi="['log:esb-log:create']"
        >
          <Icon icon="ep:plus" class="mr-5px md-5px" /> 新增
        </el-button> -->
        <el-button
          type=""
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['log:esb-log:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="traceId" align="center" prop="traceId" />
      <el-table-column label="服务编码" align="center" prop="serviceId" />
      <el-table-column label="业务流水号" align="center" prop="consumerSeqNo" />
      <el-table-column label="响应结果" align="center" prop="returnCode" />
      <el-table-column label="执行信息" align="center" prop="returnMsg" />
      <el-table-column
        label="请求时间"
        align="center"
        prop="reqTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="响应时间"
        align="center"
        prop="respTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            tpye=""
            @click="openForm('view', scope.row.id)"
            v-hasPermi="['log:esb-log:update']"
          >
            查看
          </el-button>
          <!-- <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['log:esb-log:delete']"
          >
            删除
          </el-button> -->
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
  <EsbLogForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { EsbLogApi, EsbLogVO } from '@/api/log/esblog'
import EsbLogForm from './EsbLogForm.vue'

/** esb日志 列表 */
defineOptions({ name: 'EsbLog' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<EsbLogVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  serviceId: undefined,
  consumerSeqNo: undefined,
  orgConsumerSeqNo: undefined,
  reqParam: undefined,
  respResult: undefined,
  returnCode: undefined,
  returnMsg: undefined,
  reqTime: [],
  respTime: [],
  remark: undefined,
  remark1: undefined,
  createTime: [],
  traceId:undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await EsbLogApi.getEsbLogPage(queryParams)
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
    await EsbLogApi.deleteEsbLog(id)
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
    const data = await EsbLogApi.exportEsbLog(queryParams)
    download.excel(data, 'esb日志.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
