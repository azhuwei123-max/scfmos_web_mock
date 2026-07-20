<template>
  <div class="ISearch">
    <Search ref="searchRef" :schema="searchSchema" @search="search" @reset="reset" />
  </div>
  <ActionBar :buttons="btns" />
  <tempTable
    ref="tempTableRef"
    :api-func="getListValue"
    :tempNo="templateNo.list"
    :templateApiFunc="getTemplateFunc"
    :params="ListParams"
    :fetchCback="getFetchCback"
    :selection="false"
    highlight-current-row
  />
</template>

<script setup lang="tsx">
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import {
  savePaymentAdjust,
  getTemplateInfo,
  getListValue,
  deletePaymentAdjust,
  getTemplateValue,
  exportProjectRelativeExcel
} from '../../../api'
import { addDialog } from '@/components/Dialog'
import useFormChange from '@/views/assistApprProject/assistApprDetail/hooks/useFormChange'
import OpenBankName from '../OpenBankName/index.vue'
import { TempType } from '../../type'
import download from '@/utils/download'
import { FormSchema } from '@/types/form'

const props = withDefaults(
  defineProps<{
    customerId: string
    projectId: string
    isEdit: boolean
    serialno: string
    tempType?: TempType
    saveKey?: string
    projectDetailsIsAdmin: boolean
  }>(),
  {
    tempType: 'ParamAdjustApplyDetail'
  }
)

const templateNoMap: Record<TempType, any> = {
  'ParamAdjustApplyDetail': {
    list: 'ProjectRelativePayAccountList'
  },
  'ProjectDetails': {
    list: 'ProjectPayAccountList'
  }
}

const templateNo = computed(()=> {
  return templateNoMap[props?.tempType]
})

const searchSchema = ref<FormSchema[]>([
  {
    label: '开户名',
    field: 'opencustomername',
    component: 'Input',
  },
])

const search = (model) => {
  tempTableRef.value.queryParams['selectMap'] = {}
  tempTableRef.value.queryParams['selectMap']['opencustomername'] = model.opencustomername
  tempTableRef.value?.search()
}
const reset = () => {
  tempTableRef.value?.reSearch()
}

const tempTableRef = ref()

const ListParams = ref({
  serialno: props.serialno,
  templateno: templateNo.value.list
})
const getTemplateFunc = () => {
  return getTemplateInfo({ templateNo: templateNo.value.list })
}
const getFetchCback = (list) => {
  console.log('[ list ] >', list)
}
const btns = ref<ActionButton[]>([
  {
    key: 'add',
    label: '新增',
    icon: 'ep:circle-plus',
    plain: true,
    show: () => {
      return props.isEdit
    },
    loading: false,
    onClick: (btn) => add(btn)
  },
  {
    key: 'detail',
    label: '详情',
    icon: 'ep:view',
    show: () => {
      return props?.tempType === 'ParamAdjustApplyDetail'
    },
    plain: true,
    onClick: (btn) => detail(btn)
  },
  {
    key: 'add',
    label: '删除',
    show: () => {
      return props.isEdit
    },
    icon: 'ep:delete',
    plain: true,
    onClick: (btn) => del(btn)
  },
  {
    key: 'exportExcel',
    label: '导出',
    plain: true,
    onClick: (btn) => exportExcel(btn)
  },
])
const dynamicFormRef = ref()
// 所有弹窗选择ref
const mapRefs = ref({})
const setMapRef = (el, key) => {
  mapRefs.value[`select${key}InputRef`] = el
}
const formData = reactive<Recordable>({})
const formTempList = ref([])
// 表单动态事件处理
const { customVisible: CustomVisible, customRequired: CustomRequired } = useFormChange(
  { formData },
  { dynamicFormRef, mapRefs }
)
let addFormRef: any = null
const validateOnRuleChange = ref(false)

const detail = async (btn: ActionButton) => {
  const currentRow = tempTableRef.value?.currentRow
  if (!currentRow) {
    ElMessage.warning('请选择一条数据')
    return
  }
  btn.loading = true
  try {
    const vo = await getTemplateInfo({
      templateNo: 'ProjectRelativePayAccountInfo',
      serialno: props.serialno
    })
    const vl = await getTemplateValue({ serialno: currentRow.serialno, templateno: 'ProjectRelativePayAccountInfo',  })
    formTempList.value = vo.templates.map((item) => ({
      ...item,
    }))
    Object.assign(formData, vl)
  } finally {
    btn.loading = false
  }

  addDialog({
    title: '详情',
    width: '400px',
    contentRenderer: () => (
      <div>
        <simpleForm
          ref={(el) => {
            addFormRef = el
          }}
          validateOnRuleChange={validateOnRuleChange.value}
          formData={formData}
          formTempList={formTempList.value}
          customVisible={CustomVisible}
          customRequired={CustomRequired}
          label-width="auto"
          onSelectInputClick={(formInfo) => {
            onSelectInputClick(formInfo)
          }}
          onInputChange = {(formInfo) => {
            handleInputChange(formInfo)
          }}
        />
      </div>
    ),
    close() {
      addFormRef?.resetFields()
    },
    async beforeSure(done, { button }) {
      const valid = await addFormRef?.formRef?.validate()
      if (valid) {
        button.btn!.loading = true
        const params = {
          ...formData
        }
        params.objectno = props.serialno
        if(props.saveKey) {
          params[props.saveKey] = 1
        }
        // 项目详情页 管理员保存多传一个参数
        if(props.projectDetailsIsAdmin) {
          params['operatetype'] = 1
        }
        await savePaymentAdjust(params).finally(() => (button.btn!.loading = false))
        ElMessage.success('保存成功')
        tempTableRef.value?.getList()
        done()
        validateOnRuleChange.value = false
      } else {
        validateOnRuleChange.value = true
      }
      addFormRef?.resetFields()
    }
  })
}

