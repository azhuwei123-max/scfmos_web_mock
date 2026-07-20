<template>
  <ContentWrap>
    <div class="mb-15px" style="display: flex; flex-wrap: wrap; gap: 8px">
      <el-button v-if="props.params.key !== '1080'" @click="goDetail" plain type="">
        出账详情
      </el-button>
      <el-button v-if="fillPutOutVIf" @click="handleNoticeBook"> 填写放贷通知书 </el-button>
      <el-button v-if="viewPutOutVIf" @click="viewFormatReport"> 查看放贷通知书 </el-button>
    </div>
    <tempTable
      ref="tempTableRef"
      :api-func="Api.getListValue"
      tempNo="RelativePutOutList"
      :templateApiFunc="getTemplateInfoFetch"
      :params="ListParams"
      :selection="false"
      highlight-current-row
      @dbl-click="goDetail"
    />

    <!-- 填写放贷通知书 -->
    <treeListPop
      ref="treeListPopRef1"
      :api-func="Api.preEditFormatReport"
      :qry-params="getPutOut"
      @confirm="(item) => editFormatReport(item)"
    />
  </ContentWrap>
</template>

<script setup>
import * as Api from './api.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import { useMessage } from '@/hooks/web/useMessage'
import treeListPop from '@/components/dynamicForm/components/treeListPop.vue'
import { checkRoleIds } from '@/utils/permission'

const props = defineProps({
  params: {
    type: Object,
    default: () => {}
  }
})

// 填写放贷通知书
const fillPutOutVIf = computed(() => {
  return checkRoleIds(['437'])
})
// 查看放贷通知书
const viewPutOutVIf = computed(() => {
  return checkRoleIds(['437'])
})

const ListParams = reactive({
  templateno: 'RelativePutOutList',
  serialno: props.params.detailInfo.serialno,
})

// 获取表单字段配置
const getTemplateVO = (serialno, templateno) => {
  templateApi.getTemplateValue({ serialno, templateno }).then((res) => {
    formTempList.value = res?.templates || []

    simpleFormRef.value?.resetFields()
    Object.assign(formData, res?.data)
  })
}

const router = useRouter() // 路由

const getTemplateInfoFetch = () => {
  return Api.getTemplateInfo({ templateNo: 'RelativePutOutList' })
}

const goDetail = () => {
  if(props.params.key === '1080') return;
  const currentRow = tempTableRef.value?.currentRow
  if (!currentRow) return ElMessage.warning('请选择 1 条')

  const has289 = checkRoleIds(['289'])
  const isEdit =
    ['0010', '3000'].includes(currentRow.phaseno) ||
    (props.params.key === '1020' && has289)
  router.push({
    path: '/contractIssuanceMGM/loanDetail',
    query: {
      serialno: currentRow.serialno,
      businesstype: currentRow.businesstype,
      customerID: currentRow.customerid,
      customertype: currentRow.customertype,
      isEdit,
      t: Date.now()
    }
  })
}

//填写放贷通知书
const treeListPopRef1 = ref()
const handleNoticeBook = async () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  const data = await Api.judgeFormatReport(getPutOut)
  if (data.length == 0) {
    treeListPopRef1.value.open()
  } else {
    if (data.includes('放贷详情未保存')) {
      ElMessage.warning(data)
    } else {
      ElMessageBox.confirm(data, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          treeListPopRef1.value.open()
        })
        .catch(() => {
          editFormatReport()
        })
    }
  }
}
//查看放贷通知书
const viewFormatReport = async () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  const data = await Api.viewFormatReport({
    objectNo: currentRow.value.serialno,
    objectType: 'PutOutApply'
  })
  if (data.url?.length > 0) {
    window.open(data.url)
  } else {
    ElMessage.warning(data.msg || '暂时无法查看')
  }
}

//生成放贷申请书
const editFormatReport = async (item) => {
  // 出账信息
  const editFormatReportReq = {
    customerID: currentRow.value.customerid,
    objectNo: currentRow.value.serialno,
    objectType: 'PutOutApply',
    docID: item == null ? '' : item.itemNo //如果是新生成的放贷通知书不传item ，如果已生成放贷，则编辑传item
  }
  const data = await Api.editFormatReport(editFormatReportReq)
  if (data.url.length > 0) {
    window.open(data.url)
  }
}

const tempTableRef = ref()
// onActivated(() => {
//   tempTableRef?.value?.search()
// })
</script>
