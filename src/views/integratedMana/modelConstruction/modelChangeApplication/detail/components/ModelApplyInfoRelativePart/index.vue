<template>
  <!-- <Search :schema="searchSchema" @search="search" @reset="reset" /> -->
  <ActionBar :buttons="partenterPartBtns" />
  <tempTable
    ref="partenterPartTempTableRef"
    :api-func="modelDetailListReq"
    :templateApiFunc="AgetTemplateValue"
    :params="partenterPartListParams"
    :fetchCback="getPartenterPartFetchCback"
  />
</template>

<script setup lang="tsx">
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import {
  modelDetailListReq,
  getSimpleTemplateInfo,
  getTemplateInfo,
  dealApplyPartenterInfo,
  deleteModelRelativeReq
} from '../../../api'
// import simpleForm2 from '@/components/dynamicForm/simpleForm2/index.vue'
import { addDialog } from '@/components/Dialog'
// import { KeysToLowerCase } from '@/utils'
import useFormChange from './hooks/useFormChange'
import Participantname from './pronameList.vue'
import { useUserStoreWithOut } from '@/store/modules/user'


// import { FormSchema } from '@/types/form'
// import dayjs from 'dayjs'

const route = useRoute()
const userStore = useUserStoreWithOut()

const props = defineProps({
  formData:Object
})

const emit = defineEmits(['zancun'])

// const searchSchema = ref<FormSchema[]>([
//   {
//     label: '合作商名称',
//     field: 'partentername',
//     component: 'Input'
//   }
// ])

// const getList = (hxXzFlag = false)=> {
//   // return  modelDetailListReq({...partenterPartListParams.value})
//   return hxXzFlag ? new Promise((resolve)=> {
//     resolve( {
//      list:[{
//       "relativeno": "1",
//       "productname": "2"
//     }]
//     })
//   }) : modelDetailListReq({...partenterPartListParams.value})
// }

const templateNo = computed(()=> {
  return props.formData?.callscope  =='01' ?'ModelApplyInfoRelative1': "ModelApplyInfoRelative2"
})


const AgetTemplateValue  = () => {
  return getSimpleTemplateInfo({serialNo:route.query.serialno,templateNo:props.formData?.callscope  =='01' ?'ModelApplyInfoRelative1': "ModelApplyInfoRelative2"})
}

const partenterPartTempTableRef = ref()
const partenterPartListParams = ref({
  serialNo: route.query.serialno,
  templateNo
})

const search = (model) => {
  partenterPartTempTableRef.value.queryParams.partentername = model.partentername
  partenterPartTempTableRef.value?.search()
}
const reset = () => {
  partenterPartTempTableRef.value?.reSearch()
}

const nowList = ref([])
const getPartenterPartFetchCback = (list) => {
  console.log('[ list ] >', list)
  nowList.value = list
}


// const getPartenterPartFetchCback = (list) => {
//   console.log('[ list ] >', list)
// }


const isShow =['0010','3000'].includes(route.query.phaseNo)

const partenterPartBtns = ref<ActionButton[]>([
  {
    key: 'add',
    label: '新增',
    icon: 'ep:circle-plus',
    plain: true,
    loading: false,
    show:isShow,
    onClick: (btn) => partenterPartAdd(btn)
  },
  {
    key: 'add',
    label: '删除',
    icon: 'ep:delete',
    plain: true,
    show:isShow,
    onClick: (btn) => delPartenterPart(btn)
  }
])
const dynamicFormRef = ref()
// 所有弹窗选择ref
const mapRefs = ref({})
const setMapRef = (el, key) => {
  mapRefs.value[`select${key}InputRef`] = el
}
const partenterPartFormData = reactive<Recordable>({})
const partenterPartFormTempList = ref([])
// 表单动态事件处理
const {formSelectChange, customVisible: partenterPartCustomVisible, customRequired: partenterPartCustomRequired } =
  useFormChange({ partenterPartFormData }, { dynamicFormRef, mapRefs })
let addPartenterPartFormRef: any = null
const validateOnRuleChange = ref(false)

