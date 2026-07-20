<template>
  <el-tabs v-model="activeTabName" @tab-change="getViewOpinions">
    <el-tab-pane v-for="tab in visibleTabs" :key="tab.value" :name="tab.value" :label="tab.label" />
  </el-tabs>
  <el-scrollbar max-height="500px">
    <el-skeleton :loading="loading">
      <checkViewOpinion v-if="data.length" :data="data" type="contract" />
      <el-empty v-else description="目前此业务还没有您可以查看的审批意见" />
    </el-skeleton>
  </el-scrollbar>
</template>

<script setup lang="tsx">
import { getDictOptions } from '@/utils/dict'
import { getCoreviewApplyOpinion } from '../../api'
import checkViewOpinion from '@/components/busiComp/checkViewOpinion/index.vue'

const props = withDefaults(
  defineProps<{
    serialNo: string
    objectType?: string
  }>(),
  {}
)
const loading = ref(false)

const data = ref([])

// tabs 值
const activeTabName = ref('ParamAdjustGYL1')
const tabs = getDictOptions('paramAdjustSwitchPages')
const visibleTabs = computed(() => {
  if (props.objectType) {
    return tabs.filter(f=> f.value === props.objectType)
  } else {
    return tabs
  }
})
onBeforeMount(()=> {
  activeTabName.value = visibleTabs.value[0].value
  getViewOpinions()
})

// 获取审批意见
const getViewOpinions = async () => {
  loading.value = true
  const res = await getCoreviewApplyOpinion({
    serialNo: props.serialNo,
    objectType: activeTabName.value
  }).finally(() => (loading.value = false))
  data.value = res || []
}
</script>
