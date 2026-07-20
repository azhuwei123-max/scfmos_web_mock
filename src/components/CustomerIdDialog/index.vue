<template>                            
  <Dialog
    :model-value="dialogVisible"
    @update:model-value="handleDialogVisibleChange"
    :title="title"
    :width="width"
    :append-to-body="true"
    :loading="addLoading"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="140px"
     
    >
      <el-form-item label="选择机构类型" prop="CustomerOrgType" required>
        <el-select
          v-model="formData.CustomerOrgType"
          placeholder="请选择机构类型"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="option in orgTypeOptions"
            :key="option.itemNo"
            :label="option.itemName"
            :value="option.itemNo"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="是否NRA标识" prop="NraFlag" required>
        <el-select
          v-model="formData.NraFlag"
          placeholder="请选择是否NRA标识"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="option in nraFlagOptions"
            :key="option.itemNo"
            :label="option.itemName"
            :value="option.itemNo"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="选择证件类型" prop="CertType" required>
        <div class="flex items-center gap-10px">
          <el-select
            v-model="formData.CertType"
            placeholder="请选择证件类型"
            clearable
            style="width: 250px"
          >
            <el-option
              v-for="option in certTypeOptions"
              :key="option.itemNo"
              :label="option.itemName"
              :value="option.itemNo"
            />
          </el-select>
          <el-button
            v-if="formData.CertType === 'Ent02'"
            tpye=""
            @click="handleOpenOcrDialog"
          >
            OCR识别
          </el-button>
        </div>
      </el-form-item>

      <el-form-item label="证件号码" prop="CertID" required>
        <el-input
          v-model="formData.CertID"
          placeholder="请输入证件号码"
          clearable
          style="width: 100%"
          :maxlength="50"
        />
      </el-form-item>

      <el-form-item label="证件号码确认" prop="CertID1" required>
        <el-input
          v-model="formData.CertID1"
          placeholder="请再次输入证件号码"
          clearable
          style="width: 100%"
          :maxlength="50"
        />
      </el-form-item>

      <el-form-item label="客户名称" prop="CustomerName" required>
        <el-input
          v-model="formData.CustomerName"
          placeholder="请输入客户名称"
          clearable
          style="width: 100%"
          :maxlength="100"
        />
      </el-form-item>

      <el-form-item label="企业中征码" prop="LoanCardNo">
        <el-input
          v-model="formData.LoanCardNo"
          placeholder="请输入企业中征码"
          clearable
          style="width: 100%"
          :maxlength="50"
        />
      </el-form-item>

      <el-form-item label="控股类型" prop="OrgTypeName" v-if="showOrgType">
        <el-input
          v-model="formData.OrgTypeName"
          placeholder="请选择控股类型"
          readonly
          style="width: 100%"
        >
          <template #append>
            <Icon icon="ep:more" class="cursor-pointer" @click="openOrgTypePop" />
          </template>
        </el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button tpye="" :loading="saving" @click="handleConfirm">确认</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </template>
  </Dialog>

  <treeListPop
    ref="orgTypeRef"
    append-to-body
    @confirm="handleOrgTypeConfirm"
  />

  <!-- OCR识别上传对话框 -->
  <Dialog v-model="ocrUploadDialogVisible" title="OCR识别" width="500px" :append-to-body="true">
    <div class="ocr-upload-content">
      <!-- 已上传图片预览 -->
      <div v-if="uploadedImageUrl" class="uploaded-image-preview">
        <img :src="uploadedImageUrl" class="preview-image" alt="上传的图片" />
        <div class="image-overlay">
          <el-button type="" circle @click="handleFileRemove">
            <Icon icon="ep:delete" />
          </el-button>
        </div>
      </div>

      <!-- 上传区域 -->
      <el-upload
        v-else
        ref="uploadRef"
        :multiple="true"
        :auto-upload="false"
        :limit="1"
        :on-change="handleFileChange"
        :on-remove="handleFileRemove"
        :before-upload="beforeUpload"
        :file-list="fileList"
        :accept="buildAcceptByExts(exts)"
        drag
        class="ocr-uploader"
      >
        <div class="upload-empty">
          <Icon icon="ep:upload-filled" class="upload-icon" />
          <div class="upload-text">点击或拖拽图片到此处上传</div>
          <div class="upload-tip">只能上传一张图片，支持 {{ exts.join('、') }} 格式</div>
        </div>
      </el-upload>

      <!-- 提交按钮 -->
      <div v-if="uploadedImageUrl" class="upload-actions">
        <el-button tpye="" :loading="ocrSubmitting" @click="handleSubmitOcr">
          提交识别
        </el-button>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleCloseOcrDialog">关闭</el-button>
    </template>
  </Dialog>

  <!-- OCR识别处理中提示框 -->
  <Dialog
    v-model="ocrProcessingVisible"
    title="识别中"
    width="400px"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <div class="ocr-processing-content">
      <el-icon class="is-loading processing-icon">
        <Loading />
      </el-icon>
      <div class="processing-text">处理中，请稍后...</div>
    </div>
  </Dialog>