const partenterPartAdd = async (btn: ActionButton) => {
  btn.loading = true
  console.log('propscallscope',props.formData.callscope);
  if(!props.formData.callscope) {
    btn.loading = false
    ElMessage.warning('请先选择调用范围')
    return
  }

  if(props.formData.callscope === '01' && nowList.value.length>0) {
      btn.loading = false
      ElMessage.warning('只能新增一条')
      return
    }
  const callscope =  props.formData.callscope =='01' ? 'ModelApplyInfoRelative1': "ModelApplyInfoRelative2"
  
  const res = await getTemplateInfo({
    serialNo:route.query.serialno,
    templateNo:callscope,
  }).finally(() => (btn.loading = false))
  console.log('reshahsdhasdh',res);
  
  partenterPartFormTempList.value = res.templates.map((item) => ({
    ...item
  }))

  for (let key in partenterPartFormData) {
    partenterPartFormData[key] = ''
  }
  // ;((partenterPartFormData.inputusername = userStore.user.nickname),
  //   (partenterPartFormData.inputtime = dayjs().format('YYYY/MM/DD HH:MM:ss')))
  // partenterPartFormData.inputorgname = userStore.dept.name
  // console.log('partenterPartFormTempList',partenterPartFormTempList);
  addDialog({
    title: '调用范围',
    width: '600px',
    top: '100px',
    contentRenderer: () => (
      <div>
        <simpleForm
          ref={(el) => {
            addPartenterPartFormRef = el
          }}
          validateOnRuleChange={validateOnRuleChange.value}
          formData={partenterPartFormData}
          onSelectChange={
            ()=> {
              Object.assign(partenterPartFormData,{relativeno:partenterPartFormData?.projectname? partenterPartFormData.projectname:partenterPartFormData.productname,customerid: partenterPartFormData.customername})
            }
          }
          onSelectInputClick={(formInfo) => {
            onSelectInputClick(formInfo)
          }}
          formTempList={partenterPartFormTempList.value}
          customVisible={partenterPartCustomVisible}
          customRequired={partenterPartCustomRequired}
          label-width="auto"
          label-position="left"
        />
      </div>
    ),
    close() {
       addPartenterPartFormRef?.resetFields()
      validateOnRuleChange.value = false
    },
    async beforeSure(done, { button }) {
      const valid = await addPartenterPartFormRef?.formRef?.validate()
      console.log('[ valid ] >', valid)
      if (valid) {
        button.btn!.loading = true
        const params = {
          ...partenterPartFormData,
          modelapplyno: route.query.serialno,
          // objectType: 'newPartents',
          // serialNo: route.query.serialNo
          callscope:props.formData?.callscope
        }
        await dealApplyPartenterInfo(params).finally(() => (button.btn!.loading = false))
        ElMessage.success('新增成功')
        partenterPartTempTableRef.value?.getList()
        done()
        validateOnRuleChange.value = false
      } else {
        validateOnRuleChange.value = true
      }
      addPartenterPartFormRef?.resetFields()
    }
  })
}

const delPartenterPart = (btn: ActionButton) => {
  const currentRow = partenterPartTempTableRef.value?.currentRow
  if (!currentRow) {
    ElMessage.warning('请选择一条数据')
    return
  }

  ElMessageBox.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    async beforeClose(action, instance, done) {
      if (action !== 'confirm') {
        done()
        return
      }
      instance.confirmButtonLoading = true
      await deleteModelRelativeReq({serialno:currentRow?.serialno,modelapplyno:route.query.serialno}).finally(() => (instance.confirmButtonLoading = false))
      ElMessage.success('删除成功')
      partenterPartTempTableRef.value?.getList()
      done()
    }
  })
}

const onSelectInputClick = (formInfo) => {
 
 openPrName()

}

// 项目名称
let participantnameRef: any = null
const selectParticipantname = async (done) => {
  const formObj = await participantnameRef?.validate()
  console.log('formObjformObjformObj',formObj,partenterPartFormData)
  if (formObj) {
    Object.assign(partenterPartFormData,{relativeno:formObj.relativeNo,customerid: formObj.customerId,projectname:formObj.relativeName,customername:formObj.customerName})
    done()
  }
}
const openPrName = () => {
  addDialog({
    title: '请选择：',
    width: '1200px',
    contentRenderer: () => (
      <Participantname
        ref={(el) => {
          participantnameRef = el
        }}
      />
    ),
    props: {
      onSuccess: selectParticipantname
    },
    beforeSure: (done) => selectParticipantname(done)
  })
}



</script>

<style scoped></style>
