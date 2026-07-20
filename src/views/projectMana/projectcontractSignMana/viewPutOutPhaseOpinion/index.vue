<template>

 <el-skeleton :loading="!data">
  <checkViewOpinion  :data="data" type="contract"/>
  </el-skeleton>
</template>

<script setup>


import * as Api from './api.js'
import checkViewOpinion from '@/components/busiComp/checkViewOpinion/index.vue'

// 表单模块集合
const data = ref([]);
const route = useRoute() // 路由对象

// 获取审批意见
const getViewOpinions = () => {
  return Api.getPutOutOpinion({
    serialNo: route.query.serialNo
  }).then((res) => {
    data.value = res || []
    console.log(data)
  })
}

getViewOpinions();
</script>
