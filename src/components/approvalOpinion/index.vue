<template>
  <el-dialog
    v-model="dialogVisible"
    title="签署意见"
    width="75%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <ContentWrap>
      <!-- 标题和返回按钮 -->
      <!-- <div class="mb-20px flex items-center justify-between">
        <div class="text-18px font-bold">签署意见</div>
        <el-button @click="handleBack">返 回</el-button>
      </div> -->

      <!-- 申请信息 -->
      <!-- <div class="mb-20px p-15px bg-gray-50 rounded">
      <div class="text-14px">
        <span class="text-gray-600">申请编号：</span>
        <span class="font-medium">{{ applicationNo }}</span>
      </div>
    </div> -->

      <!-- Tab 标签页 -->
      <el-tabs v-model="activeTab" class="approval-opinion-tabs" @tab-change="handleTabChange">
        <el-tab-pane v-for="tab in tabList" :key="tab.value" :label="tab.label" :name="tab.value">
          <el-form
            :ref="(el) => setFormRef(el, tab.value)"
            v-loading="formLoading"
            :model="getTabFormData(tab.value)"
            :rules="formRules"
            label-width="140px"
          >
            <span  v-if ="contentShow" >
              <span style="color: red"
                >本次出账全部授信业务文件的签字盖章已履行面签手续，签章真实有效。本人愿意根据我行规定承担相应责任。尽职声明：本人已全面履行授信调查职责，</span
              >
              收集、制作纸质、电子资料以及上传系统电子影像件，均完整、真实、准确、有效，
              <span style="color: red">愿意根据我行规定承担尽职责任。</span>
            </span>

            <div class="mb-30px mt-20px">
              <el-collapse v-model="activeNames">
                <el-collapse-item title=" 意见信息" name ="1">
                  <el-form-item label="意见(限1000个汉字)" prop="approvalComment" required>
                    <el-input
                      v-model="getTabFormData(tab.value).approvalComment"
                      type="textarea"
                      :rows="10"
                      placeholder="请输入审批意见"
                      maxlength="2000"
                      show-word-limit
                      class="w-full"
                    />
                  </el-form-item>
                </el-collapse-item>
                <el-collapse-item title=" 操作信息" name ="2">
                   <!-- 操作信息 -->
                  <div class="mb-30px">
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <el-form-item label="登记人">
                          <el-input v-model="getTabFormData(tab.value).nickName" readonly />
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="登记日期">
                          <el-input v-model="getTabFormData(tab.value).oprDate" readonly />
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="登记机构">
                          <el-input v-model="getTabFormData(tab.value).orgName" readonly />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-collapse-item>
              </el-collapse>

              <!-- <div class="text-16px font-bold mb-15px flex items-center">
                意见信息
              </div>
             
              <el-form-item label="意见(限1000个汉字)" prop="approvalComment" required>
                <el-input
                  v-model="getTabFormData(tab.value).approvalComment"
                  type="textarea"
                  :rows="10"
                  placeholder="请输入审批意见"
                  maxlength="2000"
                  show-word-limit
                  class="w-full"
                />
              </el-form-item> -->
            </div>

           

            <!-- 操作按钮 -->
            <div class="flex justify-end gap-10px mt-30px">
              <el-button
                :loading="saving"
                v-if="getTabFormData(tab.value).canModify"
                @click="handleSave(tab.value)"
              >
                保 存
              </el-button>
              <el-button
                :loading="saving"
                v-if="getTabFormData(tab.value).canModify"
                @click="submit(tab.value)"
              >
                提 交
              </el-button>
              <el-button
                v-if="getTabFormData(tab.value).canDelete"
                type="danger"
                :loading="deleting"
                @click="handleDelete(tab.value)"
              >
                删除意见
              </el-button>
              <el-button
                :loading="saving"
                v-if="hideBack"
                @click="doMoreBack"
              >
                快捷退回/否决
              </el-button>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </ContentWrap>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate } from '@/utils/formatTime'
import { useUserStore } from '@/store/modules/user'
import { ElMessageBox,ElMessage } from 'element-plus'
import { bpmCommentApi as getApprovalOpinionlApi } from '@/components/approvalOpinion/api'
import {checkRoleIds } from '@/utils/permission'
import { submit } from '@/api/creditflow'
import { resolve } from 'dns'
import { rejects } from 'assert'
import useContract from '@/hooks/web/business/contract/useContract.js'

defineOptions({ name: 'ApprovalOpinion' })
// 折叠面板
const activeNames = ref(['1','2'])

const contentShow = ref(false)

const props =
  withDefaults(defineProps<{
    modelValue: boolean
    processInstance: any // 流程实例信息
    todoTask?: any // 待办任务
    hideTip?: boolean // 是否隐藏提示
    hideBack?: boolean
  }>(), {
    hideBack: false
  })


