<template>
  <el-skeleton :loading="loading" animated>
    <projectInfoQuery :params="params" />
  </el-skeleton>
</template>

<script setup>
import * as Api from '../../api.js'
import projectInfoQuery from '@/views/projectparamconfigerandmanager/paramadjustapply/detail/detail.vue'
import {bcByProjectId} from "../../api.js";

const route = useRoute()
const params = reactive({
  serialno: route.query?.projectId ?? '',
  type: 'detail',
  tempType: 'ProjectDetails',
  customerId: route.query.customerId,
  businessType: route.query.businessType,
  serialNoByList: ''
})

const loading = ref()
const getSerialNoByList = () => {
  loading.value = true
  Api.bcByProjectId({ projectId: route.query.projectId }).then(res => {
    params.serialNoByList = res
  }).finally(_ => loading.value = false)
}
getSerialNoByList()
</script>
