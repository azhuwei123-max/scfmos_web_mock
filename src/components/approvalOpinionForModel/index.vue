<template>
  <el-dialog  
    v-model="dialogVisible"
    title="签署意见"
    width="75%"
    :close-on-click-modal="false"
    @close="handleClose"
    destroyOnClose> 
  <ContentWrap>
    <!-- 标题和返回按钮 -->
    <div class="mb-20px flex items-center justify-between">
      <div class="text-18px font-bold">签署意见</div>
      <!-- <el-button @click="handleBack">返 回</el-button> -->
    </div>

    <!-- 申请信息 -->
    <!-- <div class="mb-20px p-15px bg-gray-50 rounded">
      <div class="text-14px">
        <span class="text-gray-600">申请编号：</span>
        <span class="font-medium">{{ applicationNo }}</span>
      </div>
    </div> -->

    <!-- Tab 标签页 -->
    <el-tabs v-model="activeTab" class="approval-opinion-tabs" @tab-click="tabClick">
      <!-- 签署意见 -->
      <el-tab-pane label="签署意见" name="signing">
        <el-form
          ref="formRef"
          v-loading="formLoading"
          :model="formData"
          :rules="formRules"
          label-width="140px"
        >
          <div class="mb-30px">
            <div class="text-16px font-bold mb-15px flex items-center">
              <Icon icon="ep:arrow-down" class="mr-5px" />
              意见信息
            </div>
           
            <el-form-item label="意见(限2000个汉字)" prop="approvalComment" required>
              <el-input
                v-model="formData.approvalComment"
                type="textarea"
                :rows="10"
                placeholder="请输入审批意见"
                maxlength="2000"
                show-word-limit
                class="w-full"
              />
            </el-form-item>
          </div>

          <!-- 操作信息 -->
          <!-- <div class="mb-30px">
            <div class="text-16px font-bold mb-15px flex items-center">
              <Icon icon="ep:arrow-down" class="mr-5px" />
              操作信息
            </div>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="登记人">
                  <el-input v-model="formData.nickName" readonly />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="登记日期">
                  <el-input v-model="formData.oprDate" readonly />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="登记机构">
                  <el-input v-model="formData.orgName" readonly />
                </el-form-item>
              </el-col>
            </el-row>
          </div> -->

          <!-- 操作按钮 -->
          <div class="flex justify-end gap-10px mt-30px">
            <!-- <el-button @click="handleBack">取 消</el-button> -->
            <el-button :loading="saving"  v-if="canModify" @click="handleSave">保 存</el-button>
            <el-button tpye="" :loading="submitting" @click="handleSubmit">提 交</el-button>
            <el-button  v-if="canDelete" type="" :loading="deleting" @click="handleDelete">删除意见</el-button>
            <!-- <el-button type="" :loading="deleting" @click="handleDelete">删除意见</el-button> -->
          </div>
        </el-form>
      </el-tab-pane>

    

      <!-- 业务申请信息 -->
      <!-- <el-tab-pane label="业务申请信息" name="application">
        <div class="p-20px text-center text-gray-500"> 业务申请信息功能待开发 </div>
      </el-tab-pane> -->

      <!-- 客户信息 -->
      <!-- <el-tab-pane label="客户信息" name="customer">
        <div class="p-20px text-center text-gray-500"> 客户信息功能待开发 </div>
      </el-tab-pane> -->
    </el-tabs>
  </ContentWrap>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatDate } from '@/utils/formatTime'
import { useUserStore } from '@/store/modules/user'
import { ElMessageBox } from 'element-plus'
import {
  getApprovalOpinionDetail as getApprovalOpinionDetailApi,
  saveApprovalOpinion,
  submitApprovalOpinion,
  deleteApprovalOpinion
} from './api'
import crmsIframe from '@/components/busiComp/crmsIframe/index.vue'


defineOptions({ name: 'ApprovalOpinion' })


const props = withDefaults(defineProps<{
  modelValue: boolean,
  processInstance: any // 流程实例信息
  todoTask?:any // 
}>(), {
  modelValue: false
})

