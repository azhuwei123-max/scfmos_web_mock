<template>
  <ContentWrap v-loading="loading">
      <ActionBar :buttons="visibleBtns" />
      <dynamicForm
          ref="dynamicFormRef"
          :dockList="dockList"
          :formData="formData"
          :formTempList="formTempList"
          :customVisible="customVisible"
          label-width="auto"
          @pop-confirm="popConfirm"
          @select-input-click="formSelectInputClick"
          @select-change="formSelectChange"
          @render-finished="formRendering = false"

        >
        <template  #ModelApplyInfoRelativePart>
          <ModelApplyInfoRelativePart v-if="formData?.callscope =='01'" :formData="formData" @zancun="handlezancun"/>
          <ModelApplyInfoRelativePart v-else-if="formData?.callscope =='02'" :formData="formData" @zancun="handlezancun" />
          <div v-else>
            请选择调用范围
          </div>
        </template>
        <template #UploadFilePart="{ formInfo }">
          <div class="flex items-start gap-4">
            <div class="text-md flex-shrink-0">{{ formInfo?.dockname }}</div>
            <div class="upload-wrapper">
             <el-upload
               v-if="!readonly"
               action=""
               :show-file-list="false"
               :on-success="handleUploadSuccess"
               :http-request="customUpload"
               :disabled="readonly"
               :before-upload="fileBeforeUpload"
             >
               <el-button v-if="route.query?.type != 'readonly'" tpye="" small :icon="Paperclip">添加附件</el-button>
             </el-upload>
             <div class="file-display-container">
               <el-tag
                 v-for="(fileName,index) in formData.uploadfile"
                 :key="index"
                 closable
                 @click="downloadFile(fileName)"
                 @close="removeFile(index)"
                 class="file-tag"
               >
                 {{fileName.name}}
               </el-tag>
             </div>
            </div>
          </div>
        </template>
        <!-- <template  #ModelApplyInfoRelativePart>
          <ModelApplyInfoRelativePart v-if="formData?.callscope =='01'" :formData="formData" @zancun="handlezancun"/>
          <ModelApplyInfoRelativePart v-else-if="formData?.callscope =='02'" :formData="formData" @zancun="handlezancun" />
          <div v-else>
            请选择调用范围
          </div>
        </template> -->
      </dynamicForm>
  </ContentWrap>
</template>

<script setup lang="tsx">
import useFormChange from '@/views/assistApprProject/assistApprDetail/hooks/useFormChange'
import { getTemplateInfo, getTemplateValue, paramAdjustSaveApply,tempSave } from '../api'
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import { useEmitt } from '@/hooks/web/useEmitt'
import ModelApplyInfoRelativePart from './components/ModelApplyInfoRelativePart/index.vue'
import * as commonApi from "@/api/common";
import {Paperclip} from "@element-plus/icons-vue";
import download from "@/utils/download";
import { useTagsView } from '@/hooks/web/useTagsView'
import { getDictLabel, getIntDictOptions } from '@/utils/dict'
import { validateUploadFile } from '@/utils/fileValidate'



defineOptions({
  name: 'modelConstructionDetail'
})

const message = useMessage() // 消息弹窗


const exts = computed(()=> getIntDictOptions('uploadFileWhiteList').map(item => item.label))
// const uploadAccept = computed(()=> buildAcceptByExts(exts.value))
const templateNo = 'ModelApplyInfo'
const route = useRoute()
const router = useRouter()
const routeQuery = computed(() => {
  return {
    serialNo: (route.query.serialno || '') as string
  }
})

const loading = ref(false)
const activeTabName = ref('BasicPart_HEAD')
const activeIndex = computed(()=> {
  return tempTabsList.value.findIndex(f=> f.dockid === activeTabName.value)
})

const isEdit = computed(() => {
  return route.query?.type === 'edit'
})


const isReadly = computed(() => {
  return route.query?.type === 'readonly'
})

const readonly = computed(() => (route.query.readonly) === '1') 


// 表单模块集合
const dockList = reactive([])

// 表单模板配置集合
const formTempList = ref<Recordable[]>([])

onBeforeMount(() => {
  handleTempData()
})

// ====== 获取并处理模板、模板数据 ======
const dynamicFormRef = ref()
const activeDynamicFormRef = computed(()=> {
  console.log('dynamicFormRef.value?.[activeIndex.value]',dynamicFormRef.value);
  
  return dynamicFormRef.value?.[activeIndex.value] ?? null

})
const formRendering = ref(true)