</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from 'vue'
import { UploadFile, UploadProps, UploadInstance, ElMessageBox } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { useMessage } from '@/hooks/web/useMessage'
import { addCustomerApi } from './api'
import { Icon } from '@/components/Icon'
import { OcrRecognitionApi } from '@/components/OcrRecognitionDialog/api'
import { getDictLabel, getIntDictOptions } from '@/utils/dict'
import { validateUploadFile,buildAcceptByExts } from '@/utils/fileValidate'
import treeListPop from '@/components/dynamicForm/components/treeListPop.vue'


const message = useMessage()


defineOptions({ name: 'CustomerIdDialog' })

interface Props {
  modelValue: boolean
  title?: string
  width?: string
  addLoading?:boolean
  showOrgType?: boolean
  /** 初始数据 */
  initialData?: {
    CustomerName?: string
    CustomerType?: string
    CustomerOrgType?: string
    CertType?: string
    CertID?: string
    CertID1?: string
    LoanCardNo?: string
    NraFlag?: string
    projectNo?: string
    OrgType?: string
    OrgTypeName?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  title: '企业客户信息',
  width: '600px',
  showOrgType: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [
    data: {
      CustomerName: string
      CustomerType?: string
      CustomerOrgType: string
      CertType: string
      CertID: string
      CertID1: string
      LoanCardNo?: string
      NraFlag: string
      OrgType?: string
      OrgTypeName?: string
    }
  ]
  cancel: []
}>()



const exts = computed(()=> getIntDictOptions('ocrUploadFileWhiteList').map(item => item.label))
// console.log('exts',exts);


const formRef = ref()
const saving = ref(false)

// 机构类型选项
const orgTypeOptions = ref([
  { label: '法人企业', value: '法人企业' },
  { label: '非法人企业', value: '非法人企业' },
  { label: '其他', value: '其他' }
])

// 是否NRA标识选项
const nraFlagOptions = ref([
  { label: '是', value: '是' },
  { label: '否', value: '否' }
])

// 证件类型选项（企业证件类型）
const certTypeOptions = ref([
  { label: '组织机构代码证', value: '组织机构代码证' },
  { label: '营业执照', value: '营业执照' },
  { label: '统一社会信用代码证', value: '统一社会信用代码证' },
  { label: '其他', value: '其他' }
])

// OCR上传相关
const ocrUploadDialogVisible = ref(false)
const uploadRef = ref<UploadInstance>()
const fileList = ref<UploadFile[]>([])
const uploadedImageUrl = ref('')
const uploadedImageFile = ref<File | null>(null)
const ocrSubmitting = ref(false)
const ocrProcessingVisible = ref(false)

const formData = reactive({
  CustomerName: '', // 客户名称
  CustomerType: '', // 客户类型
  CustomerOrgType: '', // 机构类型
  CertType: '', // 证件类型
  CertID: '', // 证件号码
  CertID1: '', // 证件号码确认
  LoanCardNo: '', // 企业中征码
  NraFlag: '', // 是否NRA标识
  OrgType: '', // 控股类型
  OrgTypeName: ''
})

const customerNameValidate = (rule, value, callback) => {
  if (!checkChineseName(value, formData.customerType)) {
    callback(new Error('客户名称不能包含特殊字符'))
    return
  }
  callback()
}

// 表单验证规则
const formRules = {
  CustomerOrgType: [{ required: true, message: '请选择机构类型', trigger: 'change' }],
  NraFlag: [{ required: true, message: '请选择是否NRA标识', trigger: 'change' }],
  CertType: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
  CertID: [
    { required: true, message: '请输入证件号码', trigger: 'blur' },
    {
      validator: (_rule: any, value: string, callback: Function) => {
        if (/[\u4e00-\u9fa5]/.test(value)) {
          callback(new Error('证件号码不能包含汉字'))
          return
        }
        if (/[？?！!^]/.test(value)) {
          callback(new Error('证件号码不能包含？?！!^'))
          return
        }
        callback()
      },
      trigger: ['blur','change']
    },
    { min: 6, max: 50, message: '证件号码长度为6-50位', trigger: 'blur' }
  ],
  CertID1: [
    { required: true, message: '请再次输入证件号码', trigger: 'blur' },
    {
      validator: (_rule: any, value: string, callback: Function) => {
        if (value !== formData.CertID) {
          callback(new Error('两次输入的证件号码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  CustomerName: [
    { required: true, message: '请输入客户名称', trigger: 'blur' },
    { validator: customerNameValidate, trigger: 'blur' },
    { min: 2, max: 30, message: '客户名称长度为2-30位', trigger: 'blur' }
  ],
  OrgTypeName: [{ required: true, message: '请选择控股类型', trigger: 'blur' }]
}

const mloading = ref(false)

// 监听弹框显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const getCustomerOrgType = async () => {
  const res = await addCustomerApi.getCustomerOrgType()
  orgTypeOptions.value = res
}

const getCodeLibraryList = async () => {
  const res = await addCustomerApi.getCodeLibraryList({ codeNo: 'YesNo' })
  nraFlagOptions.value = res
}
const getEntCertType = async () => {
  const res = await addCustomerApi.getEntCertType()
  // console.log('res',res);

  certTypeOptions.value = res
}

onMounted(() => {
  getCustomerOrgType()
  getCodeLibraryList()
  getEntCertType()
})

// 监听初始数据变化
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formData.CustomerName = newData.CustomerName || ''
      formData.CustomerType = newData.CustomerType || ''
      formData.CustomerOrgType = newData.CustomerOrgType || ''
      formData.CertType = newData.CertType || ''
      formData.CertID = newData.CertID || ''
      formData.CertID1 = newData.CertID1 || newData.CertID || ''
      formData.LoanCardNo = newData.LoanCardNo || ''
      formData.NraFlag = newData.NraFlag || ''
      formData.OrgType = newData.OrgType || ''
      formData.OrgTypeName = newData.OrgTypeName || ''
    }
  },
  { immediate: true, deep: true }
)

// 监听弹框显示，重置表单
watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      // 如果有初始数据，使用初始数据
      if (props.initialData) {
        formData.CustomerName = props.initialData.CustomerName || ''
        formData.CustomerType = props.initialData.CustomerType || ''
        formData.CustomerOrgType = props.initialData.CustomerOrgType || '0101'
        formData.CertType = props.initialData.CertType || 'Ent02'
        formData.CertID = props.initialData.CertID || ''
        formData.CertID1 = props.initialData.CertID1 || props.initialData.CertID || ''
        formData.LoanCardNo = props.initialData.LoanCardNo || ''
        formData.NraFlag = props.initialData.NraFlag || '2'
        formData.OrgType = props.initialData.OrgType || ''
        formData.OrgTypeName = props.initialData.OrgTypeName || ''
      } else {
        // 否则重置表单
        resetForm()
      }
    }
  }
)

