<template>
  <el-dialog  
    v-model="dialogVisible"
    title="签署意见"
    width="75%"
    :close-on-click-modal="false"
    @close="handleClose">
  <ContentWrap>
    <!-- 标题和返回按钮 -->
    <div class="mb-20px flex items-center justify-between">
      <div class="text-18px font-bold">签署意见</div>
      <el-button @click="handleBack">返 回</el-button>
    </div>

    <!-- 申请信息 -->
    <!-- <div class="mb-20px p-15px bg-gray-50 rounded">
      <div class="text-14px">
        <span class="text-gray-600">申请编号：</span>
        <span class="font-medium">{{ applicationNo }}</span>
      </div>
    </div> -->

    <!-- Tab 标签页 -->
    <el-tabs v-model="activeTab" class="approval-opinion-tabs">
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
            <el-row>
              <el-col :span="12" v-if="formData.showBusiness">
               <el-form-item label="客户名称" prop="customerName">
               <el-input
                v-model="formData.customerName"
                placeholder="客户名称"
                readonly
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="formData.showBusiness">
               <el-form-item label="业务品种" prop="businessTypeName">
               <el-input
                v-model="formData.businessTypeName"
                placeholder="业务品种"
                readonly
                />
              </el-form-item>
            </el-col>
            </el-row>
            
            <el-row>
              <el-col :span="12" v-if="formData.showBusiness">
               <el-form-item label="申请金额" prop="baBusinessSum">
               <el-input
                v-model="formData.baBusinessSum"
                placeholder="申请金额"
                readonly
                type="number"
                >
                <template #suffix>
                 <span>元</span>
                </template>
               </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="formData.showBusiness">
               <el-form-item label="申请期限" prop="baTermMonth">
               <el-input
                v-model="formData.baTermMonth"
                placeholder="申请期限"
                readonly
                >
                <template #suffix>
                 <span>{{formData.baTermUnit}}</span>
                </template>
               </el-input>
              </el-form-item>
            </el-col>
            </el-row>
            <el-row>
              <el-col :span="12"  v-if="formData.showBusiness">
               <el-form-item label="申请敞口" prop="baExposureSum">
               <el-input
                v-model="formData.baExposureSum"
                placeholder="申请敞口"
                readonly
                type="number"
               >
               <template #suffix>
                 <span>元</span>
                </template>
               </el-input>
              </el-form-item>
            </el-col>
              <el-col :span="12" v-if="formData.showBusiness">
               <el-form-item label="业务币种" prop="businessCurrencyName">
               <el-input
                v-model="formData.businessCurrencyName"
                placeholder="业务币种"
                readonly
                />
              </el-form-item>
            </el-col>
           
            </el-row>


            <el-row>
              <el-col :span="12" v-if="formData.showBusiness">
               <el-form-item label="授信金额" prop="businessSum" >
               <el-input
                v-model="formData.businessSum"
                placeholder="授信金额"
                clearable
                type="number"
                >
                <template #suffix>
                 <span>元</span>
                </template>
               </el-input>
              </el-form-item>
            </el-col>
              <el-col :span="12" v-if="formData.showBusiness">
               <el-form-item label="期限" prop="termMonth" >
               <el-input
                v-model="formData.termMonth"
                placeholder="期限"
                clearable
                >
                <template #suffix>
                 <span>{{ formData.termUnit }}</span>
                </template>
               </el-input>
              </el-form-item>
            </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" v-if="formData.showBusiness">
               <el-form-item label="授信敞口" prop="exposureSum" >
               <el-input
                v-model="formData.exposureSum"
                placeholder="授信金额"
                clearable
                >
                <template #suffix>
                 <span>元</span>
                </template>
               </el-input>
              </el-form-item>
            </el-col>

           
            </el-row>
           




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
          <div class="mb-30px">
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
          </div>

          <!-- 操作按钮 -->
          <div class="flex justify-end gap-10px mt-30px">
            <!-- <el-button @click="handleBack">取 消</el-button> -->
            <el-button :loading="saving"  v-if="canModify" @click="handleSave">保 存</el-button>
            <el-button  v-if="canDelete" type="" :loading="deleting" @click="handleDelete">删除意见11</el-button>
            <!-- <el-button tpye="" :loading="submitting" @click="handleSubmit">提 交</el-button>
            <el-button type="" :loading="deleting" @click="handleDelete">删除意见</el-button> -->
          </div>
        </el-form>
      </el-tab-pane>

      <!-- 签署客户评级意见 -->
      <el-tab-pane label="签署客户评级意见" name="rating">
        <div class="p-20px text-center text-gray-500"> 签署客户评级意见功能待开发 </div>
      </el-tab-pane>

      <!-- 签署贷前资产分类意见 -->
      <el-tab-pane label="签署贷前资产分类意见" name="classification">
        <div class="p-20px text-center text-gray-500"> 签署贷前资产分类意见功能待开发 </div>
      </el-tab-pane>

      <!-- 本行信贷业务历史申请记录查询 -->
      <el-tab-pane label="本行信贷业务历史申请记录查询" name="history">
        <div class="p-20px text-center text-gray-500"> 本行信贷业务历史申请记录查询功能待开发 </div>
      </el-tab-pane>

      <!-- 业务申请信息 -->
      <el-tab-pane label="业务申请信息" name="application">
        <div class="p-20px text-center text-gray-500"> 业务申请信息功能待开发 </div>
      </el-tab-pane>

      <!-- 客户信息 -->
      <el-tab-pane label="客户信息" name="customer">
        <div class="p-20px text-center text-gray-500"> 客户信息功能待开发 </div>
      </el-tab-pane>
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
} from '@/api/creditapplication/creditApplyJob/approval-opinion'

