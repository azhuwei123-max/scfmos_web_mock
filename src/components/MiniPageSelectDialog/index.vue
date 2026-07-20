<template>
  <Dialog v-model="dialogVisible" :title="title" :width="width" @close="handleClose">
    <!-- 搜索栏 -->
    <el-form
      v-if="searchFields.length > 0"
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      label-width="80px"
      class="-mb-10px"
    >
      <el-form-item
        v-for="field in searchFields"
        :key="field.prop"
        :label="field.label"
        :prop="field.prop"
      >
        <el-input
          v-model="queryParams[field.prop]"
          :class="field.width || '!w-200px'"
          clearable
          :placeholder="field.placeholder || `请输入${field.label}`"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      :height="tableHeight"
      :highlight-current-row="!multiple"
      :row-key="rowKey"
      @current-change="handleCurrentChange"
      @row-dblclick="handleRowDblClick"
      @selection-change="handleSelectionChange"
    >
      <!-- 多选列 -->
      <el-table-column
        v-if="multiple"
        type="selection"
        width="55"
        :reserve-selection="reserveSelection"
      />
      <el-table-column
        v-for="column in columnsData"
        :key="column.prop"
        :label="column.label"
        :prop="column.prop"
        :width="column.width"
        :min-width="column.minWidth"
        :show-overflow-tooltip="column.showOverflowTooltip"
        :formatter="column.formatter"
      />
    </el-table>

    <!-- 分页（默认开启） -->
    <div class="mini-pagination">
      <Pagination
        v-model:limit="pagination.pageSize"
        v-model:page="pagination.pageNo"
        :total="pagination.total"
        @pagination="handlePagination"
      />
    </div>

    <template #footer v-if="!hiddenFooter">
      <div class="flex justify-between items-center w-full">
        <span v-if="multiple" class="text-gray-500">已选择 {{ selectedRows.length }} 项</span>
        <span v-else></span>
        <div>
          <el-button
            type="primary"
            :disabled="multiple ? selectedRows.length === 0 : !currentRow"
            @click="handleConfirm"
          >
            确 定
          </el-button>
          <el-button @click="handleClose">取 消</el-button>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, nextTick } from 'vue'
import { ElTable } from 'element-plus'
import { COMPARISON_OPERATORS } from '../SimpleProcessDesignerV2/src/consts'

defineOptions({ name: 'MiniPagedSelectDialog' })

export interface MiniSelectSearchField {
  prop: string
  label: string
  placeholder?: string
  width?: string
  queryProp?: string
}

export interface MiniSelectColumn {
  prop: string
  label: string
  width?: number | string
  minWidth?: number | string
  showOverflowTooltip?: boolean
  formatter?: (row: any, column: any, cellValue: any, index: number) => string
}

type ApiResult = { list?: any[]; total?: number } | any

interface Props {
  modelValue: boolean
  title?: string
  width?: string
  tableHeight?: string | number
  columns: MiniSelectColumn[]
  searchFields?: MiniSelectSearchField[]
  /**
   * 可选：直接传入数据数组（优先级高于 apiMethod）
   * - 如果传入了 data，将直接使用这个数据，不会调用 apiMethod
   * - 会自动处理分页和搜索过滤
   */
  data?: any[]
  /**
   * 可选：传入真实接口方法（推荐）
   * - 入参会自动带上：pageNo/pageSize + searchFields 对应的查询参数 + extraParams
   * - 返回值支持：{ list, total }；也支持自定义，通过 dataTransform 适配
   * - 如果同时传入了 data，则优先使用 data
   */
  apiMethod?: (params: Record<string, any>) => Promise<ApiResult>
  /** 可选：将 apiMethod 返回值转换为 { list, total } */
  dataTransform?: (resp: ApiResult) => { list: any[]; total: number,columns?:MiniSelectColumn[] }
  /** 可选：固定透传参数 */
  extraParams?: Record<string, any>
  /** 可选：不传 apiMethod 时，mock 总数据量 */
  mockTotal?: number
  /** 是否启用多选 */
  multiple?: boolean
  /** 行的唯一标识，用于跨页选择 */
  rowKey?: string | ((row: any) => string)
  /** 是否在数据更新后保留之前选中的数据（需指定 row-key） */
  reserveSelection?: boolean
  hiddenFooter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '选择',
  width: '900px',
  tableHeight: 360,
  searchFields: () => [],
  data: () => [],
  extraParams: () => ({}),
  mockTotal: 50,
  multiple: false,
  rowKey: 'id',
  reserveSelection: false,
  dataTransform: (resp: any) => ({
    list: resp?.list || [],
    total: resp?.total || 0,
    columns:resp?.columns || undefined
  })
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'confirm', row: any | any[]): void // 单选返回对象，多选返回数组
  (e: 'cancel'): void
  (e: 'selectionChange', selection: any[]): void // 多选模式下选择变化时触发
}>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const queryFormRef = ref()
const tableRef = ref()
const queryParams = reactive<Record<string, any>>({})
const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0
})