const tempTabsList = ref<Recordable[]>([])
const formData = reactive<Recordable>({})
async function handleTempData() {
  try {
    loading.value = true
    const temp = await getTemplateInfo({ templateNo })
    const tempValue = await getTemplateValue({
      templateNo: templateNo,
      serialNo: routeQuery.value.serialNo
    })
    console.log('tempValue',tempValue,temp);
    
    if(tempValue?.tempsaveflag ==='2') {
      hiddenZancun.value= true  
    }
    // formTempList.value = res?.templates || []
      // dockList.push(...(temp?.docks || []))
    dockList.push(
      ...(temp?.docks || []).map((item) => ({
        ...item,
        slotName: item.dockid
      }))
    )
      formTempList.value = temp?.templates || []
      formTempList.value = formTempList.value.map(m=> ({
        ...m,
        slotName: m.colname
      }))
      Object.assign(formData, tempValue)
    // nextTick(()=> {
    //   Object.assign(formData, activeDynamicFormRef.value?.formDataFixToShow(tempValue) ?? tempValue) // 这里重新取数后，要作数据转换
    // })
    const fileList = await commonApi.getFileListByBusinessId({businessId: routeQuery.value.serialNo})
    formData.uploadfile = fileList
  } finally {
    loading.value = false
  }
}

// 所有弹窗选择ref
const mapRefs = ref({})
const setMapRef = (el, key) => {
  mapRefs.value[`select${key}InputRef`] = el
}

// 表单动态事件处理
const { formSelectChange, formSelectInputClick, customVisible, customRequired } = useFormChange(
  { formData },
  { dynamicFormRef, mapRefs }
)

const popConfirm = (colname: string, row: Recordable) => {
  switch (colname) {
    case 'rzdbcustomername':
      formData.rzdbcustomername = row.customerName
      formData.rzdbcustomerid = row.customerId
      break
    case 'jgfcustomername':
      formData.jgfcustomername = row.customerName
      formData.jgfcustomerid = row.customerId
      break
    case 'directionname': // 贷款投向
      formData.direction = row.key
      formData.directionname = row.title
      break
    case 'farmingtypename': // 支农分类
      formData.farmingtype = row.key
      formData.farmingtypename = row.title
      break
    case 'vouchtypename': // 主要担保方式
      formData.vouchtype = row.key
      formData.vouchtypename = row.title
      break
    default:
      break
  }
}
const hiddenZancun = ref(false)
// ====== 操作按钮 ======
const btns = ref<ActionButton[]>([
  {
    key: 'save',
    label: '保存',
    loading: false,
    plain: true,
    onClick: (btn) => save(btn),
    show:()=> {
     return route.query?.type != 'readonly'
    }
  },
  {
    key: 'zancun',
    label: '暂存',
    loading: false,
    plain: true,
    show:()=> {
     return route.query?.type != 'readonly'  && !hiddenZancun.value
    },
    // show:()=> {
    //  return !readonly
    // },
    // show:()=> {
    //  return isEdit.value
    // },
    onClick: (btn) => zancun(btn)
  },
  // {
  //   key: 'add',
  //   label: '新增',
  //   loading: false,
  //   plain: true,
  //   show:()=> {
  //    return !isEdit.value
  //   },
  //   onClick: (btn) => add(btn)
  // },
])



const handleRefresTempValue =async () =>{
  const tempValue = await getTemplateValue({
      templateNo: templateNo,
      serialNo: routeQuery.value.serialNo
    })

    if(tempValue?.tempsaveflag ==='2') {
      hiddenZancun.value  = true
    }
    console.log('tempValuehandleRefresTempValue',tempValue);
}


const visibleBtns = computed(()=> {
  return btns.value
})

const viewHistory = (btn: ActionButton) => {
    
}

//====== 保存 ======
const { emitter } = useEmitt()
const saveApplyMap = {
  'CreditPart_HEAD': 'creditadjust',
  'ContractPart_HEAD': 'putoutadjust',
  'OperationsPart_HEAD': 'operateadjust',
  'SCPart_HEAD': 'gylbranchadjust'
}

const fileMax = getDictLabel('config','fileMax') ?? 20 // 没配置的话默认20M 
// console.log('fileMax',fileMax);