const checkCertIDValidity = (params: Object) => {
  return new Promise((resolve, rej) => {
    addCustomerApi.checkCertIDValidity(params).then((res) => {
      const type = res.data
      if (!['40', '70', '80', '100'].includes(type)) return resolve(true)

      ElMessageBox.confirm('此客户为黑名单客户，您是否确定新增该客户？', '提示', {
        type: 'warning'
      }).then(resolve).catch(rej)
    }).catch(rej)
  })
}

const orgTypeRef = ref()
const openOrgTypePop = ()=> {
  orgTypeRef.value?.open({colactualname: "credit.getItemName('OrgType',OrgType)"})
}
// 控股类型选择
const handleOrgTypeConfirm = (item)=> {
  formData.OrgType = item.key
  formData.OrgTypeName = item.title
}


// 确认
const handleConfirm = async () => {
  
  try {
   
    await formRef.value?.validate()
    saving.value = true
    mloading.value = true
    // 验证证件号码一致性
    if (formData.CertID !== formData.CertID1) {
      message.error('两次输入的证件号码不一致')
      saving.value = false
      return
    }
    // 构建提交数据
    const confirmData: {
      CustomerName: string
      CustomerType?: string
      CustomerOrgType: string
      CertType: string
      CertID: string
      CertID1: string
      LoanCardNo?: string
      NraFlag: string,
      ProjectNo: any,
      OrgType?: string
    } = {
      CustomerName: formData.CustomerName,
      CustomerOrgType: formData.CustomerOrgType,
      CertType: formData.CertType,
      CertID: formData.CertID,
      CertID1: formData.CertID1,
      NraFlag: formData.NraFlag,
      ProjectNo: props.initialData?.projectNo || null
    }

    // 添加可选字段
    if (formData.CustomerType) {
      confirmData.CustomerType = formData.CustomerType
    }
    if (formData.LoanCardNo) {
      confirmData.LoanCardNo = formData.LoanCardNo
    }

    if(formData.OrgType) {
      confirmData.OrgType = formData.OrgType
    }

     mloading.value = true

    await checkCertIDValidity(confirmData).finally(() => {
       saving.value = false
       mloading.value = false
    })
    emit('confirm', confirmData)
    // dialogVisible.value = false
    // message.success('操作成功')
  } catch (error) {
    console.error('表单验证失败:', error)
    // message.warning('请完善表单信息')
    // mloading.value = false
  } finally {
    // saving.value = false
    // mloading.value = false
  }
}