const route = useRoute()
const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const formRef = ref()
const formLoading = ref(false)
const saving = ref(false)
const submitting = ref(false)
const deleting = ref(false)
const canModify = ref(false) //是否可以保存
const canDelete = ref(false) //是否可以删除

const resData = ref(null)

// 弹框显示状态
const dialogVisible = ref(false)

// Tab 激活状态（默认第一个 tab）
const activeTab = ref<string>('signing')

// 申请编号（从路由参数获取）
const applicationNo = ref<string>('')

// 表单数据
const formData = reactive({
  
  approvalComment: '', // 审批意见
  serialNo: '', // 流水号

})


// 表单校验规则
const formRules = reactive({
  approvalComment: [
    { required: true, message: '审批意见不能为空', trigger: 'blur' },
    { max: 2000, message: '审批意见不能超过2000个汉字', trigger: 'blur' }
  ]
})


//http://192.168.168.20:8080/Credit/ThirdLogon.jsp?TPUSERID=3087&TPPASSWORD=CC357616CC513B4896F8FED824B3E191&TPOPENTYPE=EvaluateSignOpinion&TPSERIALNO=BA2023082100000010&Argument=ObjectType=CreditApply 
const iframeParams1 =  reactive({
 "tpopentype":"EvaluateSignOpinion"
})
const iframeParams2 =  reactive({
 "tpopentype":"ClassifyApplySignOpinion"
})
const iframeParams3 =  reactive({
 "tpopentype":"HistoryApplyList"
})

// 监听外部传入的 modelValue
watch(
  () => props.modelValue,
  (val) => {
    dialogVisible.value = val
    if (val) {
      // 弹框打开时，先加载检查项，再执行检查
      getApprovalOpinionDetail()
    }
  },
  { immediate: true }
)


// 监听内部 dialogVisible 变化，同步到外部
watch(dialogVisible, (val) => {
  emit('update:modelValue', val)
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel','submit'])

/** 获取审批意见详情 */
const getApprovalOpinionDetail = async () => {
  try {
    formLoading.value = true

   
    
    // iframeParams1['tpserialno']  = props.processInstance[0].objectNo
    // iframeParams1['argument']  = 'ObjectType=CreditApply'
    // iframeParams2['tpserialno']  = props.processInstance[0].objectNo
    // iframeParams2['argument']  = 'ObjectType=CreditApply'
    // iframeParams3['tpserialno']  = props.processInstance[0].objectNo
    

    // 调用 API 获取审批意见详情
    // const applicationId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
    // const businessKey = props.processInstance.businessKey
    // const taskId = props.todoTask.id
    // console.log(' props.todoTask', props.todoTask, props.processInstance);
    const businessId =  props.processInstance.businessId
    console.log('props.processInstance.',props.processInstance,businessId);
    const res = await getApprovalOpinionDetailApi({
      serialNo:businessId,
      objectType:'GYLModelApply',
      phaseType:props.processInstance.phaseType,
      phaseNo:props.processInstance.phaseNo
      
    })
    console.log('res,res',res);
    
  
    if (res) {
      // 如果有已保存的意见，则加载
       canModify.value = res.canModify
       resData.value = res
       canDelete.value =  res.canDelete
      //  formData.opinion = res.approvalComment || ''
      Object.assign(formData,res)


       formData.approvalComment = res.approvalComment
       formData.serialNo = res.serialNo


       console.log('formData',formData,res);
       
      // formData.registerUser = res.nickName || userStore.getUser.nickname || ''
      // formData.registerDate = res.oprDate || formatDate(new Date(), 'YYYY-MM-DD')
      // formData.registerOrg = res.userName || (userStore.getUser as any).deptName || ''
    } else {
      // 初始化操作信息（从用户信息获取）
      formData.approvalComment = ''
      formData.serialNo = businessId
      // formData.registerOrg = (userStore.getUser as any).deptName || ''
    }
  } catch (error) {
    console.error('获取审批意见详情失败:', error)
    // message.error('获取审批意见详情失败')
    // 即使获取失败，也初始化操作信息
      formData.approvalComment = ''
      formData.serialNo = businessId
    // formData.registerOrg = (userStore.getUser as any).deptName || ''
  } finally {
    formLoading.value = false
  }
}

/** 保存审批意见 */
const handleSave = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate().catch(() => false)
    if (!valid) return
    if (!resData.value) return
    saving.value = true
    

  //  const params = Object.assign(resData.value,{
  //   approvalComment:formData.opinion,
  //   businessId: props.processInstance[0].objectNo
  //  })
   
   

    // 调用 API 保存审批意见
    // const applicationId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id

    await saveApprovalOpinion({
      approvalComment:formData.approvalComment,
      serialNo:props.processInstance.businessId,
      ftSerialNo:props.processInstance.ftserialno
    })

    message.success('保存成功')
    // dialogVisible.value = false
  } catch (error) {
    console.error('保存审批意见失败:', error)
    // message.error('保存审批意见失败')
  } finally {
    saving.value = false
  }
}

