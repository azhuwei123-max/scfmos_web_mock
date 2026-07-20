<template>
  <el-dialog
    v-model="dialogVisible"
    title="签署意见"
    width="800px"
    append-to-body
    :close-on-click-modal="false"
    @close="handleClose"
    destroyOnClose
  >
    <ContentWrap>
      <el-form
        ref="formRef"
        v-loading="formLoading"
        :model="formData"
        :rules="formRules"
        label-width="auto"
      >
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

        <el-form-item label="登记人">
          <el-input v-model="formData.nickName" readonly />
        </el-form-item>

        <el-form-item label="登记日期">
          <el-input v-model="formData.oprDate" readonly />
        </el-form-item>

        <el-form-item label="登记机构">
          <el-input v-model="formData.orgName" readonly />
        </el-form-item>

        <!-- 操作按钮 -->
        <div class="flex justify-end gap-10px mt-30px">
          <!-- <el-button @click="handleBack">取 消</el-button> -->
          <el-button :loading="saving" @click="handleSave">保 存</el-button>
          <el-button v-if="showSubmit" tpye="" :loading="saving" @click="handleSubmit">提 交</el-button>
          <el-button type="" :loading="deleting" @click="handleDelete">删除意见</el-button>
        </div>
      </el-form>
    </ContentWrap>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { formatDate } from '@/utils/formatTime'
import { useUserStore } from '@/store/modules/user'
import { ElMessageBox } from 'element-plus'
import {
  getApprovalOpinionDetail as getApprovalOpinionDetailApi,
  saveApprovalOpinion,
  getFlowTaskByObjNoAndTypeAndPhaseNo as getFlowTaskByObjNoAndTypeAndPhaseNoApi,
  removeApprovalOpinion
} from '@/api/creditapplication/creditApplyJob/approval-opinion'

defineOptions({ name: 'ApprovalOpinion' })

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    processInstance: any // 流程实例信息
    todoTask?: any //
    objectType?: string
    showSubmit?: boolean
  }>(),
  {
    modelValue: false,
    objectType: 'WhiteListApply',
    showSubmit: true
  }
)

const route = useRoute()
const message = useMessage()
const userStore = useUserStore()

const formRef = ref()
const formLoading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const canModify = ref(false) //是否可以保存
const canDelete = ref(false) //是否可以删除

const resData = ref<Recordable | null>(null)
const flowtakVO = ref<Recordable>({});
// 弹框显示状态
const dialogVisible = ref(false)
// 表单数据
const formData = reactive<Recordable>({
  opinion: '', // 审批意见
  registerUser: '', // 登记人
  registerDate: '', // 登记日期
  registerOrg: '', // 登记机构
  objectType: props.objectType,
  showBusiness: false
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

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel','submit'])
/** 获取审批意见详情 */
const getApprovalOpinionDetail = async () => {
  try {
    formLoading.value = true
    const businessId = props.processInstance[0].serialNo
    flowtakVO.value = await getFlowTaskByObjNoAndTypeAndPhaseNoApi({"objectNo":businessId,"objectType":props.objectType,"phaseNo":props.processInstance[0].phaseNo})
    const res = await getApprovalOpinionDetailApi({
      businessId,
      objectType: props.objectType,
      ftSerialNo:flowtakVO.value?.serialNo
    })
    console.log('res,res', res)

    if (res) {
      // 如果有已保存的意见，则加载
      canModify.value = res.canModify
      resData.value = res
      canDelete.value = res.canDelete
      Object.assign(formData, res)
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
    await saveApprovalOpinion({
      ...formData,
      objectType: props.objectType,
      ftSerialNo:flowtakVO.value?.serialNo
    })

    message.success('保存成功')
    // dialogVisible.value = false
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
    saving.value = true 
    // 调用 API 提交审批意见
    await saveApprovalOpinion({
      ...formData,
      objectType: props.objectType,
      ftSerialNo:flowtakVO.value?.serialNo
    })

    emit('submit')
    handleClose()
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
    await removeApprovalOpinion({id: resData?.value?.businessId, objectType: props.objectType,ftSerialNo:flowtakVO.value?.serialNo})

    // 清空意见内容
    formData.opinion = ''

    message.success('删除成功')
    dialogVisible.value = false
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除审批意见失败:', error)
   
    }
  } finally {
    deleting.value = false
  }
}

/** 返回 */
const handleBack = () => {
  // router.back()
}

watch(
  [() => props.processInstance, () => props.todoTask],
  ([newProcess, newTask]) => {
    if (!newProcess || !newTask) return

    getApprovalOpinionDetail()
  },
  {
    immediate: false
  }
)

// 关闭弹框
const handleClose = () => {
  dialogVisible.value = false
  emit('update:modelValue', false)
}
</script>
