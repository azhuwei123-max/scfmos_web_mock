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
          :customVisible="customVisible"
        >
          <template #part4>
            <checkViewOpinion v-if="data" :data="data" type="contract" />
          </template>
          <template #part5>
            <el-row>
              <el-col :span="24">
                <el-form-item label="意见" prop="approvalComment" class="w-[100%]">
                  <el-input type="textarea" v-model="formData.approvalcomment" :rows="5" />
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </dynamicForm>
      </el-scrollbar>
    </ContentWrap>
    <template #footer>
      <el-button tpye="" @click="save()" :loading="loading">保存</el-button>
      <el-button tpye="" @click="save(true)" :loading="loading2">提交</el-button>
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

const props = defineProps({
  params: {
    type: Object,
    default: () => {}
  }
})

const ftSerialNo = ref();

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
    getApprovalOpinionlApi.getFlowTaskByObjNoAndTypeAndPhaseNo({"objectNo":serialNo,"objectType": 'ProjectCoreviewGYL',"phaseNo":props.params.phaseNo})
    .then((res) => {
        console.log("res=",res)
        if (!res?.serialNo) return ElMessage.warning('审批数据不存在，请刷新列表数据')
        ftSerialNo.value = res.serialNo
        getApproval(serialNo,ftSerialNo.value)
    })
    
  })
}

const getApproval = (serialNo,ftSerialNo) => {
  aprovalApi
    .getApprovalOpinionDetail({ businessId: serialNo, objectType: 'ProjectCoreviewGYL',"ftSerialNo":ftSerialNo})
    .then((res) => {
      formData.approvalcomment = res.approvalComment
      formData.nickname = res.nickName
      formData.oprdate = res.oprDate
      formData.orgname = res.orgName
    })
}

const emit = defineEmits(['confirm', 'submit'])

// 保存
const loading = ref()
const loading2 = ref() // 提交loading
const save = (isSubmit) => {
  if (isSubmit) {
    loading2.value = true
  } else {
    loading.value = true
  }
  getApprovalOpinionlApi
    .saveApprovalOpinion({
      // ...formData,
      businessId: formData.serialno,
      objectType: 'ProjectCoreviewGYL',
      approvalComment: formData.approvalcomment,
      ftSerialNo:ftSerialNo.value
    })
    .then((res) => {
      ElMessage.success('保存成功')
      emit('confirm')

      if (isSubmit) {
        emit('submit')  
        visible.value = false
      } else {
        getDetailInfo(formData.serialno)
      }
    })
    .finally((_) => {
      loading.value = false
      loading2.value = false 
    })
}

// 删除
const { confirmFetch } = useMessage()
const del = () => {
  confirmFetch({
    title: '确认删除',
    fetchFunc: () => getApprovalOpinionlApi.removeApprovalOpinion({"id":formData.serialno,"ftSerialNo":ftSerialNo.value})
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
