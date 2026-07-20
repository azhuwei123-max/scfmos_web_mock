<template>
  <Dialog
    :model-value="dialogVisible"
    @update:model-value="handleDialogVisibleChange"
    :title="title"
    :width="width"
    :append-to-body="true"
    :loading="addLoading"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px">
      <el-form-item label="选择证件类型" prop="CertType" required>
        <div class="flex items-center gap-10px">
          <el-select
            v-model="formData.CertType"
            placeholder="请选择证件类型"
            clearable
            style="width: 200px"
            @change="changeCertType"
          >
            <el-option
              v-for="option in certTypeOptions"
              :key="option.sortNo"
              :label="option.itemName"
              :value="option.sortNo"
            />
          </el-select>
          <el-button
            v-if="formData.CertType === 'Ind01'"
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
          :maxlength="30"
        />
      </el-form-item>

      <el-form-item label="证件号码确认" prop="CertID1" required>
        <el-input
          v-model="formData.CertID1"
          placeholder="请再次输入证件号码"
          clearable
          style="width: 100%"
          :maxlength="30"
        />
      </el-form-item>

      <el-form-item label="客户名称" prop="CustomerName" required>
        <el-input
          v-model="formData.CustomerName"
          placeholder="请输入客户名称"
          clearable
          style="width: 100%"
          :maxlength="50"
        />
      </el-form-item>

      <!-- 护照：国别和护照到期日 -->
      <template v-if="formData.CertType === 'Ind03'">
        <el-form-item label="国别" prop="CountryName" required>
          <el-input
            v-model="formData.CountryName"
            placeholder="请选择国别"
            clearable
            readonly
            style="width: 100%"
            :maxlength="50"
          >
            <template #append>
              <el-button @click="handleSelectNationality">
                <Icon icon="ep:more" />
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="护照到期日" prop="MaturityDate" required>
          <el-date-picker
            v-model="formData.MaturityDate"
            type="date"
            placeholder="请选择护照到期日"
            style="width: 100%"
            value-format="YYYY/MM/DD"
            format="YYYY/MM/DD"
          />
        </el-form-item>
      </template>

      <!-- 香港身份证、澳门身份证：国别 -->
      <el-form-item
        v-if="formData.CertType === 'Ind12' || formData.CertType === 'Ind13'"
        label="国别"
        prop="CountryName"
        required
      >
        <el-input
          v-model="formData.CountryName"
          placeholder="请选择国别"
          clearable
          readonly
          style="width: 100%"
          :maxlength="50"
        >
          <template #append>
            <el-button @click="handleSelectNationality">
              <Icon icon="ep:more" />
            </el-button>
          </template>
        </el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button tpye="" :loading="saving" @click="handleConfirm">确认</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </template>
  </Dialog>

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

  <!-- 国别选择对话框 -->
  <NationalityCascaderDialog
    v-model="nationalityDialogVisible"
    :beforeConfirm="countryname_beforeConfirm"
    @confirm="handleNationalityConfirm"
    @cancel="handleNationalityCancel"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed, onMounted } from 'vue'
import type { UploadFile, UploadProps, UploadInstance } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { Dialog } from '@/components/Dialog'
import { useMessage } from '@/hooks/web/useMessage'
import { Icon } from '@/components/Icon'
import { NationalityCascaderDialog } from '@/components/NationalityCascaderDialog'
// TODO: 接口对接后，取消下面的注释，启用接口请求
 import { OcrRecognitionApi } from '@/components/OcrRecognitionDialog/api'
 import {addCustomerApi} from "@/components/CustomerIdDialog/api";
 import { getDictLabel, getIntDictOptions } from '@/utils/dict'
import { validateUploadFilem,buildAcceptByExts } from '@/utils/fileValidate'
// import { transformIdTypeOptions, type IdTypeOptionRaw } from '@/views/customer/personal/const/detail'
// 当前使用写死数据作为默认值
// import { idTypeOptions as defaultIdTypeOptions } from '@/views/customer/personal/const/detail'

const message = useMessage()

defineOptions({ name: 'OcrRecognitionDialog' })

const exts = computed(()=> getIntDictOptions('ocrUploadFileWhiteList').map(item => item.label))
// console.log('exts',exts);

