<template>
  <Dialog v-model="visible" title="选择关联白名单" width="1300px" top="5vh">
    <ContentWrap>
      <el-form inline @keyup.enter="search" label-width="150px">
        <el-row>
          <el-col :span="8">
            <el-form-item class="!w-1/1" label="申请流水号">
              <el-input
                class="!w-1/1"
                v-model="queryParams.serialno"
                placeholder="搜索申请流水号"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item class="!w-1/1" label="供应链合作项目名称">
              <el-input
                class="!w-1/1"
                v-model="queryParams.projectname"
                placeholder="搜索供应链合作项目名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="!w-1/1" label="借款人编号">
              <el-input
                class="!w-1/1"
                v-model="queryParams.borrowerid"
                placeholder="搜索借款人编号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="!w-1/1" label="借款人名称">
              <el-input
                class="!w-1/1"
                v-model="queryParams.borrowername"
                placeholder="搜索借款人名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="!w-1/1" label="证件号码">
              <el-input
                class="!w-1/1"
                v-model="queryParams.certid"
                placeholder="搜索证件号码"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="!w-1/1 ml-20px">
              <el-button @click="search" tpye=""
                ><Icon class="mr-5px" icon="ep:search" /> 查询
              </el-button>
              <el-button @click="reSearch">
                <Icon class="mr-5px" icon="ep:refresh" />重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="list"
        :header-cell-style="{ background: '#F7F8FA' }"
        highlight-current-row
        @current-change="tableCurrentChange"
      >
        
        <el-table-column align="center" label="申请流水号" prop="serialno" />
        <el-table-column align="center" label="供应链合作项目名称" prop="projectname" />
        <el-table-column align="center" label="债项/产品方案" prop="productname" />
        <el-table-column align="center" label="借款人编号" prop="borrowerid" />
        <el-table-column align="center" label="借款人名称" prop="borrowername" />
        <el-table-column align="center" label="证件号码" prop="certid" />
      </el-table>
      <!-- 分页 -->
      <Pagination
        v-model:limit="queryParams.pageSize"
        v-model:page="queryParams.pageNo"
        :total="total"
        @pagination="getList"
      />
    </ContentWrap>
    <template #footer>
      <el-button tpye="" :loading="saving" @click="confirm">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import * as Api from './api.js'
import useTableList from '@/compositions/useTableList'

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
  setDefaultParams
} = useTableList(Api.getWhiteApplyList, {}, false)

const visible = ref(false)

let rowItem
const open = (row) => {
  rowItem = row
  setDefaultParams({ objectNo: row.serialNo, CustomerID: row.customerid })
  visible.value = true
  getList().catch((e) => {
    if (e.code == '2001002001') {
      visible.value = false
    }
  })
}

const emit = defineEmits(['confirm'])

const saving = ref(false)
const confirm = () => {
  if (!currentRow.value) {
    ElMessage.warning('请选择')
    return
  }

  saving.value = true
  Api.addWhiteApply({
    objecttype: 'CreditApply',
    serialno: rowItem.serialNo,
    autoapplyno: currentRow.value.serialno
  })
    .then((res) => {
      ElMessage.success('关联成功')
      emit('confirm', currentRow.value)
      visible.value = false
    })
    .finally(() => (saving.value = false))
}

defineExpose({
  open
})
</script>