const loading = ref(false)
const tableData = ref<any[]>([])
const currentRow = ref<any>(null)
const selectedRows = ref<any[]>([]) // 多选模式下选中的行
const columnsData = ref<MiniSelectColumn[]>(props.columns)

watch(
  () => props.searchFields,
  (fields) => {
    fields.forEach((f) => {
      if (!(f.prop in queryParams)) queryParams[f.prop] = undefined
    })
  },
  { immediate: true }
)

watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      // 打开时默认加载第一页
      pagination.pageNo = 1
      currentRow.value = null
      
      // 多选模式下不清空选中（如果启用 reserveSelection）
      if (!props.reserveSelection) {
        selectedRows.value = []
        nextTick(() => {
          if (tableRef.value) {
            tableRef.value.clearSelection()
          }
        })
      }
      loadData()
    } else {
      // 关闭时清空选中状态（如果未启用 reserveSelection）
      if (!props.reserveSelection) {
        selectedRows.value = []
        nextTick(() => {
          if (tableRef.value) {
            tableRef.value.clearSelection()
          }
        })
      }
    }
  }
)


watch(
  ()=> props.columns,
  (newColumns) => {
    columnsData.value = newColumns
  },
  {immediate:true}
)

// 监听 data 变化，如果直接传入数据，数据变化时重新加载
watch(
  () => props.data,
  () => {
    if (props.modelValue && props.data && props.data.length > 0) {
      loadData()
    }
  },
  { deep: true }
)

// const buildParams = () => ({
//   ...props.extraParams,
//   ...queryParams,
//   pageNo: pagination.pageNo,
//   pageSize: pagination.pageSize
// })



const buildParams = () => {
  const params:Record<string,any> = {
    ...props.extraParams,
    pageNo:pagination.pageNo,
    pageSize: pagination.pageSize
    
  }

  const selargslike = []
  
  // 处理查询参数：如果 searchFields 中定义了 queryProp 使用queryProp 作为查询参数名
  props.searchFields.forEach((field)=> {
    const value = queryParams[field.prop]
    
    
    if(value !== undefined && value !==null && String(value).trim() !=='') {
      const queryKey = field.queryProp || field.prop
      
      if(field.queryProp) {
        selargslike.push(`${queryKey},${value}`)
      }else {
        params[queryKey] = value
      }
    }
  })


  if(selargslike.length > 0) {
    params.selargslike = selargslike.join(',')
  }

  console.log('params',params);
  
  
  return params

}


const mockFetch = async (params: Record<string, any>) => {
  await new Promise((r) => setTimeout(r, 150))

  const total = props.mockTotal
  const pageNo = Number(params.pageNo || 1)
  const pageSize = Number(params.pageSize || 10)
  const start = (pageNo - 1) * pageSize
  const end = start + pageSize

  // 基于 columns 生成 mock 行
  const rows = Array.from({ length: total }).map((_, idx) => {
    const row: Record<string, any> = { id: idx + 1 }
    props.columns.forEach((c) => {
      if (c.prop === 'id') return
      row[c.prop] = `${c.label}${idx + 1}`
    })
    return row
  })

  // 简单模糊过滤（对 searchFields）
  let filtered = rows
  props.searchFields.forEach((f) => {
    const v = params[f.prop]
    if (v !== undefined && v !== null && String(v).trim() !== '') {
      const sv = String(v)
      filtered = filtered.filter((r) => String(r[f.prop] ?? '').includes(sv))
    }
  })

  pagination.total = filtered.length
  tableData.value = filtered.slice(start, end)
}

