
<template>
  <dynamicContainer2
    :loading="loading"
    :menu-list-y="menuListY"
    :menu-list-n="menuListN"
    :component="workList"
    :menu-select="menuSelect"
  />
</template>

<script setup>
import * as Api from './api.js'
import workList from './components/workList/index.vue'
import dynamicContainer2 from '@/components/dynamicContainer2/index.vue'

defineOptions({
  name: 'singApplyQuotaContraCheck'
})

// 取数回调前，保持数组为空
const menuListY = ref()
const menuListN = ref()

const menuSelect = () => {
  return {
    objectType: 'BusinessContract'
  }
}

// 获取当前
const loading = ref(false)
const ContractTaskList = (flag) => {
  Api.ContractTaskList({ objectType: 'BusinessContract', flowNo: 'CreditContractFlow', flag ,creditSourceFlag:'02'}).then(
    (res) => {
      if (flag === 'Y') menuListY.value = res || []
      else if (flag === 'N') menuListN.value = res || []
    }
  )
}

const doFetch = () => {
  loading.value = true
  Promise.all([ContractTaskList('Y'), ContractTaskList('N')])
    .then()
    .finally(() => (loading.value = false))
}
doFetch()
</script>
