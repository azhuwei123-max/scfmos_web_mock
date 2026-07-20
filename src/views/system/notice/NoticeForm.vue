<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="800">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="80px"
    >
      <el-form-item label="公告标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入公告标题" :readonly="isReadonly" />
      </el-form-item>
      <el-form-item label="公告内容" prop="content">
        <Editor v-if="!isReadonly" v-model="formData.content" height="150px" />
        <div class="border rounded py-1 px-2.5 w-full" v-else v-html="formData.content"></div>
      </el-form-item>
      <el-form-item label="公告类型" prop="type">
        <el-select v-model="formData.type" clearable placeholder="请选择公告类型" :disabled="true">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_NOTICE_TYPE)"
            :key="parseInt(dict.value as any)"
            :label="dict.label"
            :value="parseInt(dict.value as any)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="附件" prop="content">
        <div class="upload-wrapper">
          <el-upload
            v-if="!isReadonly"
            action=""
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :http-request="customUpload"
            :disabled="isReadonly"
            :before-upload="fileBeforeUpload"
          >
            <el-button tpye="" small :icon="Paperclip">添加附件</el-button>
          </el-upload>
          <div class="file-display-container">
            <el-tag
              v-for="(fileName,index) in formData.files"
              :key="index"
              closable
              @click="downloadFile(fileName)"
              @close="removeFile(index)"
              class="file-tag"
            >
              {{fileName}}
            </el-tag>
          </div>
        </div>
    </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="formData.status" clearable placeholder="请选择状态" :disabled="isReadonly">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="parseInt(dict.value as any)"
            :label="dict.label"
            :value="parseInt(dict.value as any)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输备注" type="textarea" :readonly="isReadonly" />
      </el-form-item>
    </el-form>
    <template #footer v-if="!isReadonly">
      <el-button :disabled="formLoading" tpye="" @click="submitForm">确 定</el-button>
      <el-button @click="cancelForm">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getDictLabel,getIntDictOptions } from '@/utils/dict'
import { CommonStatusEnum } from '@/utils/constants'
import * as NoticeApi from '@/api/system/notice'
import * as commonApi from "@/api/common";
import {Paperclip} from "@element-plus/icons-vue";
import * as ClueApi from "@/api/crm/clue";
import download from "@/utils/download";
import {deleteNoticeFile} from "@/api/system/notice";

import { validateUploadFile } from '@/utils/fileValidate'

defineOptions({ name: 'SystemNoticeForm' })

const props = withDefaults(defineProps<
{
  isReadonly?: boolean
}
>(), {
  isReadonly: false
})

const exts = computed(()=> getIntDictOptions('uploadFileWhiteList').map(item => item.label))


const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData: any = ref({
  id: undefined,
  title: '',
  type: 2,
  content: '',
  status: CommonStatusEnum.ENABLE,
  files: [],
  remark: ''
})
const formRules = reactive({
  title: [{ required: true, message: '公告标题不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '公告类型不能为空', trigger: 'change' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'change' }],
  content: [{ required: true, message: '公告内容不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await NoticeApi.getNotice(id)
      formData.value.files = formData.value.files||[]
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as NoticeApi.NoticeVO
    if (formType.value === 'create') {
      await NoticeApi.createNotice(data)
      message.success(t('common.createSuccess'))
    } else {
      await NoticeApi.updateNotice(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    title: '',
    type: 2,
    content: '',
    status: CommonStatusEnum.ENABLE,
    remark: '',
    files: []
  }
  formRef.value?.resetFields()
}


const customUpload = async (options) => {
  const {file,onSuccess,onError} = options;
  const req = new FormData()
  req.append('file',file);
  req.append('temp','false');
  try {
    const res = await commonApi.updateFile(req)

    console.log(res)

    onSuccess(res)
  } catch (error) {
    console.log('上传失败',error)
    onError(error)
  }
}

const handleUploadSuccess = (response) => {
  console.log('33',response.data.fileName)
  const fileName = response.data.fileName
  formData.value.files.push(fileName)
  ElMessage.success('上传成功')
}

const removeFile = async (index) => {
  if(props.isReadonly) return
  if(formData.value.files) {
    console.log('id',formData.value.id)
    await ElMessageBox.confirm('是否删除该附件', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    if (formData.value.id) {
      await NoticeApi.deleteNoticeFile(formData.value.id,formData.value.files[index])
    } else {
      await commonApi.delByFile("",formData.value.files[index])
    }
    formData.value.files.splice(index,1)
  }
}

const cancelForm = async () => {
  if (formData.value.files && !formData.value.id) {
    formData.value.files.forEach(a => commonApi.delByFile("",a))
  }
  dialogVisible.value = false
}

const downloadFile = async (fileName) => {
  const data = await commonApi.downloadFile({fileName: fileName})
  download.commonDownload(data, fileName)
}



const fileMax = getDictLabel('config','fileMax') ?? 20 // 没配置的话默认20M 
const fileBeforeUpload = (file) => {
  return validateUploadFile(file,{
      accept:exts.value,
      maxSize:Number(fileMax),
      onError:(msg)=>{ 
        message.error(msg) 
      }
    })
}


</script>
<style scoped>
.upload-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width:100%;
}

.file-display-container {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.file-tag {
  cursor: pointer;
  transition: all 0.3s;
}

.file-tag:hover {
  background-color: var(--el-color-primary-light-8);
  border-color: var(--el-color-primary);
}
</style>