// 处理直接传入的数据（分页 + 搜索过滤）
const handleDirectData = (params: Record<string, any>) => {
  let filteredData = [...(props.data || [])]

  // 搜索过滤
  props.searchFields.forEach((f) => {
    const v = params[f.prop]
    if (v !== undefined && v !== null && String(v).trim() !== '') {
      const sv = String(v).toLowerCase()
      filteredData = filteredData.filter((r) => {
        const cellValue = r[f.prop]
        return (
          cellValue !== undefined &&
          cellValue !== null &&
          String(cellValue).toLowerCase().includes(sv)
        )
      })
    }
  })

  // 分页处理
  const pageNo = Number(params.pageNo || 1)
  const pageSize = Number(params.pageSize || 10)
  const start = (pageNo - 1) * pageSize
  const end = start + pageSize

  pagination.total = filteredData.length
  tableData.value = filteredData.slice(start, end)
}

const loadData = async () => {
  loading.value = true
  try {
    const params = buildParams()

    // 优先级：data > apiMethod > mock
    if (props.data && props.data.length > 0) {
      // 直接使用传入的数据
      handleDirectData(params)
    } else if (props.apiMethod) {
      // 调用接口获取数据
      const resp = await props.apiMethod(params)
  
      
      const { list, total ,columns} = props.dataTransform(resp)
      // console.log();
      if(columns && Array.isArray(columns) && columns.length >0) {
        columnsData.value = columns
      }
       

      tableData.value = list
      pagination.total = total
    } else {
      // 使用 mock 数据
      await mockFetch(params)
    }
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  pagination.pageNo = 1
  loadData()
}

const handleReset = () => {
  queryFormRef.value?.resetFields?.()
  Object.keys(queryParams).forEach((k) => (queryParams[k] = undefined))
  pagination.pageNo = 1
  currentRow.value = null
  loadData()
}

const handlePagination = () => {
  loadData()
}

const handleCurrentChange = (row: any) => {
  // 单选模式下才更新 currentRow
  if (!props.multiple) {
    currentRow.value = row || null
  }
}

const handleRowDblClick = (row: any) => {
  // 单选模式下双击直接确认
  if (!props.multiple) {
    currentRow.value = row
    handleConfirm()
  }
  // 多选模式下双击不做任何操作，需要手动点击复选框
}

/** 选择变化（多选模式下） */
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
  emit('selectionChange', selection)
}

const handleConfirm = () => {
  if (props.multiple) {
    // 多选模式：返回选中的行数组
    if (selectedRows.value.length === 0) return
    emit('confirm', selectedRows.value)
  } else {
    // 单选模式：返回选中的行对象
    if (!currentRow.value) return
    emit('confirm', currentRow.value)
  }
  emit('update:modelValue', false)
}

const handleClose = () => {
  currentRow.value = null
  queryFormRef.value?.resetFields?.()
  Object.keys(queryParams).forEach((k)=> (queryParams[k] = undefined))
  pagination.pageNo=1
  tableData.value = []
  emit('update:modelValue', false)
  emit('cancel')
}

defineExpose({
  /** 手动刷新 */
  reload: loadData,
  /** 获取当前选中（单选模式） */
  getSelectedRow: () => currentRow.value,
  /** 获取选中的行（多选模式） */
  getSelectedRows: () => selectedRows.value,
  /** 清空选择 */
  clearSelection: () => {
    if (tableRef.value) {
      tableRef.value.clearSelection()
    }
    selectedRows.value = []
    currentRow.value = null
  }
})
</script>

<style scoped lang="scss">
.mini-pagination {
  padding: 16px 0 0;
}
</style>
