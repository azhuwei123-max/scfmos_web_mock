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
    <customerDetail v-if="activeMenu === '2'" />
    <projectInfoDetail v-if="activeMenu === '3'" />
  </div>
</template>

<script setup>
defineOptions({
  name: 'elecChannelAppManaDetail'
})
import customerDetail from './components/customerDetail/index.vue'
import applicationDetail from './components/applicationDetail/index.vue'
import projectInfoDetail from './components/projectInfoDetail/index.vue'

const activeMenu = ref('1')

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
  }
])
</script>