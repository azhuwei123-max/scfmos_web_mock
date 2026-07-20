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
        <el-form-item label="客户名称" prop="customerName">
          <div class="flex items-center gap-5px">
            <el-input
              v-model="queryParams.customerName"
              placeholder="请输入客户名称"
              clearable
              class="!w-200px"
            />
          </div>
        </el-form-item>
        <el-form-item label="证件号" prop="idNumber">
          <div class="flex items-center gap-5px">
            <el-input
              v-model="queryParams.certId"
              placeholder="请输入证件号"
              clearable
              class="!w-200px"
            />
          </div>
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
    <div class="mb-15px flex flex-wrap gap-10px">
      <el-button tpye="" @click="handleCreate">
        <Icon icon="ep:plus" class="mr-5px" />
        新增
      </el-button>
      <el-button @click="handleDetail" :disabled="!hasSingleSelectedRow">
        详情
      </el-button>
      <el-button @click="handleAddSupplyChainMember" :disabled="!hasSelectedRows">
        加入供应链群成员
      </el-button>
      <!--<el-button @click="handlePermissionApplication" :disabled="!hasSelectedRows">
        权限申请
      </el-button> -->
      <!-- <el-button @click="handleCustomerTypeConversion" :disabled="!hasSelectedRows">
        客户类型转换
      </el-button> -->
      <!--<el-button @click="handleGetCustomerOwnership" :disabled="!hasSelectedRows">
        获取客户主办权
      </el-button> -->
      <!-- <el-button @click="handleTransferOwnership" :disabled="!hasSelectedRows">
        移交主办权
      </el-button>
      <el-button @click="handleReceiveOwnership" :disabled="!hasSelectedRows">
        接收主办权
      </el-button> -->
      <el-button @click="handleDesensitizedExport" :disabled="!hasSelectedRows">
        脱敏导出
      </el-button>
      <el-button @click="handleSyncCreditLimit" :disabled="!hasSelectedRows">
        同步额度系统
      </el-button>
      <el-button type="" @click="handleDelete" :disabled="!hasSelectedRows">
        删除
      </el-button>
      <!-- <el-button @click="handleBusinessPreApproval" :disabled="!hasSelectedRows">
        业务预审
      </el-button> -->
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
      @row-dblclick="handleRowDetail"
    />
  </ContentWrap>

  <select-team-work-pop ref="selectTeamWorkPopRef" />
  <reqPermission ref="reqPermissionRef" @success="handleQuery" />

  <OcrRecognitionDialog
    v-model="ocrDialogVisible"
    title="新增"
    :initial-data="{CustomerType:'0320'}"
    @confirm='handleOcrConfirm'
    @cancel='handleOcrCancel'
  />
</template>

<script lang="ts" setup>
import { nextTick, computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  defaultQueryParams,
  tableColumns,
  getMockListData
} from './const/index'
import { personalApi } from '@/api/customerInfoMGM/sxrs'
import selectTeamWorkPop from '@/views/customerInfoMGM/companyCustomerMGM/customerMGM/components/selectTeamWorkPop.vue'
import reqPermission from '@/views/customerInfoMGM/companyCustomerMGM/customerMGM/components/reqPermission.vue'

defineOptions({ name: 'salaryEarner' })

const message = useMessage()
const router = useRouter()

// 查询参数
const queryParams = reactive({ ...defaultQueryParams })

const queryFormRef = ref()
const selectedRows = ref<any[]>([])

// 计算属性：用于按钮禁用状态
const hasSelectedRows = computed(() => selectedRows.value && selectedRows.value.length > 0)
const hasSingleSelectedRow = computed(() => selectedRows.value && selectedRows.value.length === 1)


const ocrDialogData = ref({})