const add = async (btn: ActionButton) => {
  btn.loading = true
  const res = await getTemplateInfo({
    templateNo: 'ProjectRelativePayAccountInfo',
    serialno: props.serialno
  }).finally(() => (btn.loading = false))
  formTempList.value = res.templates.map((item) => ({
    ...item
  }))
  for (let key in formData) {
    formData[key] = ''
  }
  addDialog({
    title: '新增',
    width: '500px',
    contentRenderer: () => (
      <div>
        <simpleForm
          ref={(el) => {
            addFormRef = el
          }}
          validateOnRuleChange={validateOnRuleChange.value}
          formData={formData}
          formTempList={formTempList.value}
          customVisible={CustomVisible}
          customRequired={CustomRequired}
          label-width="auto"
          label-position="left"
          onSelectInputClick={(formInfo) => {
            onSelectInputClick(formInfo)
          }}
          onInputChange = {(formInfo) => {
            handleInputChange(formInfo)
          }}
        />
      </div>
    ),
    close() {
      addFormRef?.resetFields()
      validateOnRuleChange.value = false
    },
    async beforeSure(done, { button }) {
    
      const valid = await addFormRef?.formRef?.validate()
      if (valid) {
      
        button.btn!.loading = true
        const params = {
          ...formData,
        }
        params.objectno = props.serialno
        if(props.saveKey) {
          params[props.saveKey] = 1
        }
        // 项目详情页 管理员保存多传一个参数
        if(props.projectDetailsIsAdmin) {
          params['operatetype'] = 1
        }
        await savePaymentAdjust(params).finally(() => (button.btn!.loading = false))
        ElMessage.success('新增成功')
        tempTableRef.value?.getList()
        done()
        validateOnRuleChange.value = false
      } else {
        validateOnRuleChange.value = true
      }
      addFormRef?.resetFields()
    }
  })
}

const onSelectInputClick = (formInfo) => {
  if(formInfo.colname === "openbankname") {
    openOpenbankname()
  }
}

const handleInputChange = (formInfo) =>{
  if(formInfo.colname === "accountno") {
   console.log('formData',formData)
   formData.accountno = formData.accountno.replace(/\D/g,"")
  }
}

let openbanknameRef: any = null
const selectOpenbankname = async (done) => {
  const formObj = await openbanknameRef?.validate()
  if (formObj) {
    formData.openbankno = formObj.bankNo
    formData.openbankname = formObj.bankName
    done()
  }
}
const openOpenbankname = () => {
   addDialog({
    title: '请选择：',
    width: '1200px',
    contentRenderer: () => (
      <OpenBankName
        ref={(el) => {
          openbanknameRef = el
        }}
        customerType={formData.customertype}
        customerId={props.customerId}
      />
    ),
    props: {
      onSuccess: selectOpenbankname
    },
    beforeSure: (done) => selectOpenbankname(done)
  })
}


const del = (btn: ActionButton) => {
  const currentRow = tempTableRef.value?.currentRow
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
      const params = {
        serialno: currentRow.serialno,
      }
      if(props.saveKey) {
        params[props.saveKey] = 1
      }
      // 项目详情页 管理员保存多传一个参数
      if(props.projectDetailsIsAdmin) {
        params['operatetype'] = 1
        params['projectid'] = props.projectId
      }
      await deletePaymentAdjust(params).finally(() => (instance.confirmButtonLoading = false))
      ElMessage.success('删除成功')
      tempTableRef.value?.getList()
      done()
    }
  })
}

const exportExcel = async (btn: ActionButton) => {
  btn.loading = true
  const res = await exportProjectRelativeExcel({
    ...(tempTableRef.value?.queryParams ?? {})
  }).finally(()=> btn.loading = false)
  download.excel(res, '受托支付信息列表.xls')
}
</script>

<style>
.ISearch {
  .el-form-item {
    display: flex !important;
  }
}
</style>
