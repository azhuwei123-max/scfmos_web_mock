<template>
  <div class="dynamic-detail-api-select">
    <!-- 输入框 + 选择按钮 -->
    <el-input
      :model-value="displayValue"
      :placeholder="placeholder"
      :clearable="clearable"
      :disabled="disabled"
      :readonly="true"
      class="api-select-input"
    >
      <template #append>
        <el-button :disabled="disabled" @click="handleOpenDialog">
          <Icon icon="ep:search" />
        </el-button>
      </template>
    </el-input>

    <!-- 弹框选择器 -->
    <Dialog
      v-model="dialogVisible"
      :title="apiConfig?.dialogTitle || '请选择'"
      :width="apiConfig?.dialogWidth || '60%'"
      :append-to-body="true"
    >
      <!-- 搜索条件 -->
      <el-form
        v-if="apiConfig?.searchFields && apiConfig.searchFields.length > 0"
        ref="queryFormRef"
        :inline="true"
        :model="queryParams"
        class="mb-20px"
      >
        <el-form-item
          v-for="field in apiConfig.searchFields"
          :key="field.name"
          :label="field.label"
          :prop="field.name"
        >
          <el-input
            v-if="field.type === 'text'"
            v-model="queryParams[field.name]"
            :placeholder="field.placeholder || `请输入${field.label}`"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
          />
          <el-select
            v-else-if="field.type === 'select'"
            v-model="queryParams[field.name]"
            :placeholder="field.placeholder || `请选择${field.label}`"
            clearable
            style="width: 240px"
          >
            <el-option
              v-for="option in field.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
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

      <!-- 表格选择器 -->
      <el-table
        v-if="apiConfig?.selectorType === 'table'"
        v-loading="loading"
        :data="tableList"
        :highlight-current-row="!multiple"
        @row-click="handleTableRowClick"
        @selection-change="handleTableSelectionChange"
      >
        <el-table-column v-if="multiple" type="selection" width="55" />
        <el-table-column
          v-for="column in apiConfig?.tableColumns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :min-width="column.minWidth || 120"
        />
      </el-table>

      <!-- 树形选择器 -->
      <el-tree
        v-else-if="apiConfig?.selectorType === 'tree'"
        v-loading="loading"
        :data="treeList"
        :props="treeProps"
        :check-strictly="apiConfig?.checkStrictly"
        :show-checkbox="multiple"
        node-key="id"
        highlight-current
        @node-click="handleTreeNodeClick"
        @check="handleTreeCheck"
      />

      <!-- 分页 -->
      <div v-if="apiConfig?.selectorType === 'table' && apiConfig?.pagination !== false" class="mt-20px">
        <Pagination
          v-model:limit="queryParams.pageSize"
          v-model:page="queryParams.pageNo"
          :total="total"
          @pagination="handlePagination"
        />
      </div>

      <template #footer>
        <el-button tpye="" :disabled="!hasSelection" @click="handleConfirm">
          确 定
        </el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, watch } from 'vue'
import Dialog from '@/components/Dialog/src/Dialog.vue'
import Pagination from '@/components/Pagination/index.vue'
import request from '@/config/axios'
import { Icon } from '@/components/Icon'

defineOptions({ name: 'DynamicDetailApiSelect' })

interface ApiConfig {
  /** API 地址 */
  url: string
  /** 请求方法 */
  method?: 'GET' | 'POST'
  /** 选择器类型：table（表格）、tree（树形） */
  selectorType?: 'table' | 'tree'
  /** 是否多选 */
  multiple?: boolean
  /** 弹框标题 */
  dialogTitle?: string
  /** 弹框宽度 */
  dialogWidth?: string
  /** 表格列配置（selectorType 为 table 时使用） */
  tableColumns?: Array<{ prop: string; label: string; minWidth?: number }>
  /** 搜索字段配置 */
  searchFields?: Array<{
    name: string
    label: string
    type: 'text' | 'select'
    placeholder?: string
    options?: Array<{ label: string; value: any }>
  }>
  /** 是否分页（默认 true） */
  pagination?: boolean
  /** 树形选择器配置（selectorType 为 tree 时使用） */
  treeProps?: {
    children?: string
    label?: string
    value?: string
  }
  /** 树形选择器是否严格模式（父子不关联） */
  checkStrictly?: boolean
  /** 响应数据解析配置 */
  responseParser?: {
    /** 列表数据路径，如 'data.list' 或 'list' */
    listPath?: string
    /** 总数路径，如 'data.total' 或 'total' */
    totalPath?: string
    /** 自定义解析函数 */
    parseFunc?: (response: any) => { list: any[]; total?: number }
  }
  /** 显示字段（用于显示选中的值） */
  displayField?: string
  /** 值字段（用于提交的值） */
  valueField?: string
  /** 请求参数映射（将 formData 中的字段映射到请求参数） */
  paramMapping?: Record<string, string>
}

