<script lang="ts" setup>
import Dialog from "../../Dialog/src/Dialog.vue";
import * as CreditFlowApi from "@/api/creditflow";

defineOptions({ name: 'CreditFlowApproval' })

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
    required: true
  },
  nextUserRoleRequired: {
    type: Boolean,
    default: true
  },
  nextUserInfoRequired: {
    type: Boolean,
    default: false
  },
  serialNo: {
    type: String,
    default: ''
  },
  phaseNo: {
    type: String,
    default: ''
  },
  phaseType: {
    type: String,
    default: ''
  },
  objectType: {
    type: String,
    default: ''
  },
  isBatchSubmit: {
    type: Boolean,
    default: false
  },
  selectedData: {
    type: Array,
    default: () => []
  }
})

const formRef = ref(null)
const formData = reactive({
  serialNo: '',
  phaseNo: '',
  objectType: '',
  nextUserRole: '',
  nextUserInfo: '',
  phaseType:""
})
const formRules = reactive({
  nextUserRole:[{required:props.nextUserRoleRequired,message:'请选择意见',trigger:'change'}],
  nextUserInfo:[{required:props.nextUserInfoRequired,message:'请选择动作',trigger:'change'}]
})

const isLoad = ref(false)
const submitting = ref(false)
const confirm = async () => {
  const valid = await formRef.value.validate().catch(()=>false)
  if (!valid) return

  try {
    submitting.value = true
    if(props.isBatchSubmit) {
      const selectedData: any[] = props?.selectedData ?? []
      for (const item of selectedData) {
        const params = {
          ...formData,
          serialNo: item.serialNo,
          phaseNo: item.phaseNo
        }
        await CreditFlowApi.submit(params)
      }
    }else {
      await CreditFlowApi.submit(formData)
    }
    ElMessage.success('提交成功')
    cancel()
    emit('confirm')
  } catch(e) {
    // ElMessage.error('提交失败')
    console.log(e)
  } finally {
    submitting.value = false
  }
}


const emit = defineEmits(['update:modelValue', 'cancel','refresh', 'confirm'])

const cancel = () => {
  emit('refresh')
  emit('update:modelValue', false)
}

const hiddenAprverInfArray = ref(false)

const onChange = () => {
  formData.nextUserInfo = ''

  nextUserRoles.value.forEach(a=> {
    if (formData.nextUserRole === a.opnnChosInf) {
      nextUserInfos.value = a.aprverInfArray
      hiddenAprverInfArray.value = a.hiddenAprverInfArray
      if(nextUserInfos.value.length === 1) {
        formData.nextUserInfo = nextUserInfos.value[0].aprverInf
      }
    }
  })

}

const nextUserRoles = ref([])
const nextUserInfos = ref([])

async function loadData() {
  try {
    isLoad.value = true
    console.log(props)
    formData.nextUserInfo = ''
    formData.serialNo = props.serialNo
    formData.phaseNo = props.phaseNo
    formData.objectType = props.objectType
    const res = await CreditFlowApi.getNextSelectUsers({
      serialNo: props.serialNo,
      phaseNo: props.phaseNo,
      objectType: props.objectType
    })
    console.log('选择人',res)
    nextUserRoles.value = res.stgInfArray ||[]
    if (nextUserRoles.value.length > 0) {
      formData.nextUserRole = nextUserRoles.value[0].opnnChosInf
      onChange()
    }

  } catch(e) {
    // ElMessage.error('加载数据失败')
    console.log(e)
    cancel()
  } finally {
    isLoad.value = false
  }
}
const visible = ref(false)
watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
    if (val) {
      loadData()
    }
  },
  {immediate:true}
)

</script>
<template>
  <Dialog
    :model-value="visible"
    title="选择审批人"
    :fullscreen="false"
    :append-to-body="true"
    width="600px"
    @close="cancel"
  >
    <el-form
      v-loading="isLoad"
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-position="right"
      label-width="80px"
    >
      <el-form-item>
        <el-form-item label="意见选择" prop="nextUserRole">
          <el-select
            v-model="formData.nextUserRole"
            placeholder="请选择意见"
            clearable
            class="!w-300px"
            @change="onChange"
          >
            <el-option
              v-for="item in nextUserRoles"
              :key="item.opnnChosInf"
              :label="item.opnnChosInf"
              :value="item.opnnChosInf"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="动作选择" prop="nextUserInfo" v-if="!hiddenAprverInfArray">
          <el-select
            v-model="formData.nextUserInfo"
            placeholder="请选择动作"
            clearable
            class="!w-300px"
          >
            <el-option
              v-for="item in nextUserInfos"
              :key="item.aprverInf"
              :label="item.aprverInf"
              :value="item.aprverInf"
            />
          </el-select>
        </el-form-item>
      </el-form-item>
    </el-form>


    <template #footer>
      <el-button tpye="" :loading="submitting" @click="confirm">确 认</el-button>
      <el-button @click="cancel">放 弃</el-button>
    </template>
  </Dialog>
</template>

<style scoped>
.el-form {
  display: block !important;
}
.el-form-item {
  display: block !important;
}
.el-form-item_label {
  display: block !important;
}
</style>