// 使用 useTable hook
const { tableObject, tableMethods } = useTable({
  getListApi: async (params: any) => {
    try {
      // TODO: 调用实际接口获取列表数据
      
       const res = await personalApi.getList(params)
       console.log('ressdsad',res);
       if (res ) {
        return {
          list: res.list || res.data.records || [],
          total: res.total || 0
        }
      }
      // return {
      //   list: res.data.list || res.data.records || [],
      //   total: res.data.total || 0
      // }
      
      // 使用 mock 数据
      // return await getMockListData(params)
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
  Object.assign(queryParams, { ...defaultQueryParams })
  handleQuery()
}


const ocrDialogVisible = ref(false)

const loading = ref(false)


/** 新增 */
const handleCreate = () => {
  // message.info('新增功能待实现')

  ocrDialogVisible.value =true
}

 const handleOcrConfirm = async(params) => {
   console.log(params);
   const data = {
    CustomerType:'0310',
    CertType:params.CertType,
    CertID:params.CertID,
    CertID1:params.CertID1,
    CountryCode:params.CountryCode,
    CustomerName:params.CustomerName,
    MaturityDate:params.MaturityDate
   }

   loading.value = true
  
   try {
     
   const res =  await personalApi.addCustomer(data)

   if(res) {
    var info = res.data
    loading.value = false
    ocrDialogVisible.value =false
     getList()
     message.success(info?.returnMsg || '新增成功')
   }

   } catch (error: any) {
     loading.value = false
     ocrDialogVisible.value =false
   }

    
 }


const handleOcrCancel = () => {

}

/** 详情 */
const handleDetail = () => {
  if (selectedRows.value.length !== 1) {
    message.warning('请选择一条记录')
    return
  }
  handleRowDetail(selectedRows.value[0])
}

/** 行详情 */
const handleRowDetail = (row: any) => {
  // 跳转到详情页面
  router.push({
    path:`/customerInfoMGM/personal/detail/${row.mfCustomerID}`,
    query: {
      customerName: row.customerName,
      customerId:row.customerId,
      customerType: row.customerType,
    }
  })
}

/** 加入供应链群成员 */
const selectTeamWorkPopRef = ref()
const handleAddSupplyChainMember = () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择要操作的记录')
    return
  }
  selectTeamWorkPopRef.value.open({ ...selectedRows.value[0], customerID: selectedRows.value[0].customerId })
}

/** 权限申请 */
const reqPermissionRef = ref()
const handlePermissionApplication = () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择要操作的记录')
    return
  }

  const checkResult = reqPermissionRef.value.openCheck(selectedRows.value[0])
  if (!checkResult) return

  reqPermissionRef.value.open(selectedRows.value[0])
}

/** 客户类型转换 */
const handleCustomerTypeConversion = () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择要操作的记录')
    return
  }
  message.info('客户类型转换功能待实现')
}

/** 获取客户主办权 */
const handleGetCustomerOwnership = async () => {
  console.log(selectedRows.value[0])
  if (selectedRows.value.length === 0) {
    message.warning('请选择要操作的记录')
    return
  }
  try {
    var params ={};
    console.log(selectedRows.value[0])
    params.customerId = selectedRows.value[0].customerId;
   
       const res = await personalApi.getCustomerRight(params)
       console.log('ressdsad',res);
       if (res ) {
        return {
          list: res.list || res.data.records || [],
          total: res.total || 0
        }
      }
    } catch (error: any) {
         console.log('新增失败');
         loading.value = false
         message.error(error?.msg || '新增失败')
       }
   }


/** 移交主办权 */
const handleTransferOwnership = () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择要操作的记录')
    return
  }
  message.info('移交主办权功能待实现')
}

/** 接收主办权 */
const handleReceiveOwnership = () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择要操作的记录')
    return
  }
  message.info('接收主办权功能待实现')
}

/** 脱敏导出 */
const handleDesensitizedExport = () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择要导出的记录')
    return
  }
  message.info('脱敏导出功能待实现')
}

/** 同步额度系统 */
const handleSyncCreditLimit = () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择要操作的记录')
    return
  }
  message.info('同步额度系统功能待实现')
}

/** 删除 */
const handleDelete = async () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择要删除的记录')
    return
  }
  
  try {
    const count = selectedRows.value.length
    const confirmText = count === 1 
      ? `确定要删除客户"${selectedRows.value[0].customerName}"吗？`
      : `确定要删除选中的 ${count} 条记录吗？`
    
    await ElMessageBox.confirm(confirmText, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // TODO: 调用删除接口
    await personalApi.deleteBelongAttribute1({ customerId: selectedRows.value[0].customerID})
    
    message.success(`成功删除 ${count} 条记录`)
    
    // 清空选中状态
    selectedRows.value = []
    
    // 刷新列表
    await getList()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败：', error)
      message.error('删除失败，请重试')
    }
  }
}

/** 业务预审 */
const handleBusinessPreApproval = () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择要操作的记录')
    return
  }
  message.info('业务预审功能待实现')
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
// 查询条件中的下拉和输入框布局
.flex.items-center.gap-5px {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>

