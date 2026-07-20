<template>
  <Form ref="formRef" :schema="schema" :rules="rules" @register="register" :v-loading="loading">
    <template #excelDownload>
      <el-button @click="handleExcelDownload"> 下载 </el-button>
    </template>
    <template #importExcel>
      <div class="flex items-center">
        <el-upload
          v-model:file-list="fileList"
          :auto-upload="false"
          accept=".xls"
          :limit="1"
          :show-file-list="false"
          :on-change="handleUploadChange"
          :on-remove="handleFileRemove"
        >
          <el-button tpye="" plain> 选择文件 </el-button>
        </el-upload>
        <span class="ml-4">
          <span v-if="!selectedFile">未选择任何文件</span>
          <span v-if="selectedFile">{{ selectedFile?.name }}</span>
        </span>
      </div>
    </template>
  </Form>
</template>

<script setup lang="tsx">
import { FormExpose } from '@/components/Form'
import type { FormSchema } from '@/types/form'
import { useForm } from '@/hooks/web/useForm'
import {getModelName, templatesDownload} from '../../api'
import { downloadByUrl } from '@/utils/filt'
import { UploadFile } from 'element-plus'
import download from "@/utils/download";

const emit = defineEmits<{
  (e: 'close', args: { command: string; data?: any }): void
}>()

const loading = ref(false)
const formRef = ref<FormExpose>()
const { register, methods } = useForm()

const schema = reactive<FormSchema[]>([
  {
    field: 'projectName',
    label: '项目名称',
    component: 'Select',
    componentProps: {
      options: [],
      optionsAlias: {
        labelField: 'modelName',
        valueField: 'modelNo'
      }
    }
  },
  {
    field: 'excelDownload',
    label: 'Excel模版下载',
    component: 'Input'
  },
  {
    field: 'importExcel',
    label: 'Excel模版导入',
    component: 'UploadFile',
    componentProps: {
      fileType: ['xls'],
      isShowTip: false
    }
  }
])

const rules = {
  projectName: [
    {
      required: true,
      message: '请选择项目名称'
    }
  ],
  excelDownload: [
    {
      required: true,
      message: '',
      validator: (_rule, _value, callback) => {
        callback()
      }
    }
  ],
  importExcel: [
    {
      required: true,
      message: '请选择文件',
      validator: (_rule, _value, callback) => {
        if (!selectedFile.value) {
          callback(new Error('请选择文件'))
        } else {
          callback()
        }
      }
    }
  ]
}

// ====== 获取模型列表 ======
const modelList = ref<Recordable[]>([])
async function handleGetModelName() {
  loading.value = true
  const res = await getModelName().finally(() => (loading.value = false))
  modelList.value = res
  methods?.setSchema([
    {
      field: 'projectName',
      path: 'componentProps.options',
      value: res
    }
  ])
  methods?.setValues({
    projectName: res[0].modelNo
  })
}

onMounted(() => {
  handleGetModelName()
})

//  ====== 上传文件相关 ======
const fileList = ref<UploadFile[]>([])
const selectedFile = ref<File | null>(null)
const allowedTypes = ['xls']

const validateFileType = (file: File) => {
  const ext = file.name.split('.').pop()?.toLowerCase()
  return allowedTypes.includes(ext || '')
}

const handleUploadChange = (uploadFile: UploadFile) => {
  const file = uploadFile.raw as File
  if (!validateFileType(file)) {
    ElMessage.error(`当前仅支持.xls文件导入，请重新选择！`)
    fileList.value = []
    selectedFile.value = null
    return
  }
  selectedFile.value = file
}

const handleFileRemove = () => {
  selectedFile.value = null
  fileList.value = []
}

const handleExcelDownload = async () => {
  const formData = await methods.getFormData()
  const modelNo = formData?.projectName
  const model = modelList.value.find((item) => item.modelNo === modelNo)
  const data = await templatesDownload(modelNo)
  download.commonDownload(data, model?.modelName + "模板.xls")
}

defineExpose({
  async validate() {
    const elForm = formRef.value?.getElFormRef()
    const valid = await elForm?.validate().catch(() => false)
    if (valid) {
      const formData = await methods.getFormData()
      const modelNo = formData?.projectName
      return {file: selectedFile.value, modelNo }
    }
    return null
  },
  setValues(data: Recordable) {
    formRef.value?.setValues(data)
  }
})
</script>