interface Props {
  modelValue: boolean
  title?: string
  width?: string
  addLoading?:boolean
  /** 初始数据 */
  initialData?: {
    CustomerName?: string
    CustomerType?: string
    CertType?: string
    CertID?: string
    CertID1?: string
    LoanCardNo?: string
    CountryCode?: string
    CountryName?:string
    MaturityDate?: string
    CustomerOrgType?: string
    NraFlag?: string
    projectNo?:string
  }
}

const props = withDefaults(defineProps<Props>(), {
  title: 'OCR识别',
  width: '600px'
})

// 证件类型选项（支持从接口获取或使用默认值）
const certTypeOptionsList = ref([])
const certTypeOptionsLoading = ref(false)

/**
 * 获取证件类型选项（从接口获取）
 * 当前未启用，接口对接后可以取消注释并启用
 *
 * 注意：此函数当前未使用，会在接口对接后启用，lint 警告可忽略
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchIdTypeOptions = async () => {
  try {
    certTypeOptionsLoading.value = true

    // TODO: 接口对接后，取消下面的注释，启用接口请求
    // 注意：需要先在文件顶部取消注释以下导入：
    // import { IdTypeApi } from '@/api/customer/idType'
    // import { transformIdTypeOptions, type IdTypeOptionRaw } from '@/views/customer/personal/const/detail'
    //
    // 方式1：如果后端接口返回的是原始格式（codeNo, itemNo, itemName, sortNo）
     const apiOptionsRaw = await OcrRecognitionApi.indCertTypeList()
    if (apiOptionsRaw && apiOptionsRaw.length > 0) {
      // 将后端格式转换为前端格式
      certTypeOptionsList.value = apiOptionsRaw
      return
    }
    //
    // 方式2：如果后端接口已经返回转换后的格式（label, value）- 推荐使用此方式
    // const apiOptions = await IdTypeApi.getIdTypeOptions()
    // if (apiOptions && apiOptions.length > 0) {
    //   certTypeOptionsList.value = apiOptions
    //   return
    // }

    // 接口未对接或请求失败时，使用默认的写死数据
    // certTypeOptionsList.value = defaultIdTypeOptions
  } catch (error) {
    console.error('获取证件类型选项失败，使用默认数据:', error)
    // 失败时使用默认数据
    certTypeOptionsList.value = defaultIdTypeOptions
  } finally {
    certTypeOptionsLoading.value = false
  }
}

// 证件类型选项（computed，用于模板）
const certTypeOptions = computed(() => certTypeOptionsList.value)

// 组件挂载时获取证件类型选项
onMounted(() => {
  // TODO: 接口对接后，取消下面的注释，启用接口请求
  // 注意：需要先在文件顶部取消注释 import { IdTypeApi } from '@/api/customer/idType'
   fetchIdTypeOptions()
  // 当前使用默认的写死数据，无需调用接口
  // 接口对接后，取消上面的注释，启用 fetchIdTypeOptions() 调用
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [
    data: {
      CustomerName: string
      CustomerType?: string
      CertType: string
      CertID: string
      CertID1: string
      LoanCardNo?: string
      CountryCode?: string
      CountryName?:string
      MaturityDate?: string
      CustomerOrgType?: string
      NraFlag?: string
      ProjectNo?:string
    }
  ]
  cancel: []
}>()

const formRef = ref()
const saving = ref(false)

// OCR上传相关
const ocrUploadDialogVisible = ref(false)
const uploadRef = ref<UploadInstance>()
const fileList = ref<UploadFile[]>([])
const uploadedImageUrl = ref('')
const uploadedImageFile = ref<File | null>(null)
const ocrSubmitting = ref(false)
const ocrProcessingVisible = ref(false)

// 国别选择对话框
const nationalityDialogVisible = ref(false)

const formData = reactive({
  CustomerName: '', // 客户名称
  CustomerType: '', // 客户类型
  CertType: '', // 证件类型
  CertID: '', // 证件号码
  CertID1: '', // 证件号码确认
  LoanCardNo: '', // 贷款卡编号
  CountryCode: '', // 国别（护照、香港身份证、澳门身份证需要）
  CountryName:'',
  MaturityDate: '', // 护照到期日（护照需要）
  CustomerOrgType: '', // 机构类型
  NraFlag: '' // 是否NRA标识
})

const certIDValidate = (rule, value, callback) => {
  if (!value) return callback()
  
  if (/[?？！!\^]/.test(value)) {
    callback(new Error('证件号码不能包含“？”、“?”、“！”、“!”、“^”'))
    return
  }
  callback()
}

// 表单验证规则
const formRules = {
  CertType: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
  CertID: [
    { required: true, message: '请输入证件号码', trigger: 'blur' },
    { min: 6, max: 30, message: '证件号码长度为6-30位', trigger: 'blur' },
    { validator: certIDValidate, trigger: 'blur' }
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
    },
    { validator: certIDValidate, trigger: 'blur' }
  ],
  CustomerName: [
    { required: true, message: '请输入客户名称', trigger: 'blur' },
    { min: 2, max: 50, message: '客户名称长度为2-50位', trigger: 'blur' }
  ],
  CountryName: [
    {
      validator: (_rule: any, value: string, callback: Function) => {
        const needNationality =
          formData.CertType === '护照' ||
          formData.CertType === '香港身份证' ||
          formData.CertType === '澳门身份证'
        if (needNationality && !value) {
          callback(new Error('请输入国别'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  MaturityDate: [
    {
      validator: (_rule: any, value: string, callback: Function) => {
        if (formData.CertType === '护照' && !value) {
          callback(new Error('请选择护照到期日'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

// 监听弹框显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})


const modelLoading =ref(false)

// 监听初始数据变化
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formData.CustomerName = newData.CustomerName || ''
      formData.CustomerType = newData.CustomerType || ''
      formData.CertType = newData.CertType || ''
      formData.CertID = newData.CertID || ''
      formData.CertID1 = newData.CertID1 || newData.CertID || ''
      formData.LoanCardNo = newData.LoanCardNo || ''
      formData.CountryCode = newData.CountryCode || ''
      formData.MaturityDate = newData.MaturityDate || ''
      formData.CustomerOrgType = newData.CustomerOrgType || ''
      formData.NraFlag = newData.NraFlag || ''
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
        formData.CertType = props.initialData.CertType || ''
        formData.CertID = props.initialData.CertID || ''
        formData.CertID1 = props.initialData.CertID1 || props.initialData.CertID || ''
        formData.LoanCardNo = props.initialData.LoanCardNo || ''
        formData.CountryCode = props.initialData.CountryCode || ''
        formData.MaturityDate = props.initialData.MaturityDate || ''
        formData.CustomerOrgType = props.initialData.CustomerOrgType || ''
        formData.NraFlag = props.initialData.NraFlag || ''
      } else {
        // 否则重置表单，但默认选择身份证
        resetForm()
        formData.CertType = ''
      }
    }
  }
)

// 打开OCR上传对话框
const handleOpenOcrDialog = () => {
  if (!formData.CertType) {
    message.warning('请先选择证件类型')
    return
  }
  if (formData.CertType !== 'Ind01') {
    message.warning('OCR识别仅支持身份证')
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

    console.log('file.raw',file.raw);
    
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
const beforeUpload = (rawFile) => {
  // const isImage = rawFile.type.startsWith('image/')
  // const isLt5M = rawFile.size / 1024 / 1024 < 5

  // if (!isImage) {
  //   message.error('只能上传图片文件！')
  //   return false
  // }
  // if (!isLt5M) {
  //   message.error('图片大小不能超过 5MB！')
  //   return false
  // }
  // return false // 阻止自动上传

  console.log('exts.value',exts.value);
  

  return validateUploadFile(rawFile,{
      accept:exts.value,
      maxSize:Number(5),
      onError:(msg)=>{ 
        message.error(msg) 
      }
    })
}

const handleUploadFile =(data)=> {
   
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
    console.log('rawFile',formDataToSend, uploadedImageFile.value,formDataToSend);
    
    console.log('是否是 FILE对象',uploadedImageFile.value instanceof File);
    
    // const params = {
    //   multipartFile:uploadedImageFile.value,
    //   customertype:
    //   certtype:
    // }
    const res = await OcrRecognitionApi.recognize(formDataToSend)

    console.log('dasdasdas',res);
     
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

// 生成 mock OCR 数据
const generateMockOcrData = (certType: string) => {
  const mockDataMap: Record<string, { certNumber: string; customerName: string }> = {
    身份证: {
      certNumber: '110101199001011234',
      customerName: '张三'
    },
    护照: {
      certNumber: 'E12345678',
      customerName: '李四'
    },
    港澳居民来往内地通行证: {
      certNumber: 'HA200100000001',
      customerName: '王五'
    },
    台湾居民来往大陆通行证: {
      certNumber: 'TB200100000001',
      customerName: '赵六'
    },
    外国人永久居留身份证: {
      certNumber: '123456789012345',
      customerName: 'John Smith'
    },
    其他: {
      certNumber: 'OTHER123456',
      customerName: '其他用户'
    }
  }

  return (
    mockDataMap[certType] || {
      certNumber: 'MOCK' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      customerName: '识别用户'
    }
  )
}


const changeCertType = (data) => {
   console.log('data',data)
}

// 确认
const handleConfirm = async () => {
  try {
    await formRef.value?.validate()
    saving.value = true
   

    // 验证证件号码一致性
    if (formData.CertID !== formData.CertID1) {
      message.error('两次输入的证件号码不一致')
      saving.value = false
      return
    }

    modelLoading.value = true

    // 构建提交数据，按照后端 DTO 格式
    const confirmData: {
      CustomerName: string
      CustomerType?: string
      CertType: string
      CertID: string
      CertID1: string
      LoanCardNo?: string
      CountryCode?: string
      MaturityDate?: string
      CustomerOrgType?: string
      NraFlag?: string,
      ProjectNo?: any
    } = {
      CustomerName: formData.CustomerName,
      CertType: formData.CertType,
      CertID: formData.CertID,
      CertID1: formData.CertID1,
      ProjectNo: props.initialData?.projectNo || null
    }

    // 添加可选字段
    if (formData.CustomerType) {
      confirmData.CustomerType = formData.CustomerType
    }
    if (formData.LoanCardNo) {
      confirmData.LoanCardNo = formData.LoanCardNo
    }
    if (formData.CustomerOrgType) {
      confirmData.CustomerOrgType = formData.CustomerOrgType
    }
    if (formData.NraFlag) {
      confirmData.NraFlag = formData.NraFlag
    }

    // 根据证件类型添加额外字段
    if (formData.CertType === '护照') {
      if (formData.CountryCode) {
        confirmData.CountryCode = formData.CountryCode
      }
      if (formData.MaturityDate) {
        confirmData.MaturityDate = formData.MaturityDate
      }
    } else if (formData.CertType === '香港身份证' || formData.CertType === '澳门身份证') {
      if (formData.CountryCode) {
        confirmData.CountryCode = formData.CountryCode
      }
    }
    
    await checkCertIDValidity(confirmData).finally(() => {
       saving.value = false
       modelLoading.value = false
    })

    emit('confirm', confirmData)

    //  dialogVisible.value = false
    // message.success('操作成功')
  } catch (error) {
    console.error('表单验证失败:', error)
    //message.warning('请完善表单信息')
    //  modelLoading.value = false
  } finally {
  //  console.log('asdasd');
   
    // saving.value = false
    // modelLoading.value = false
  }
}

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

// 取消
const handleCancel = () => {
  dialogVisible.value = false
  emit('cancel')
}

// 重置表单（不设置默认证件类型，由调用方决定）
const resetForm = () => {
  formData.CustomerName = ''
  formData.CustomerType = ''
  formData.CertType = ''
  formData.CertID = ''
  formData.CertID1 = ''
  formData.LoanCardNo = ''
  formData.CountryCode = ''
  
  formData.MaturityDate = ''
  formData.CustomerOrgType = ''
  formData.NraFlag = ''
  formRef.value?.clearValidate()
}

// 处理弹框显示状态变化
const handleDialogVisibleChange = (visible: boolean) => {
  dialogVisible.value = visible
  if (!visible) {
    resetForm()
  }
}

// 打开国别选择对话框
const handleSelectNationality = () => {
  nationalityDialogVisible.value = true
}

// 确认选择国别
const handleNationalityConfirm = (vals) => {
  formData.CountryCode = vals.nationalityValue
  formData.CountryName = vals.lastTitle
  
  message.success(`已选择国别：${vals.lastTitle}${vals.nationalityValue}`)
}

// 取消选择国别
const handleNationalityCancel = () => {
  // 取消操作，无需处理
}

// 国籍选择校验
const countryname_beforeConfirm = (item) => {
  if (['Ind09', 'Ind03', 'Ind17'].includes(formData['CertType'])
    && ['142', '143', '144', '145'].includes(item)) {
      ElMessage.warning('证件类型为护照、外国人居留证或外国人永久居留身份证时，国籍不得选择中国')
      return false
  }

  return true
}


const hideLoading = () => {
  modelLoading.value = false
  // emit('cancel')
}


defineExpose({
  hideLoading,
  saving
})
</script>

<style scoped lang="scss">
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
