<template>
  <Table
    :columns="columns"
    :data="tableListAttr1.list"
    :loading="tableListAttr1.loading"
    highlight-current-row
    :pagination="{
      total: tableListAttr1.total,
      hideOnSinglePage: hideOnSinglePage
    }"
    v-model:pageSize="tableListAttr1.queryParams.pageSize"
    v-model:currentPage="tableListAttr1.queryParams.pageNo"
    @current-change="tableCurrentChange"
    @page-change="tableListAttr1.getList"
    v-bind="$attrs"
    @row-dblclick="handleDblClick"
  >
    <template v-for="(_, name) in slots" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData || {}" ></slot>
    </template>
  </Table>
</template>

<script setup>
import useTableList from '@/compositions/useTableList'
import * as templateApi from '@/api/dynamicForm/index.js'
import { propTypes } from '@/utils/propTypes'

const emit = defineEmits(['dbl-click'])

const props = defineProps({
  apiFunc: {
    type: Function
  },

  // 请求入参
  params: Object,

  // 模板号
  tempNo: String,
  fetchCback: Function,

  // 字段显隐设置 { customername: false }
  customVisible: Object,
  tableListAttr: Object,

  // 模板字段Api
  templateApiFunc: Function,
  hideOnSinglePage: Boolean,
  selection: propTypes.bool.def(true)
})

const slots = useSlots()

const _tableListAttr = useTableList(props.apiFunc, props.params, !!props.apiFunc)
const {
  queryParams,
  getList,
  loading,
  total,
  list,
  search,
  reSearch,
  currentRow,
  tableCurrentChange,
  fetchCback
} = _tableListAttr

const tableListAttr1 = ref(props.tableListAttr || _tableListAttr)

if (props.fetchCback) {
  tableListAttr1.value.fetchCback(props.fetchCback)
}

const columns = ref([])
const getTemplateVO = () => {
  
  const apiFunc = props?.templateApiFunc ? props?.templateApiFunc() : templateApi.getTemplateVO({ templateNo: props.tempNo })

  apiFunc.then((res) => {
    console.log('[ res ] >', res)
    columns.value = res.templates
      ?.filter((v) => {
        if (props.customVisible && v['colname'] in props.customVisible) {
          v['colvisible'] = props.customVisible[v['colname']] ? '1' : '0'
        }

        return v['colvisible'] === '1'
      })
      .map((v) => {
        const coleditsource = v?.coleditsourcetype === "JSON" ? JSON.parse((v?.coleditsource ?? "[]")) : null
        return {
          label: v['colheader'],
          field: v['colname']?.toLocaleLowerCase() ?? '',
          minWidth: getWidth(v),
          formatter: (row, column, cellValue)=> {
            if(coleditsource) {
              const val = coleditsource?.find(f => f.itemNo === cellValue)
              return val?.itemName ?? ''
            }
            return cellValue
          }
        }
      })
  })
}

const getWidth = (info) => {
  const { colhtmlstyle } = info
  if (!colhtmlstyle) return '120'

  const findIndex = colhtmlstyle.indexOf('width:')
  if (findIndex == -1) return '120'

  const findIndex2 = colhtmlstyle.indexOf('px')
  if (findIndex2 == -1) return '120'

  return colhtmlstyle.substring(findIndex + 6, findIndex2)
}

getTemplateVO()

const handleDblClick = () => {
  emit('dbl-click')
}

defineExpose({
  ..._tableListAttr
})
</script>