const fileBeforeUpload = (file) => {

//  const uploadFileWhiteList =  getIntDictOptions('uploadFileWhiteList').map(item => item.label)

  return validateUploadFile(file,{
      accept:exts.value,
      maxSize:Number(fileMax),
      onError:(msg)=>{ 
        message.error(msg) 
      }
    })
  // let format = '.' + file.name.split('.')[1]
  // if (format !== fileAccept) {
  //   message.error(`请上传指定格式"${fileAccept}"文件`)
  //   return false
  // }
  // let isRightSize = file.size / 1024 / 1024 < fileMax
  // if (!isRightSize) {
      
  //   ElMessage.error(`文件大小超过 ${fileMax}MB`)
  // }
  // return isRightSize
}



const { closeCurrent } = useTagsView()
const save = async (btn: ActionButton) => {
  const valid =await  dynamicFormRef.value?.validate()
  // console.log('validata',validata);

  if (!valid) return



  btn.loading = true
  const saveKey = saveApplyMap[activeTabName.value]
  const form = dynamicFormRef.value?.formDataFixToSave()
 
  const ModelRelativeReqVos = []
  const params = {
    ...form,
    ModelRelativeReqVos,
    tempsaveflag:'2'
  }
  console.log('formformform2222',params);
  if(params.debtproject) {
    delete params.debtproject
  }
  params[saveKey] = 1
  await paramAdjustSaveApply(params).finally(()=> btn.loading = false)
  ElMessage.success('保存成功')
  emitter.emit('refresh-ParamAdJustApplyList')
  handleRefresTempValue()

  // setTimeout(() => {
  //       closeCurrent(null, () => {
  //         router.push({
  //          path:'modeApplication'
  //         })
  //       })
  //     }, 300)
 
}

const zancun = async (btn: ActionButton) => {
  btn.loading = true
  const saveKey = saveApplyMap[activeTabName.value]
  const form = dynamicFormRef.value?.formDataFixToSave()
  console.log('formformform',form);
  const ModelRelativeReqVos = []
  const params = {
    ...form,
    ModelRelativeReqVos,
    tempsaveflag:'1'
  }
  if(params.debtproject) {
    delete params.debtproject
  }
  params[saveKey] = 1
  await tempSave(params).finally(()=> btn.loading = false)
  ElMessage.success('保存成功')
  emitter.emit('refresh-ParamAdJustApplyList')
}


const add = async (btn: ActionButton) => {
  btn.loading = true
  // const saveKey = saveApplyMap[activeTabName.value]
  const form = dynamicFormRef.value?.formDataFixToSave()
  console.log('formformform',form);
  const ModelRelativeReqVos = []
  const params = {
    ...form,
    ModelRelativeReqVos
  }
  if(params.debtproject) {
    delete params.debtproject
  }
  // params[saveKey] = 1
  await tempSave(params).finally(()=> btn.loading = false)
  ElMessage.success('保存成功')
  emitter.emit('refresh-ParamAdJustApplyList')
  router.push({
    path:"modeApplication"
  })
}


const handlezancun = async(params) =>{
  const form = dynamicFormRef.value?.formDataFixToSave()
  console.log('formformform',form,params);
  // const ModelRelativeReqVos = (form?.ModelRelativeReqVos ?? []).push(params) 

  
  // if(!form || !('ModelRelativeReqVos' in form)) {
  //   form.ModelRelativeReqVos = []
  // }
  // console.log('ModelRelativeReqVos',form);

  
  const Noparms = {
    ...form,
    ModelRelativeReqVos:params
  }
  await tempSave(Noparms).finally(()=> {})
  ElMessage.success('保存成功')

  emitter.emit('refresh-ParamAdJustApplyList')
}

// ====== 上传附件相关 ======
const customUpload = async (options) => {
  const {file,onSuccess,onError} = options;
  const req = new FormData()
  req.append('file',file);
  req.append('temp','false');
  req.append('businessType', 'GYLModelApply');
  req.append('businessId', routeQuery.value.serialNo);
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
  const fileName = response.data.fileName
  console.log('zzzz',response)
  formData.uploadfile = [...(formData?.uploadfile ?? []), {id:response.data.fileId,name:fileName}]
  // formData.uploadfile.push(fileName)
}

const removeFile = async (index) => {
  // console.log('readonly',readonly.value,route.query?.type);
  
  if(readonly.value || route.query?.type ==='readonly') return
  if(formData.uploadfile) {
    await ElMessageBox.confirm('是否删除该附件', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    console.log('zzzz',formData.uploadfile)
    const res = await commonApi.delByFile(formData.uploadfile[index].id)
       
    formData.uploadfile.splice(index,1)
  }
}


const downloadFile = async (fileName) => {
  const data = await commonApi.downloadFile({fileName: fileName.name})
  download.commonDownload(data, fileName.name)
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
