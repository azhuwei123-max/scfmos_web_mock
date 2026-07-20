<template>
  <div class="codegen-column-table">
    <el-scrollbar :height="tableHeight + 'px'" @scroll="onScroll">
      <div class="virtual-spacer" :style="{ height: totalHeight + 'px' }">
        <div class="virtual-body" :style="{ transform: `translateY(${topOffset}px)` }">
          <el-table
            ref="dragTable"
            :data="visibleColumns"
            row-key="columnId"
            :header-cell-style="{ background: '#F7F8FA' }"
            style="margin-bottom: 20px"
          >
    <el-table-column
      :show-overflow-tooltip="true"
      label="字段列名"
      min-width="10%"
      prop="columnName"
    />
    <el-table-column label="字段描述" min-width="10%">
      <template #default="scope">
        <el-input v-model="scope.row.columnComment" />
      </template>
    </el-table-column>
    <el-table-column
      :show-overflow-tooltip="true"
      label="物理类型"
      min-width="10%"
      prop="dataType"
    />
    <el-table-column label="Java类型" min-width="11%">
      <template #default="scope">
        <el-select v-model="scope.row.javaType">
          <el-option label="Long" value="Long" />
          <el-option label="String" value="String" />
          <el-option label="Integer" value="Integer" />
          <el-option label="Double" value="Double" />
          <el-option label="BigDecimal" value="BigDecimal" />
          <el-option label="LocalDateTime" value="LocalDateTime" />
          <el-option label="Boolean" value="Boolean" />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="java属性" min-width="10%">
      <template #default="scope">
        <el-input v-model="scope.row.javaField" />
      </template>
    </el-table-column>
    <el-table-column label="插入" min-width="4%">
      <template #default="scope">
        <el-checkbox v-model="scope.row.createOperation" false-label="false" true-label="true" />
      </template>
    </el-table-column>
    <el-table-column label="编辑" min-width="4%">
      <template #default="scope">
        <el-checkbox v-model="scope.row.updateOperation" false-label="false" true-label="true" />
      </template>
    </el-table-column>
    <el-table-column label="列表" min-width="4%">
      <template #default="scope">
        <el-checkbox
          v-model="scope.row.listOperationResult"
          false-label="false"
          true-label="true"
        />
      </template>
    </el-table-column>
    <el-table-column label="查询" min-width="4%">
      <template #default="scope">
        <el-checkbox v-model="scope.row.listOperation" false-label="false" true-label="true" />
      </template>
    </el-table-column>
    <el-table-column label="查询方式" min-width="10%">
      <template #default="scope">
        <el-select v-model="scope.row.listOperationCondition">
          <el-option label="=" value="=" />
          <el-option label="!=" value="!=" />
          <el-option label=">" value=">" />
          <el-option label=">=" value=">=" />
          <el-option label="<" value="<>" />
          <el-option label="<=" value="<=" />
          <el-option label="LIKE" value="LIKE" />
          <el-option label="BETWEEN" value="BETWEEN" />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="允许空" min-width="5%">
      <template #default="scope">
        <el-checkbox v-model="scope.row.nullable" false-label="false" true-label="true" />
      </template>
    </el-table-column>
    <el-table-column label="显示类型" min-width="12%">
      <template #default="scope">
        <el-select v-model="scope.row.htmlType">
          <el-option label="文本框" value="input" />
          <el-option label="文本域" value="textarea" />
          <el-option label="下拉框" value="select" />
          <el-option label="单选框" value="radio" />
          <el-option label="复选框" value="checkbox" />
          <el-option label="日期控件" value="datetime" />
          <el-option label="图片上传" value="imageUpload" />
          <el-option label="文件上传" value="fileUpload" />
          <el-option label="富文本控件" value="editor" />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="字典类型" min-width="12%">
      <template #default="scope">
        <el-select v-model="scope.row.dictType" clearable filterable placeholder="请选择">
          <el-option
            v-for="dict in dictOptions"
            :key="dict.id"
            :label="dict.name"
            :value="dict.type"
          />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="示例" min-width="10%">
      <template #default="scope">
        <el-input v-model="scope.row.example" />
      </template>
    </el-table-column>
          </el-table>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, PropType, watch } from 'vue'
import { ElTable } from 'element-plus'
import * as CodegenApi from '@/api/infra/codegen'
import * as DictDataApi from '@/api/system/dict/dict.type'

defineOptions({ name: 'InfraCodegenColumInfoForm' })

const props = defineProps({
  columns: {
    type: Array as unknown as PropType<CodegenApi.CodegenColumnVO[]>,
    default: () => null
  }
})

const formData = ref<CodegenApi.CodegenColumnVO[]>([])
const dragTable = ref<ComponentRef<typeof ElTable>>()
const DEFAULT_ROW_HEIGHT = 56
const BUFFER_ROWS = 6
const tableHeight = ref(Math.max(360, document.documentElement.clientHeight - 350))
const rowHeight = ref(DEFAULT_ROW_HEIGHT)
const startIndex = ref(0)
const topOffset = ref(0)
const visibleColumns = ref<CodegenApi.CodegenColumnVO[]>([])

/** 查询字典下拉列表 */
const dictOptions = ref<DictDataApi.DictTypeVO[]>()
const getDictOptions = async () => {
  dictOptions.value = await DictDataApi.getSimpleDictTypeList()
}

const updateVisibleColumns = () => {
  const total = formData.value.length
  if (!total) {
    visibleColumns.value = []
    topOffset.value = 0
    return
  }
  const visibleCount = Math.ceil(tableHeight.value / rowHeight.value) + BUFFER_ROWS
  const safeStart = Math.max(Math.min(startIndex.value, Math.max(total - visibleCount, 0)), 0)
  const endIndex = Math.min(safeStart + visibleCount, total)
  visibleColumns.value = formData.value.slice(safeStart, endIndex)
  topOffset.value = safeStart * rowHeight.value
  startIndex.value = safeStart
}

const measureRowHeight = () => {
  if (!dragTable.value) return
  const rowEl = (dragTable.value.$el as HTMLElement)?.querySelector('.el-table__row') as HTMLElement
  if (rowEl && rowEl.offsetHeight) {
    rowHeight.value = rowEl.offsetHeight
    updateVisibleColumns()
  }
}

const handleResize = () => {
  tableHeight.value = Math.max(360, document.documentElement.clientHeight - 350)
  updateVisibleColumns()
}

const onScroll = ({ scrollTop }: { scrollTop: number }) => {
  if (!rowHeight.value) return
  const newStart = Math.floor(scrollTop / rowHeight.value)
  if (newStart === startIndex.value) return
  startIndex.value = newStart
  updateVisibleColumns()
}

const totalHeight = computed(() => formData.value.length * rowHeight.value)

watch(
  () => props.columns,
  (columns) => {
    if (!columns) return
    formData.value = columns
    startIndex.value = 0
    updateVisibleColumns()
    nextTick(measureRowHeight)
  },
  {
    deep: true,
    immediate: true
  }
)

onMounted(async () => {
  await getDictOptions()
  nextTick(() => {
    measureRowHeight()
    window.addEventListener('resize', handleResize)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.codegen-column-table {
  width: 100%;
}

.virtual-spacer {
  position: relative;
  width: 100%;
}

.virtual-body {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}
</style>
