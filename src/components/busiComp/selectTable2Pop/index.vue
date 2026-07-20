<template>
  <Dialog v-model="visible" title="挑选" width="1200px" top="5vh">
    <ContentWrap v-loading="loading">
      <el-form inline>
        <el-form-item v-for="field in searchFields" :key="field.field" :label="field.label">
<!--          <el-select-->
<!--            v-if="field.field === 'GYLFLAG'"-->
<!--            v-model="queryParams[field.field]"-->
<!--            placeholder="请选择供应链标识"-->
<!--            class="!w-240px"-->
<!--          >-->
<!--            <el-option label="非供应链" value="非供应链" />-->
<!--            <el-option label="供应链" value="供应链" />-->
<!--            <el-option label="纯供应链" value="纯供应链" />-->
<!--          </el-select>-->

          <el-input
            class="!w-240px"
            v-model="queryParams[field.field]"
            :placeholder="`搜索${field.label}`"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="search1" tpye=""
            ><Icon class="mr-5px" icon="ep:search" /> 查询
          </el-button>
          <el-button @click="reSearch1"> <Icon class="mr-5px" icon="ep:refresh" />重置 </el-button>
        </el-form-item>
      </el-form>
      <Table
        v-if="columns"
        :columns="columns"
        :data="list"
        :loading="loading"
        :selection="true"
        @selection-change="tableCurrentChange"
      />
    </ContentWrap>
    <template #footer>
      <el-button tpye="" :loading="saving" @click="confirm">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import * as Api from './api.js'
import useTableList from '@/compositions/useTableList'
import { useMessage } from '@/hooks/web/useMessage'
import { associatedCreditApi } from '@/api/creditapplication/associatedCredit/index.ts'
import * as commonApi from '@/views/projectMana/projectCollReviMana/projectCollReviAppr/components/workList/api.js'

const props = defineProps({
  params: {
    type: Object,
    default: () => {}
  }
})

const {
  queryParams,
  loading,
  getList,
  total,
  list,
  search,
  reSearch,
  currentRow,
  tableCurrentChange,
  fetchCback,
  setDefaultParams
} = useTableList(
  props.params.applyType === 'ApprovePutOutApply' ? Api.selectPutOutReviewApply:Api.selectReviewApply,
  {
    applyType: props.params.applyType || 'ApproveBusinessContract',
    creditSourceFlag: props.params.creditSourceFlag
  },
  false
)

const columns = ref()
const searchFields = ref([])
let orgList = []
fetchCback((list, res) => {
  columns.value = Object.keys(res.headMap).map((key) => ({
    label: res.headMap[key],
    field: key,
    minWidth: 120
  }))

  orgList = list

  searchFields.value = Object.keys(res.searchCondition).map((key) => ({
    label: res.headMap[key],
    field: key
  }))
})

const visible = ref(false)

const search1 = () => {
  list.value = orgList.filter((v) => {
    return searchFields.value.every((v2) => {
      if (v2.field === 'GYLFLAG') {
        return !queryParams[v2.field] || v[v2.field] === queryParams[v2.field]
      } else {
        return !queryParams[v2.field] || v[v2.field].includes(queryParams[v2.field])
      }
    })
  })
}

const reSearch1 = () => {
  Object.keys(queryParams).forEach(key => queryParams[key] = '')

  search1()
}

let rowItem = {}
const open = (row) => {
  rowItem = row
  visible.value = true
  setDefaultParams({
    flowNo: row.flowNo,
    phaseNo: row.phaseNo
  })
  getList()
}

const emit = defineEmits(['confirm'])

const saving = ref(false)
const confirm = () => {
  if (!currentRow.value?.length) {
    ElMessage.warning('请选择')
    return
  }

  saving.value = true
  commonApi
    .aprrovalOptionConfirm({
      serialNo: currentRow.value.map((v) => v.TASKNO).join(','),
      approveType: props.params.applyType
    })
    .then((res) => {
      ElMessage.success('保存成功')

      visible.value = false
      emit('confirm')
    })
    .finally((_) => (saving.value = false))
}

defineExpose({
  open
})
</script>
