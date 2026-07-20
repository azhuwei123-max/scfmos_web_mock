<template>
 <el-skeleton :loading="!data">
  <checkViewOpinion :data="data" type="contract"/>
</el-skeleton>
</template>

<script setup>
import { getCoreviewApplyOpinion } from '../api'
import checkViewOpinion from '@/components/busiComp/checkViewOpinion/index.vue'

// 表单模块集合
const data = ref();
const route = useRoute() // 路由对象

// 获取审批意见
const getViewOpinions = () => {
  return getCoreviewApplyOpinion({
    serialNo: route.query.serialNo,
    objectType: route.query.objectType
  }).then((res) => {
    data.value = res || []
    console.log(data)
  })
}

getViewOpinions();
</script>