defineOptions({ name: 'ApprovalOpinion' })


const props = defineProps<{
  modelValue: {
    type: Boolean,
    default: false
  },
  processInstance: any // 流程实例信息
  todoTask:any // 
}>()

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
  
  opinion: '', // 审批意见
  registerUser: '', // 登记人
  registerDate: '', // 登记日期
  registerOrg: '', // 登记机构
  objectType:'CreditApply',
  showBusiness:false
})

// 表单校验规则
const formRules = reactive({
  approvalComment: [
    { required: true, message: '审批意见不能为空', trigger: 'blur' },
    { max: 2000, message: '审批意见不能超过2000个汉字', trigger: 'blur' }
  ]
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

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

/** 获取审批意见详情 */
const getApprovalOpinionDetail = async () => {
  try {
    formLoading.value = true
    // 调用 API 获取审批意见详情
    // const applicationId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
    // const businessKey = props.processInstance.businessKey
    // const taskId = props.todoTask.id
    // console.log(' props.todoTask', props.todoTask, props.processInstance);
    const businessId =  props.processInstance[0].objectNo
    const res = await getApprovalOpinionDetailApi({
      businessId,
      objectType:'CreditApply'
    })
    console.log('res,res',res);
    
    

    if (res) {
      // 如果有已保存的意见，则加载
       canModify.value = res.canModify
       resData.value = res
       canDelete.value =  res.canDelete
      //  formData.opinion = res.approvalComment || ''
      Object.assign(formData,res)
      formData.registerUser = res.nickName || userStore.getUser.nickname || ''
      formData.registerDate = res.oprDate || formatDate(new Date(), 'YYYY-MM-DD')
      formData.registerOrg = res.orgName || (userStore.getUser as any).deptName || ''
    } else {
      // 初始化操作信息（从用户信息获取）
      formData.registerUser = userStore.getUser.nickname || ''
      formData.registerDate = formatDate(new Date(), 'YYYY-MM-DD')
      formData.registerOrg = (userStore.getUser as any).deptName || ''
    }
  } catch (error) {
    console.error('获取审批意见详情失败:', error)
    message.error('获取审批意见详情失败')
    // 即使获取失败，也初始化操作信息
    formData.registerUser = userStore.getUser.nickname || ''
    formData.registerDate = formatDate(new Date(), 'YYYY-MM-DD')
    formData.registerOrg = (userStore.getUser as any).deptName || ''
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
    await saveApprovalOpinion(formData)

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

  try {
    const valid = await formRef.value.validate().catch(() => false)
    if (!valid) return

    await ElMessageBox.confirm('确定要提交审批意见吗？提交后将无法修改。', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    submitting.value = true

    // 调用 API 提交审批意见
    const applicationId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
    await submitApprovalOpinion({
      applicationId: applicationId as string,
      applicationNo: applicationNo.value,
      opinion: formData.opinion,
      registerUser: formData.registerUser,
      registerDate: formData.registerDate,
      registerOrg: formData.registerOrg
    })

    message.success('提交成功')

    // 提交成功后返回列表页
    setTimeout(() => {
      handleBack()
    }, 1000)
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('提交审批意见失败:', error)
      message.error('提交审批意见失败')
    }
  } finally {
    submitting.value = false
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
    await deleteApprovalOpinion(resData.value.businessId)

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
  router.back()
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