// 取消
const handleCancel = () => {
  dialogVisible.value = false
  emit('cancel')
}
// 取消
const hideLoading = () => {
  mloading.value = false
  // emit('cancel')
}



// 重置表单
const resetForm = () => {
  formData.CustomerName = ''
  formData.CustomerType = ''
  formData.CustomerOrgType = ''
  formData.CertType = ''
  formData.CertID = ''
  formData.CertID1 = ''
  formData.LoanCardNo = ''
  formData.NraFlag = ''
  formData.OrgType = ''
  formData.OrgTypeName = ''
  formRef.value?.clearValidate()
}

// 处理弹框显示状态变化
const handleDialogVisibleChange = (visible: boolean) => {
  dialogVisible.value = visible
  if (!visible) {
    resetForm()
  }
}

// 打开OCR上传对话框
const handleOpenOcrDialog = () => {
  if (!formData.CertType) {
    message.warning('请先选择证件类型')
    return
  }
  if (formData.CertType !== 'Ent02') {
    message.warning('支持统一社会信用代码证')
    return
  }
  ocrUploadDialogVisible.value = true
  // 重置上传状态
  fileList.value = []
  uploadedImageUrl.value = ''
  uploadedImageFile.value = null
}

// 关闭OCR上传对话框
const handleCloseOcrDialog = () => {
  ocrUploadDialogVisible.value = false
  fileList.value = []
  uploadedImageUrl.value = ''
  uploadedImageFile.value = null
}

// 文件选择变化
const handleFileChange = (file: UploadFile) => {
  if (file.raw) {
    const validateFile =  validateUploadFile(file.raw,{
      accept:exts.value,
      maxSize:Number(5),
      onError:(msg)=>{ 
        message.error(msg) 
      }
    })
    
    if(!validateFile) return

    uploadedImageFile.value = file.raw
    // 创建预览URL
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedImageUrl.value = e.target?.result as string
      if (file.url !== uploadedImageUrl.value) {
        file.url = uploadedImageUrl.value
      }
    }
    reader.readAsDataURL(file.raw)
  }
}

// 文件移除
const handleFileRemove = () => {
  uploadedImageUrl.value = ''
  uploadedImageFile.value = null
}

// 上传前验证
const beforeUpload: UploadProps['beforeUpload'] = (rawFile: File) => {
  // const isImage = rawFile.type.startsWith('image/')
  // const isLt5M = rawFile.size / 1024 / 1024 < 5

  return validateUploadFile(rawFile,{
      accept:exts.value,
      maxSize:Number(5),
      onError:(msg)=>{ 
        message.error(msg) 
      }
    })

  // if (!isImage) {
  //   message.error('只能上传图片文件！')
  //   return false
  // }
  // if (!isLt5M) {
  //   message.error('图片大小不能超过 5MB！')
  //   return false
  // }
  // return false // 阻止自动上传
}

