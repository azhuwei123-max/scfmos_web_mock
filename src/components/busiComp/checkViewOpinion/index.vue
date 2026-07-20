<template>
  <ContentWrap class="busi-comp-check-view-opinion">
    <el-row v-if = "titleObj">
      <el-col :span="3" class = "font-weight">{{titleObj.customerName}}</el-col>
      <el-col :span="3" class = "font-weight">{{titleObj.serialNo}}</el-col>
    </el-row>
    <el-descriptions title="" :column="4" v-for="(col, i) in columns" :key="i" border>
      <template v-for="it in col.column" :key="it.label">
        <el-descriptions-item :label="it.label" :span="it.span" width = "350px">
          {{ col.data[it.key] }}
        </el-descriptions-item>
      </template>
    </el-descriptions>
  </ContentWrap>
</template>
<script  setup>
import { getColumnsByData } from './common.js'
import * as Api from './api.js'
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  type: {
    type: String,
    default: ''
  },
  titleObj: {
    type: Object,
    default: () => {}
  }
})
const creditStageMap = ref()
const columns = ref()

// 获取授信查看审批意见阶段号模板
const getCreditStageFlow = () => {
  return Api.getCreditStageFlow({}).then((res) => {
    creditStageMap.value = res[0] || []
    console.log(creditStageMap)
    
    columns.value = getColumnsByData(props.data, creditStageMap.value, props.type)
  })
}

getCreditStageFlow()
</script>
<style lang="scss" scoped>
.busi-comp-check-view-opinion {
  .el-descriptions {
    margin-top: 20px;
  }
  .cell-item {
    display: flex;
    align-items: center;
  }
  .margin-top {
    margin-top: 20px;
  }
}
.font-weight {
  font-weight: 800;
}
</style>