const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const formLoading = ref(false)
const saving = ref(false)
const submitting = ref(false)
const deleting = ref(false)

let taskVo = ref({})

// 弹框显示状态
const dialogVisible = ref(false)

// Tab 列表
const tabList = ref<Array<{ label: string; value: string }>>([])
const tabListLoading = ref(false)

// Tab 激活状态（默认第一个 tab）
const activeTab = ref<string>('')

// 申请编号（从路由参数获取）
// const applicationNo = ref<string>('')

// 表单引用（存储每个tab的表单引用）
const formRefs = ref<Record<string, any>>({})

// 每个tab的表单数据
const tabFormDataMap = ref<Record<string, any>>({})

// 获取当前tab的表单数据
const getTabFormData = (tabValue: string) => {
  if (!tabFormDataMap.value[tabValue]) {
    // 初始化tab表单数据
    tabFormDataMap.value[tabValue] = {
      approvalComment: '', // 审批意见
      nickName: '', // 登记人
      oprDate: '', // 登记日期
      orgName: '', // 登记机构
      objectType: 'CreditApply',
      showBusiness: false,
      canModify: true, // 默认可以保存（新数据时允许保存）
      canDelete: false, // 默认不可以删除（没有数据时不能删除）
      // 业务相关字段
      customerName: '',
      businessTypeName: '',
      baBusinessSum: '',
      baTermMonth: '',
      baExposureSum: '',
      businessCurrencyName: '',
      businessSum: '',
      termMonth: '',
      exposureSum: ''
    }
  }
  return tabFormDataMap.value[tabValue]
}

// 设置表单引用
const setFormRef = (el: any, tabValue: string) => {
  if (el) {
    formRefs.value[tabValue] = el
  }
}

// 表单校验规则
const formRules = reactive({
  approvalComment: [
    { required: true, message: '审批意见不能为空', trigger: 'blur' },
    { max: 2000, message: '审批意见不能超过2000个汉字', trigger: 'blur' }
  ]
})

const appTypeMap = {
  签署额度合同意见: 'BusinessContract',
  签署业务合同意见: 'BusinessContract',
  签署出账意见: 'PutOutApply',
}
const appNoTypeMap = {
  签署额度合同意见: 'edContractNo',
  签署业务合同意见: 'businessContractNo',
  签署出账意见: 'putOutNo'
}

// 监听外部传入的 modelValue
watch(
  () => props.modelValue,
  (val) => {
    dialogVisible.value = val
    if (val) {
       if(!props.hideTip && ("0015,0010,0030,0017".includes(props.processInstance.phaseNo) || checkRoleIds(['080','481','485']))){
        contentShow.value = true
       }
      // 弹框打开时，先获取Tab列表，再加载当前tab的数据
      getTabList().then(() => {
        if (activeTab.value) {
          getApprovalOpinionDetail(activeTab.value)
        }
      })
    }
  },
  { immediate: true }
)

