<template>
  <div class="pl-2 py-1">
    <el-button
      v-for="tab in tabs"
      class="rounded-0px!"
      :key="tab.key"
      @click="tab.onClick()"
      :type="activeMenu === tab.key ? 'primary' : 'default'"
      plain
    >
      {{ tab.label }}
    </el-button>
  </div>
  <div>
    <applicationDetail v-if="activeMenu === '1'" />
    <div v-if="activeMenu === '2'">
      <customerDetail v-if="customerElType === '1'"  />
      <companyCustomerDetail v-else />
    </div>
    <projectInfoDetail v-if="activeMenu === '3'" />
  </div>
</template>

<script setup>
defineOptions({
  name: 'applicationMGMDetail'
})
import companyCustomerDetail from './components/companyCustomerDetail/index.vue'
import customerDetail from './components/customerDetail/index.vue'
import applicationDetail from './components/applicationDetail/index.vue'
import projectInfoDetail from './components/projectInfoDetail/index.vue'

const activeMenu = ref('1')

const route = useRoute()

// '1'公司客户 其他自雇
const customerElType = ref(route.query.borrowerType || '2')

const tabs = ref([
  {
    key: '1',
    label: '进件详情',
    onClick: () => activeMenu.value = '1'
  },
  {
    key: '2',
    label: '客户详情',
    onClick: () => activeMenu.value = '2'
  },
  {
    key: '3',
    label: '项目详情',
    onClick: () => activeMenu.value = '3'
  },
])
</script>
