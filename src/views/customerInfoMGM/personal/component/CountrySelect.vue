<template>
  <Dialog 
    :model-value="dialogVisible" 
    @update:model-value="handleDialogVisibleChange"
    title="选择国家" 
    :fullscreen="false"
    :append-to-body="true"
    width="900px"
  >
    <!-- 查询条件 -->
    <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="mb-20px search-form">
      <el-form-item label="国家名称" prop="countryName">
        <el-input
          v-model="queryParams.countryName"
          placeholder="请输入国家名称"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button tpye="" @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" />
          查询
        </el-button>
        <el-button @click="handleReset">
          <Icon icon="ep:refresh" class="mr-5px" />
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 国家列表表格 -->
    <el-table
      v-loading="loading"
      :data="tableList"
      highlight-current-row
      @row-click="handleRowClick"
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="countryName" label="国家名称" min-width="150" />
      <el-table-column prop="continent" label="所属洲" min-width="120" />
    </el-table>

    <!-- 分页 -->
    <div class="country-select-pagination">
      <Pagination
        v-model:limit="queryParams.pageSize"
        v-model:page="queryParams.pageNo"
        :total="total"
        @pagination="getList"
      />
    </div>

    <template #footer>
      <el-button tpye="" @click="handleConfirm">确 定</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
// @ts-ignore
import Dialog from '@/components/Dialog/src/Dialog.vue'
// @ts-ignore
import Pagination from '@/components/Pagination/index.vue'
import { nationalityOptions } from '../const/detail'
// TODO: 接口对接时取消注释
// import { CountryApi } from '@/api/customer/country'

defineOptions({ name: 'CountrySelect' })

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': [country: any]
}>()

const message = useMessage()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const loading = ref(false)
const tableList = ref<any[]>([])
const total = ref(0)
const selectedRow = ref<any>(null)
const queryFormRef = ref()
const queryParams = reactive({
  countryName: '',
  pageNo: 1,
  pageSize: 10
})

// 从级联数据中提取所有国家（扁平化）
const getAllCountries = () => {
  const countries: any[] = []
  nationalityOptions.forEach(continent => {
    if (continent.children) {
      continent.children.forEach((country: any) => {
        // 如果国家有子级（如中国有地区），则添加地区和直接添加国家
        if (country.children) {
          country.children.forEach((region: any) => {
            countries.push({
              countryName: region.label,
              countryValue: region.value,
              continent: continent.label,
              continentValue: continent.value,
              parentCountry: country.label
            })
          })
        } else {
          countries.push({
            countryName: country.label,
            countryValue: country.value,
            continent: continent.label,
            continentValue: continent.value
          })
        }
      })
    }
  })
  return countries
}

// 获取国家列表（带分页和查询）
const getList = async () => {
  loading.value = true
  try {
    // ========== 接口对接代码（待接口提供后取消注释） ==========
    // import { CountryApi } from '@/api/customer/country' // 在文件顶部取消注释
    // const res = await CountryApi.getCountryPage({
    //   countryName: queryParams.countryName || undefined,
    //   pageNo: queryParams.pageNo,
    //   pageSize: queryParams.pageSize
    // })
    // tableList.value = res.list || []
    // total.value = res.total || 0
    // return
    // ========== 接口对接代码结束 ==========

    // ========== 以下为 mock 数据逻辑，接口对接后可删除 ==========
    // 获取所有国家
    let allCountries = getAllCountries()
    
    // 根据查询条件过滤
    if (queryParams.countryName) {
      allCountries = allCountries.filter(item => 
        item.countryName.includes(queryParams.countryName)
      )
    }
    
    // 分页处理
    const pageNo = queryParams.pageNo || 1
    const pageSize = queryParams.pageSize || 10
    const start = (pageNo - 1) * pageSize
    const end = start + pageSize
    const paginatedList = allCountries.slice(start, end)
    
    tableList.value = paginatedList
    total.value = allCountries.length
    // ========== mock 数据逻辑结束 ==========
  } catch (error) {
    console.error('获取国家列表失败：', error)
    message.error('获取国家列表失败')
  } finally {
    loading.value = false
  }
}

// 查询国家
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

// 重置查询条件
const handleReset = () => {
  queryFormRef.value?.resetFields()
  queryParams.countryName = ''
  queryParams.pageNo = 1
  getList()
}

// 点击表格行
const handleRowClick = (row: any) => {
  selectedRow.value = row
}

// 确认选择国家
const handleConfirm = () => {
  if (!selectedRow.value) {
    message.warning('请选择一个国家')
    return
  }
  
  emit('confirm', selectedRow.value)
  dialogVisible.value = false
  selectedRow.value = null
}

// 取消
const handleCancel = () => {
  dialogVisible.value = false
  selectedRow.value = null
}

// 处理对话框显示状态变化
const handleDialogVisibleChange = (val: boolean) => {
  dialogVisible.value = val
  if (val) {
    // 打开对话框时重置状态并加载数据
    selectedRow.value = null
    queryParams.countryName = ''
    queryParams.pageNo = 1
    getList()
  }
}

// 监听 modelValue 变化
watch(() => props.modelValue, (val) => {
  if (val) {
    selectedRow.value = null
    queryParams.countryName = ''
    queryParams.pageNo = 1
    getList()
  }
})
</script>

<style scoped lang="scss">
// 国家选择对话框分页样式
.country-select-pagination {
  padding: 20px 0 30px 0;
  margin-bottom: 10px;
  
  :deep(.el-pagination) {
    justify-content: center;
  }
}
</style>

