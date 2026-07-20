<template>
  <Dialog v-model="visible" title="签署意见" width="1200px" top="5vh">
    <ContentWrap>
      <el-scrollbar height="calc(100vh - 388px)">
        <dynamicForm
          ref="dynamicFormRef"
          :formData="formData"
          :dockList="dockList"
          :formTempList="formTempList"
          :customReadonly="customReadonly"
        >
          <template #part4>
            <checkViewOpinion v-if="data" :data="data" type="contract" />
          </template>
        </dynamicForm>
      </el-scrollbar>
    </ContentWrap>
    <template #footer>
      <el-button tpye="" @click="save" :loading="loading">保存</el-button>
      <el-button @click="del">删除意见</el-button>
    </template>
  </Dialog>
</template>

<script setup>
import dynamicForm from '@/components/dynamicForm/index.vue'
import { dockList1, dockList2, tempList } from './common.js'
import checkViewOpinion from '@/components/busiComp/checkViewOpinion/index.vue'
import * as opinionApi from '@/views/projectMana/projectCollReviMana/viewPutOutPhaseOpinion/api.js'
import * as detailApi from '@/views/projectMana/projectCollReviManaDetail/api.js'
import * as aprovalApi from '@/api/creditapplication/creditApplyJob/approval-opinion.ts'
import { bpmCommentApi as getApprovalOpinionlApi } from '@/components/approvalOpinion/api'
import { ElMessage } from 'element-plus'
import { useMessage } from '@/hooks/web/useMessage'
import { checkRoleIds } from '@/utils/permission'
import useFormChange from './hooks/useFormChange'
import { getDictOptions } from '@/utils/dict'

const formData = reactive({})
const dockList = reactive([
  ...(checkRoleIds(getDictOptions('coreviewSpecialOpinionRoleFlag').map((v) => v.value))
    ? dockList1
    : dockList2)
])
const formTempList = reactive([...tempList])

const visible = ref()
const open = (item) => {
  visible.value = true

  data.value = null
  getDetailInfo(item.serialNo)
  getViewOpinions(item.serialNo)
}

// 表单模块集合
const data = ref()
const route = useRoute() // 路由对象

// 获取审批意见
const getViewOpinions = (serialNo) => {
  return opinionApi
    .getCoreviewApplyOpinion({
      serialNo
    })
    .then((res) => {
      data.value = res || []
    })
}

const getDetailInfo = (serialNo) => {
  return detailApi.getDetail({ serialNo }).then((res) => {
    dynamicFormRef.value?.resetFields()

    Object.keys(formData).forEach((key) => delete formData[key])
    Object.assign(formData, dynamicFormRef.value?.formDataFixToShow(res) ?? res) // 这里重新取数后，要作数据转换

    getApproval(serialNo)
  })
}

const getApproval = (serialNo) => {
  aprovalApi
    .getApprovalOpinionDetail({ businessId: serialNo, objectType: 'ProjectCoreview' })
    .then((res) => {
      formData.approvalcomment = res.approvalComment
      formData.nickname = res.nickName
      formData.oprdate = res.oprDate
      formData.orgname = res.orgName
    })
}

const emit = defineEmits(['confirm'])

// 保存
const loading = ref()
const save = () => {
  loading.value = true
  getApprovalOpinionlApi
    .saveApprovalOpinion({
      // ...formData,
      businessId: formData.serialno,
      objectType: 'ProjectCoreview',
      approvalComment: formData.approvalcomment
    })
    .then((res) => {
      ElMessage.success('保存成功')
      visible.value = false
      emit('confirm')
    })
    .finally((_) => (loading.value = false))
}

// 删除
const { confirmFetch } = useMessage()
const del = () => {
  confirmFetch({
    title: '确认删除',
    fetchFunc: () => getApprovalOpinionlApi.deleteApprovalOpinion(formData.serialno)
  }).then((_) => {
    ElMessage.success('已删除')
    emit('confirm')
    visible.value = false
  })
}

const dynamicFormRef = ref()
const { formSelectChange, formSelectInputClick, popConfirm, customVisible, customReadonly } =
  useFormChange({ formData }, { dynamicFormRef })

defineExpose({
  open
})
</script>
