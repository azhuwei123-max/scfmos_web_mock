<template>
  <Dialog
    v-model="visible"
    title="关联"
    width="1200px"
    top="5vh"
    appendToBody
    class="jump-start-model7-1"
  >
    <ContentWrap v-loading="loading">
      <el-form inline>
        <el-form-item label="客户名称">
          <el-input
            class="!w-240px"
            v-model="queryParams.customername"
            :placeholder="`搜索客户名称`"
            clearable
          />
        </el-form-item>
        <el-form-item label="客户号">
          <el-input
            class="!w-240px"
            v-model="queryParams.mfcustomerid"
            :placeholder="`搜索客户号`"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="search" tpye=""
            ><Icon class="mr-5px" icon="ep:search" /> 查询
          </el-button>
          <el-button @click="reSearch"> <Icon class="mr-5px" icon="ep:refresh" />重置 </el-button>
        </el-form-item>
      </el-form>

      <div class="big-screen-window" v-show="currentRow?.length">
        <DefineTemplate v-slot="{ data }">
          <div class="box">
            <span class="mr-10px ml-10px">{{ data.customername }}</span>
            <el-icon color="#f56c6c" :size="15" class="icon" @click="selectClear(data)">
              <CircleClose />
            </el-icon>
          </div>
        </DefineTemplate>
        <ReuseTemplate v-for="v in currentRow" :key="v.customerid" :data="v" />
      </div>

      <Table
        ref="tableRef"
        :columns="columns"
        :data="list"
        :loading="loading"
        :selection="true"
        row-key="customerid"
        reserveSelection
        :pagination="{ total }"
        highlight-current-row
        v-model:pageSize="queryParams.pageSize"
        v-model:currentPage="queryParams.pageNo"
        @selection-change="handleSelectionChange"
        @page-change="getList"
      />

      <el-button class="mt-15px" @click="back">
        <Icon class="mr-5px" icon="ep:arrow-left" />
        返回
      </el-button>
    </ContentWrap>
    <template #footer>
      <el-button :loading="saving" @click="confirm">确 定</el-button>
      <el-button @click="toModel1">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import * as Api from './api.js'
import useTableList from '@/compositions/useTableList'
import { useMessage } from '@/hooks/web/useMessage'
import { createReusableTemplate } from '@vueuse/core'
import { CircleClose } from '@element-plus/icons-vue'

const props = defineProps({
  params: {
    type: Object,
    default: () => {}
  }
})

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()

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
} = useTableList(Api.getCompAndSelfList, {}, false)

const columns = [
  { label: '客户号', field: 'mfcustomerid', minWidth: 120 },
  { label: '客户类型', field: 'customertype', minWidth: 120 },
  { label: '客户名称', field: 'customername', minWidth: 120 },
  { label: '客户证件类型', field: 'certtype', minWidth: 120 },
  { label: '客户证件号码', field: 'certid', minWidth: 120 }
]

const visible = ref(false)

let rowItem = {}
const open = (row) => {
  rowItem = row
  visible.value = true

  currentRow.value = []
  getList()
}

const emit = defineEmits(['confirm', 'back', 'toModel1'])
const { confirmFetch } = useMessage()

const saving = ref(false)
const confirm = async () => {
  if (!currentRow.value?.length) {
    ElMessage.warning('请选择')
    return
  }

  confirmFetch({
    title: `将已选择的客户加入至【${rowItem.projectname}】项目里，是否确认`,
    fetchFunc: () =>
      Api.add({
        projectid: rowItem.projectid,
        relativeid: currentRow.value.map((v) => v.customerid).join(',')
      }).then((res) => ElMessage.success(res || '关联成功'))
  }).then((_) => {
    visible.value = false
    emit('confirm')
  })
}

const handleSelectionChange = (selection) => {
  currentRow.value = selection
}

const saveCheck = (row, chooseRows) => {
  return new Promise((resolve, rej) => {
    Api.getCustIsProjRelative({
      customerid: chooseRows.map((v) => v.customerid).join(','),
      projectid: row.projectid
    })
      .then((res) => {
        if (res) {
          resolve(false)
          return ElMessage.warning('该客户已是项下成员了，无需关联')
        }

        resolve(true)
      })
      .catch(rej)
  })
}

const back = () => {
  visible.value = false
  emit('back')
}

const toModel1 = () => {
  visible.value = false
  emit('toModel1')
}

const tableRef = ref()
const selectClear = (data) => {
  console.log(1111, data);

  tableRef.value.rowClick(data)
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.jump-start-model7-1 {
  .big-screen-window {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    border-radius: 4px;
    padding: 10px 20px;
    border: 1px solid #2196f3;
    margin-bottom: 10px;
    background-color: aliceblue;

    & .box {
      display: flex;
      align-items: center;
      border: 1px solid #c6c6c6;
      border-radius: 5px;
      padding: 5px;
      background-color: white;

      & .icon {
        cursor: pointer;
      }
    }
  }
}
</style>
