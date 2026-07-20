<template>
  <Dialog class="jump-starts-model4" v-model="visible" title="新增客户建档" width="40%" top="5vh">
    <ContentWrap>
      <div >
        <div style="font-size: larger; font-weight: bolder;">{{currentData.projectname}} 供应链项目</div>
        <div style="font-size: large;">
           经销商数据贷产品
        </div>
      </div>
      
      <DefineTemplate v-slot="{ icon, label }">
        <div class="card">
          <Icon :icon="icon" :size="48" class="text-[#fff] mb-10px" />
          <span>{{ label }}</span>
        </div>
      </DefineTemplate>
      <div class="mt-20px flex items-container justify-around gap-[20px]">
        <ReuseTemplate icon="ep:document" label="公司客户" @click="addCustomer" />
        <ReuseTemplate icon="ep:document" label="自雇人士" @click="addPerson" />
      </div>
    </ContentWrap>
    <template #footer>
      <!-- <el-button tpye="" :loading="saving" @click="confirm">确 定</el-button> -->
      <el-button @click="toModel1">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import * as Api from './api.js'
import useTableList from '@/compositions/useTableList'
import { formatValue } from '@/utils/formatter'
import { createReusableTemplate } from '@vueuse/core'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()

const currentData = ref();

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
  setDefaultParams,
  fetchCback
} = useTableList(Api.customerListByProject, {}, false)

fetchCback((list) => {
  list.forEach((v) => {
    v.businesssum1 = formatValue(v.businesssum, 'currency')
    v.exposuresum1 = formatValue(v.exposuresum, 'currency')
  })
})

const columns = [
  { label: '客户号', field: 'mfcustomerid', minWidth: 120 },
  { label: '客户类型', field: 'customertype', minWidth: 120 },
  { label: '客户名称', field: 'customername', minWidth: 120 },
  { label: '客户证件类型', field: 'certtype', minWidth: 120 },
  { label: '客户证件号码', field: 'certid', minWidth: 120 },
  { label: '操作', field: 'action', minWidth: 120 }
]

const visible = ref(false)
const route = useRoute() // 路由对象
const open = (row) => {
  visible.value = true
  currentData.value = row
}

const emit = defineEmits(['confirm', 'back', 'addCustomer'])

const saving = ref(false)



const confirm = () => {
  if (!currentRow.value?.customerName) {
    ElMessage.warning('请选择')
    return
  }

  emit('confirm', currentRow.value)
  visible.value = false
}

const back = () => {
  visible.value = false
  emit('back')
}

const addCustomer = () => {
  visible.value = false
  emit('addCustomer')
}

const addPerson = () => {
  visible.value = false
  emit('addPerson')
}

const toModel1 = () => {
  visible.value = false
  emit('toModel1')
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.jump-starts-model4 {
  .card {
    width: 50%;
    border-radius: 15px;
    // padding: 100px 150px;
    padding-top: 60px;
    padding-bottom: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #14ab00;
    background: linear-gradient(0deg, #0e7300, #6bff58);
    color: white;
    cursor: pointer;
    transition: opacity .3s;
    opacity: 1;

    &:first-child {
      background: linear-gradient(0deg, #005a99, #55b9ff);
    }

    &:hover {
      opacity: 0.8;
    }

    &:active {
      opacity: 1;
    }
  }
}
</style>