// 提交OCR识别
const handleSubmitOcr = async () => {
  if (!uploadedImageFile.value) {
    message.warning('请先上传图片')
    return
  }

  ocrSubmitting.value = true
  ocrProcessingVisible.value = true

  try {
    // TODO: 调用真实的 OCR 识别接口
    const formDataToSend = new FormData()
    formDataToSend.append('multipartFile', uploadedImageFile.value)
    formDataToSend.append('certtype', formData.CertType)
    formDataToSend.append('customertype', props.initialData.CustomerType)
    console.log('rawFile', formDataToSend, uploadedImageFile.value, formDataToSend)

    console.log('是否是 FILE对象', uploadedImageFile.value instanceof File)

    // const params = {
    //   multipartFile:uploadedImageFile.value,
    //   customertype:
    //   certtype:
    // }
    const res = await OcrRecognitionApi.recognize(formDataToSend)

    console.log('dasdasdas', res)

    // if (res && res.code === 0 && res.data) {
    //   formData.certNumber = res.data.certNumber || ''
    //   formData.certNumberConfirm = res.data.certNumber || ''
    //   formData.customerName = res.data.name || ''
    //   message.success('OCR识别成功')
    //   handleCloseOcrDialog()
    // } else {
    //   message.error(res?.msg || 'OCR识别失败')
    // }

    // Mock OCR 识别请求（模拟2-3秒的识别过程）
    // await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000))

    // 模拟识别结果（80%成功率）
    // const isSuccess = Math.random() > 0.2

    if (res.data) {
      // 生成 mock 数据
      // const mockData = generateMockOcrData('身份证')
      formData.CertID = res.data.certid
      formData.CertID1 = res.data.certid
      formData.CustomerName = res.data.customername

      message.success('OCR识别成功')
      handleCloseOcrDialog()
    } else {
      message.error('OCR识别失败，请重新上传图片')
    }
  } catch (error) {
    console.error('OCR识别失败:', error)
    message.error('OCR识别失败，请重试')
  } finally {
    ocrSubmitting.value = false
    ocrProcessingVisible.value = false
  }
}

//公司客户：名称含有中文，且含有特殊字符，返回false；否则返回true;
//个人，同业:名称含有特殊字符，返回false；否则返回true;
const checkChineseName = (sCustomerName, sCustomerType = '') => {
  const filter1 = /[\u4e00-\u9fa5]{1,}/ // /[\u4E00-\u9FA5\uF900-\uFA2D]{1,}/;
  const filter2 = /[*~!！@#$%^\[\]{}><'‘’“”\\\/?？=+￥、【】|…]{1,}/
  if (sCustomerType.substring(0, 2) == '01') {
    return !(filter1.test(sCustomerName) && filter2.test(sCustomerName))
  } else if (sCustomerType.substring(0, 2) == '03' || sCustomerType.substring(0, 2) == '04') {
    return !filter2.test(sCustomerName)
  } else {
    return true
  }
}


defineExpose({
  hideLoading,
  saving
})

</script>

<style scoped lang="scss">
// 可以添加自定义样式
.flex.items-center.gap-10px {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ocr-upload-content {
  padding: 20px 0;
}

.ocr-uploader {
  width: 100%;

  :deep(.el-upload) {
    width: 100%;
  }

  :deep(.el-upload-dragger) {
    width: 100%;
    padding: 40px 20px;
  }
}

.upload-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-secondary);

  .upload-icon {
    font-size: 48px;
    margin-bottom: 16px;
    color: var(--el-color-primary);
  }

  .upload-text {
    font-size: 14px;
    margin-bottom: 8px;
  }

  .upload-tip {
    font-size: 12px;
    color: var(--el-text-color-placeholder);
  }
}

.uploaded-image-preview {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--el-border-color);

  .preview-image {
    width: 100%;
    max-height: 400px;
    object-fit: contain;
    display: block;
  }

  .image-overlay {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 10px;
  }
}

.upload-actions {
  margin-top: 20px;
  text-align: center;
}

.ocr-processing-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  min-height: 150px;

  .processing-icon {
    font-size: 48px;
    color: var(--el-color-primary);
    margin-bottom: 20px;
    animation: rotating 2s linear infinite;
  }

  .processing-text {
    font-size: 16px;
    color: var(--el-text-color-regular);
  }
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