/** 提交审批意见 */
const handleSubmit = async () => {
  if (!formRef.value) return
  console.log('formDataformData',formData);
  try {
    const valid = await formRef.value.validate().catch(() => false)
    if (!valid) return
    if (!resData.value) return
    saving.value = true
    

  //  const params = Object.assign(resData.value,{
  //   approvalComment:formData.opinion,
  //   businessId: props.processInstance[0].objectNo
  //  })
   

    // 调用 API 保存审批意见
    // const applicationId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id

    await saveApprovalOpinion({
      approvalComment:formData.approvalComment,
      serialNo:props.processInstance.businessId,
      ftSerialNo:props.processInstance.ftserialno
    })


    emit('submit')

    // message.success('保存成功')
    dialogVisible.value = false
  } catch (error) {
    console.error('提交失败:', error)
    // message.error('保存审批意见失败')
  } finally {
    saving.value = false
  }
}

/** 删除意见 */
const handleDelete = async () => {
  try {
    if (!formData.approvalComment) {
      message.warning('当前没有审批意见可删除')
      return
    }

    await ElMessageBox.confirm('确定要删除当前审批意见吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    deleting.value = true

    // 调用 API 删除审批意见
    // const applicationId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
    
    await deleteApprovalOpinion({"id":resData.value.serialNo,"objectType":"GYLModelApply"})

    // 清空意见内容
    formData.opinion = ''

    message.success('删除成功')
    dialogVisible.value = false

  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除审批意见失败:', error)
      // message.error('删除审批意见失败')
    }
  } finally {
    deleting.value = false
  }
}

/** 返回 */
const handleBack = () => {
  // router.back()
}

watch([()=>props.processInstance,()=>props.todoTask],([newProcess,newTask],[oldProcrss,oldTask])=>{
  if(!newProcess || !newTask) return
  

  getApprovalOpinionDetail()

},{
  immediate:false
})


// 关闭弹框
const handleClose = () => {
  dialogVisible.value = false
  emit('update:modelValue', false)
  // 重置数据
  // checkGroups.value = []
  // activeGroups.value = ''
}

// const tabClick = (tab:TabsPaneContext, event:Event) =>{
//   console.log(tab,event);
//   iframeParams.tpopentype = dictOpinion[tab.paneName]

// }
/** 初始化 */
onMounted(() => {
  // 从路由参数获取申请编号
  // applicationNo.value = (route.query.applicationNo as string) || ''

  // if (!applicationNo.value) {
  //   message.warning('申请编号不能为空')
  //   handleBack()
  //   return
  // }

  // 加载审批意见详情
 
    // getApprovalOpinionDetail()
  
  
})
</script>

<style scoped lang="scss">
.bg-gray-50 {
  background-color: #f9fafb;
}

.approval-opinion-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 20px;
  }

  :deep(.el-tabs__item) {
    height: 40px;
    padding: 0 20px;
    font-size: 14px;
    line-height: 40px;
  }

  :deep(.el-tabs__item.is-active) {
    font-weight: 500;
    color: #409eff;
  }

  :deep(.el-tabs__nav-wrap::after) {
    height: 1px;
    background-color: #e4e7ed;
  }
}
</style>