// 监听内部 dialogVisible 变化，同步到外部
watch(dialogVisible, (val) => {
  emit('update:modelValue', val)
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel','submit','back'])

/** 获取Tab列表（模拟接口） */
const getTabList = async () => {
  try {
    tabListLoading.value = true
    // 从 processInstance 中获取某个字段（例如 businessKey 或 objectNo）
    // 这里使用 processInstance[0].objectNo 作为示例
    // const businessKey = props.processInstance?.[0]?.objectNo || props.processInstance?.businessKey || ''
    const res = await getApprovalOpinionlApi.getCheckOpinionTab(props.processInstance)
    const res2 = await getApprovalOpinionlApi.getRelativeObjNo(props.processInstance)

    console.log('resres', res, res2)

    // 模拟API请求
    // await new Promise((resolve) => setTimeout(resolve, 300))

    // 返回3个tab
    // const tabs = [
    //   { label: '签署出账意见', value: 'signPayment', objectType: 'putOuto' },
    //   {
    //     label: '签署业务合同意见',
    //     value: 'signBusinessContract',
    //     objectType: 'businessContractNo'
    //   },
    //   { label: '签署额度合同意见', value: 'signQuotaContract', objectType: 'edContractNo' }
    // ]

    const tabs = res.map((item) => {
      return {
        label: item,
        value: item,
        objectType: appTypeMap[item],
        businessId: res2[appNoTypeMap[item]]
      }
    })

    tabList.value = tabs

    console.log('tabsssssss', tabs)

    // 设置默认激活的tab
    if (tabs.length > 0) {
      activeTab.value = tabs[0].value
    }

    // 初始化所有tab的表单数据
    tabs.forEach((tab: any) => {
      const tabData = getTabFormData(tab.value)
      // 设置当前tab的objectType
      tabData.objectType = tab.objectType
      tabData.businessId = tab.businessId

      // 初始化操作信息（从用户信息获取）
      // tabData.nickName = userStore.getUser.nickname || ''
      tabData.oprDate = formatDate(new Date(), 'YYYY-MM-DD')
      tabData.orgName = (userStore.getUser as any).deptName || ''
      // 默认设置权限：可以保存，如果有数据可以删除
      tabData.canModify = true
      tabData.canDelete = tabData.id && tabData.canDelete // 如果有意见内容，则可以删除
    })
  } catch (error) {
    console.error('获取Tab列表失败:', error)
    message.error('获取Tab列表失败')
  } finally {
    tabListLoading.value = false
  }
}

/** 获取当前tab的审批意见详情 */
const getApprovalOpinionDetail = async (tabValue?: string) => {
  const currentTab = tabValue || activeTab.value
  if (!currentTab) return
  try {
    formLoading.value = true

    let businessId = ''
    let objectType = ''
    const tabData = getTabFormData(currentTab)
    if (props.processInstance.objectType === 'ProjectCoreviewGYL') {
      businessId = props.processInstance.businessId
      objectType = tabData.objectType = props.processInstance.objectType
    } else {
      businessId = tabData.businessId
      objectType = tabData.objectType
    }

    // const businessId =tabData.
    //   props.processInstance?.[0]?.objectNo || props.processInstance?.businessKey || ''
    // const objectType = tabData.objectType || ''

    taskVo.value = await getApprovalOpinionlApi.getFlowTaskByObjNoAndTypeAndPhaseNo({
      "objectNo":businessId,
      "objectType":objectType,
      "phaseNo":props.processInstance.phaseNo
    })

    // TODO: 调用真实API，这里先模拟
    const res = await getApprovalOpinionlApi.getDetail({
      businessId,
      objectType,
      "ftSerialNo": taskVo.value?.serialNo
    })

    Object.assign(tabData, res)
    console.log('resasdsadasd', res)
  } catch (error) {
    console.error('获取审批意见详情失败:', error)
    message.error('获取审批意见详情失败')
  } finally {
    formLoading.value = false
  }
}

/** Tab切换事件 */
const handleTabChange = (tabValue: string) => {
  // 切换tab时加载对应tab的数据
  getApprovalOpinionDetail(tabValue)
}
// /**判断保存时页签是否需要触发覆盖弹窗 */
// const checkTab = (flowNo:string ,tabValue: string) =>{
//   if ('CreditContractFlow' == flowNo && '签署额度合同意见' == tabValue) {
//     return true
//   }
//   return false
// }

// const check = () =>{
//   return new Promise((resolve,rejects)=>{
//     ElMessageBox.confirm(
//       '当前额度合同存在业务合同，是否覆盖签署意见？',
//       '确定',
//       {
//         distinguishCancelAndClose:true,
//         confirmButtonText:'确定',
//         cancelButtonText:'取消'
//       }
//     ).then(() => {
//       resolve('confirm')
//     }).catch((action: Action) => {
//        action === 'cancel'? resolve('cancel'):resolve('close')
//     })
//   })
  
// }

const {queryDataAndMakeSaveParam} = useContract();
/** 保存审批意见 */
const handleSave = async (tabValue?: string) => {
  const flowNo = props.processInstance?.flowNo;
  const currentTab = tabValue || activeTab.value
  if (!currentTab) return

  const formRef = formRefs.value[currentTab]
  if (!formRef) return

  try {
    const valid = await formRef.validate().catch(() => false)
    if (!valid) return

    saving.value = true

    const tabData = getTabFormData(currentTab)
    const { businessId, objectType } = tabData

    const saveParams = {
      ...tabData,
      businessId,
      objectType,
      "ftSerialNo": taskVo.value?.serialNo,
      "phaseNo":props.processInstance.phaseNo,
      flowNo,
      tabValue,
      "title": flowNo == 'CreditContractFlow' ? '当前额度合同存在业务合同，是否覆盖签署意见？':'当前业务合同存在出账，是否覆盖签署意见？'
    }


  // // if ('CreditContractFlow' == flowNo) {
  //     //额度合同获取业务合同，业务合同获取出账 公用此接口
  //   const busiCon =  await getApprovalOpinionlApi.getBusiConByCreditCon(
  //      {"objectNo":props.processInstance.businessId,
  //      "phaseNo":props.processInstance.phaseNo,
  //      flowNo
  //      })

  //      if (busiCon != null && busiCon.length > 0 && checkTab(flowNo,tabValue)) {
  //         //判断是多合一
  //         const checkResult = await check()

  //         if (checkResult === 'confirm') { //用户点击确定按钮
  //           saveParams.override = '1'
  //         }else if(checkResult === 'close'){ //用户点击右上角xx
  //             return;
  //         }else if(checkResult === 'cancel'){ //用户点击取消，调用接口走不覆盖逻辑

  //         }
         
  //      }
  // // }

        //调用hooks 取数组装保存参数
    const newParams = await queryDataAndMakeSaveParam(saveParams);

    // TODO: 调用真实API保存
    await getApprovalOpinionlApi.saveApprovalOpinion(newParams)

    // 模拟保存（实际使用时需要传递 tabData、businessId 和 objectType）
    // console.log('保存数据:', { tabData, businessId, objectType, currentTab })
    // await new Promise((resolve) => setTimeout(resolve, 300))

    message.success('保存成功')
    // dialogVisible.value = false
  } catch (error) {
    console.error('保存审批意见失败:', error)
    // message.error('保存审批意见失败')
  } finally {
    saving.value = false
  }
}


/** 我i叫加审批意见 */
const  submit = async (tabValue?: string) => {
  const currentTab = tabValue || activeTab.value
  if (!currentTab) return

  const formRef = formRefs.value[currentTab]
  if (!formRef) return

  try {
    const valid = await formRef.validate().catch(() => false)
    if (!valid) return

    saving.value = true

    const tabData = getTabFormData(currentTab)
    const { businessId, objectType } = tabData

    // TODO: 调用真实API保存
    await getApprovalOpinionlApi.saveApprovalOpinion({
      ...tabData,
      businessId,
      objectType,
      "ftSerialNo": taskVo.value?.serialNo
    })

    // 模拟保存（实际使用时需要传递 tabData、businessId 和 objectType）
    // console.log('保存数据:', { tabData, businessId, objectType, currentTab })
    // await new Promise((resolve) => setTimeout(resolve, 300))

    // message.success('保存成功')
    emit('submit',activeTab.value == tabList.value[0].value ? 1 : 2)
    dialogVisible.value = false
  } catch (error) {
    console.error('提交失败:', error)
    // message.error('提交失败')
  } finally {
    saving.value = false
  }
}

/** 提交审批意见 */
const handleSubmit = async (tabValue?: string) => {
  const currentTab = tabValue || activeTab.value
  if (!currentTab) return

  const formRef = formRefs.value[currentTab]
  if (!formRef) return

  try {
    const valid = await formRef.validate().catch(() => false)
    if (!valid) return

    await ElMessageBox.confirm('确定要提交审批意见吗？提交后将无法修改。', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    submitting.value = true
    const tabData = getTabFormData(currentTab)
    const businessId =
      props.processInstance?.[0]?.objectNo || props.processInstance?.businessKey || ''
    const objectType = tabData.objectType || ''

    // TODO: 调用真实API提交
    await submitApprovalOpinion({
      ...tabData,
      businessId,
      objectType
    })

    // 模拟提交（实际使用时需要传递 tabData、businessId 和 objectType）
    // console.log('提交数据:', { tabData, businessId, objectType, currentTab })
    // await new Promise((resolve) => setTimeout(resolve, 300))

    message.success('提交成功')

    // 提交成功后关闭弹框
    // handleClose()
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
const handleDelete = async (tabValue?: string) => {
  const currentTab = tabValue || activeTab.value
  if (!currentTab) return

  try {
    const tabData = getTabFormData(currentTab)
    if (!tabData.approvalComment) {
      message.warning('当前没有审批意见可删除')
      return
    }

    await ElMessageBox.confirm('确定要删除当前审批意见吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    deleting.value = true

    // const businessId =
    //   props.processInstance?.[0]?.objectNo || props.processInstance?.businessKey || ''
    // const objectType = tabData.objectType || ''

    // TODO: 调用真实API删除
    await getApprovalOpinionlApi.removeApprovalOpinion({"id":tabData.businessId,"ftSerialNo": taskVo.value?.serialNo})

    // 模拟删除（实际使用时需要传递 businessId 和 objectType）
    // console.log('删除数据:', { businessId, objectType, currentTab })
    // await new Promise((resolve) => setTimeout(resolve, 300))

    // 清空意见内容
    tabData.approvalComment = ''
    tabData.canDelete = false // 删除后不能再删除
    tabData.canModify = true // 删除后可以重新保存
    dialogVisible.value = false
    message.success('删除成功')
  } catch (error: any) {
    // if (error !== 'cancel') {
    //   console.error('删除审批意见失败:', error)
    //   message.error('删除审批意见失败')
    // }
  } finally {
    deleting.value = false
  }
}

const doMoreBack = () => {
  emit('back')
  dialogVisible.value = false
}

/** 返回 */
const handleBack = () => {
  router.back()
}

watch(
  () => props.processInstance,
  (newProcess) => {
    if (!newProcess) return

    // 当 processInstance 变化时，重新获取Tab列表
    if (dialogVisible.value) {
       getTabList().then(() => {
        if (activeTab.value) {
          getApprovalOpinionDetail(activeTab.value)
        }
      })
    }
  },
  {
    immediate: false
  }
)

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