interface Props {
  modelValue?: any
  apiConfig?: ApiConfig
  placeholder?: string
  clearable?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择',
  clearable: true,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
}>()

const dialogVisible = ref(false)
const loading = ref(false)
const tableList = ref<any[]>([])
const treeList = ref<any[]>([])
const total = ref(0)
const selectedRows = ref<any[]>([])
const selectedNode = ref<any>(null)
const queryFormRef = ref()

const queryParams = reactive<Record<string, any>>({
  pageNo: 1,
  pageSize: 10
})

const multiple = computed(() => props.apiConfig?.multiple || false)

const hasSelection = computed(() => {
  if (multiple.value) {
    return selectedRows.value.length > 0
  } else {
    return selectedNode.value !== null || selectedRows.value.length > 0
  }
})

const displayValue = computed(() => {
  if (!props.modelValue) {
    return ''
  }
  if (multiple.value) {
    if (Array.isArray(props.modelValue)) {
      const displayField = props.apiConfig?.displayField || 'name'
      return props.modelValue.map((item) => item[displayField] || item).join(', ')
    }
    return ''
  } else {
    const displayField = props.apiConfig?.displayField || 'name'
    if (typeof props.modelValue === 'object') {
      return props.modelValue[displayField] || ''
    }
    return props.modelValue
  }
})

const treeProps = computed(() => {
  return props.apiConfig?.treeProps || {
    children: 'children',
    label: 'label',
    value: 'id'
  }
})

// 获取列表数据
const getList = async () => {
  if (!props.apiConfig?.url) {
    console.warn('ApiSelect: apiConfig.url 未配置')
    return
  }

  loading.value = true
  try {
    const params: Record<string, any> = { ...queryParams }
    
    // 处理参数映射
    if (props.apiConfig?.paramMapping) {
      Object.keys(props.apiConfig.paramMapping).forEach((key) => {
        // 这里可以从 formData 中获取值，暂时先不实现
      })
    }

    let response: any
    if (props.apiConfig.method === 'POST') {
      response = await request.post({ url: props.apiConfig.url, data: params })
    } else {
      response = await request.get({ url: props.apiConfig.url, params })
    }

    // 解析响应数据
    let list: any[] = []
    let totalCount = 0

    if (props.apiConfig.responseParser?.parseFunc) {
      const parsed = props.apiConfig.responseParser.parseFunc(response)
      list = parsed.list || []
      totalCount = parsed.total || 0
    } else {
      // 默认解析逻辑
      const listPath = props.apiConfig.responseParser?.listPath || 'data.list'
      const totalPath = props.apiConfig.responseParser?.totalPath || 'data.total'

      list = getNestedValue(response, listPath) || response.list || []
      totalCount = getNestedValue(response, totalPath) || response.total || 0
    }

    if (props.apiConfig.selectorType === 'tree') {
      treeList.value = list
    } else {
      tableList.value = list
      total.value = totalCount
    }
  } catch (error) {
    console.error('获取列表失败:', error)
    tableList.value = []
    treeList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 获取嵌套对象的值
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

// 打开弹框
const handleOpenDialog = () => {
  dialogVisible.value = true
  selectedRows.value = []
  selectedNode.value = null
  queryParams.pageNo = 1
  getList()
}

// 查询
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

// 重置
const handleReset = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}

// 分页变化
const handlePagination = (pagination: { page: number; limit: number }) => {
  queryParams.pageNo = pagination.page
  queryParams.pageSize = pagination.limit
  getList()
}

// 表格行点击（单选）
const handleTableRowClick = (row: any) => {
  if (!multiple.value) {
    selectedRows.value = [row]
    handleConfirm()
  }
}

// 表格选择变化（多选）
const handleTableSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

// 树节点点击（单选）
const handleTreeNodeClick = (data: any) => {
  if (!multiple.value) {
    selectedNode.value = data
    handleConfirm()
  }
}

// 树节点选择（多选）
const handleTreeCheck = (data: any, checked: any) => {
  // 多选逻辑
}

// 确认选择
const handleConfirm = () => {
  if (multiple.value) {
    const valueField = props.apiConfig?.valueField || 'id'
    const values = selectedRows.value.map((row) => row[valueField] || row)
    emit('update:modelValue', values)
  } else {
    const valueField = props.apiConfig?.valueField || 'id'
    const value = selectedNode.value?.[valueField] || selectedRows.value[0]?.[valueField] || selectedRows.value[0]
    emit('update:modelValue', value)
  }
  dialogVisible.value = false
}

// 监听弹框显示状态
watch(dialogVisible, (visible) => {
  if (visible) {
    getList()
  }
})
</script>

<style scoped lang="scss">
.dynamic-detail-api-select {
  .api-select-input {
    width: 100%;
  }
}
</style>

