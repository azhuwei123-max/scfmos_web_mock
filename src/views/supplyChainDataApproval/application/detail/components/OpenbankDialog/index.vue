<template>
  <Dialog v-model="visible" title="请选择" width="1200px">
    <ContentWrap>
      <Search
        :schema="allSchemas.searchSchema"
        :model="tableObject.params"
        @search="setSearchParams"
        @reset="setSearchParams"
      />
      <Table
        :columns="allSchemas.tableColumns"
        :data="tableObject.tableList"
        :loading="tableObject.loading"
        :pagination="{
          total: tableObject.total
        }"
        highlight-current-row
        :onRowClick="handleSelectionChange"
        v-model:pageSize="tableObject.pageSize"
        v-model:currentPage="tableObject.currentPage"
        @register="register"
        @dblclick="confirm"
      />
    </ContentWrap>
     <template #footer>
      <el-button type="primary" @click="confirm">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="tsx">
import { CrudSchema } from '@/hooks/web/useCrudSchemas'
import { getBankList   } from '../../../api'

const visible = ref(false)

const emit = defineEmits(['confirm'])

const currentRow = ref<Recordable | null>(null)

const open = () => {
  currentRow.value = null
  visible.value = true
  getList()
}

const confirm = () => {
  if (!currentRow.value) return ElMessage.warning('请选择')

  visible.value = false
  emit('confirm', currentRow.value)
}

defineExpose({
  open
})

// ====== 列表 ======
const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '行号',
    field: 'bankNo',
    isSearch: true,
  },
  {
    label: '行名',
    field: 'bankName',
    isSearch: true,
  },
  {
    label: '状态',
    field: 'status',
    isSearch: false,
  },
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const { register, tableObject, tableMethods } = useTable({
  getListApi: getBankList,
})

const { setSearchParams, getList } = tableMethods

const handleSelectionChange = (row) => {
  tableObject.currentRow = row
  currentRow.value = row
}
</script>
