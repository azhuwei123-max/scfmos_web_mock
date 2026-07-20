<template>
  <div>
    <!-- <Search layout="inline" :schema="searchSchema" @search="search" @reset="reset" /> -->
    <ActionBar :buttons="btns" />
    <tempTable
      ref="tempTableRef"
      :api-func="getListValue"
      :tempNo="templateNo.list"
      :templateApiFunc="getTemplateFunc"
      :params="ListParams"
      :fetchCback="getFetchCback"
      @dbl-click="detail"
    />
  </div>
</template>

<script setup lang="tsx">
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import {
  saveSubEntAcctAdjust,
  getTemplateInfo,
  getListValue,
  deleteSubEntAcctAdjust,
  getTemplateValue,
  exportEntCoreAccountExcel
} from '../../../api'
import { addDialog } from '@/components/Dialog'
import useFormChange from '@/views/assistApprProject/assistApprDetail/hooks/useFormChange'
import Participantname from '../Participantname/index.vue'
import { TempType } from '../../type'
import { FormSchema } from '@/types/form'
import download from '@/utils/download'

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
    list: 'SubEntCoreAccountList'
  },
  'ProjectDetails': {
    list: 'SubEntCoreAccountList'
  }
}

const templateNo = computed(()=> {
  return templateNoMap[props?.tempType]
})

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

const searchSchema = ref<FormSchema[]>([
  {
    label: '客户编号',
    field: 'customerid',
    component: 'Input'
  },
  {
    label: '客户名称',
    field: 'customername',
    component: 'Input'
  }
])

const search = (model) => {
  tempTableRef.value.queryParams.customerid = model.customerid
  tempTableRef.value.queryParams.customername = model.customername
  tempTableRef.value?.search()
}
const reset = () => {
  tempTableRef.value?.reSearch()
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
  btn ? btn.loading = true : ""
  try {
    const vo = await getTemplateInfo({
      templateNo: 'SubEntCoreAccountInfo',
      serialno: props.serialno
    })
    const vl = await getTemplateValue({ serialno: currentRow.serialno, templateno: 'SubEntCoreAccountInfo',  })
    formTempList.value = vo.templates.map((item) => ({
      ...item,
      colreadonly: '1'
    }))
    console.log('[ vl ] >', vl)
    Object.assign(formData, vl)
  } finally {
    btn ? btn.loading = false : ""
  }

  addDialog({
    title: '详情',
    width: '650px',
    hideFooter: true,
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
        />
      </div>
    ),
    close() {
      addFormRef?.resetFields()
    }
  })
}

const add = async (btn: ActionButton) => {
  btn.loading = true
  const res = await getTemplateInfo({
    templateNo: 'SubEntCoreAccountInfo',
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
    width: '650px',
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
        console.log('[ formData ] >', formData)
        if(formData.customerid === props.customerId) {
          ElMessage.warning('该企业为该项目的核心企业，不可作为核心企业的子公司')
          return
        }
        button.btn!.loading = true
        const params = {
          ...formData
        }
        params.relativeSerialNo = props.serialno
        if(props.saveKey) {
          params[props.saveKey] = 1
        }
        // 项目详情页 管理员保存多传一个参数
        if(props.projectDetailsIsAdmin) {
          params['operatetype'] = 1
        }
        await saveSubEntAcctAdjust(params).finally(() => (button.btn!.loading = false))
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
  console.log('[ formInfo ] >', formInfo)
  if(formInfo.colname === "customername") {
    openParticipantname()
  }
}

// 客户名称
let participantnameRef: any = null
const selectParticipantname = async (done) => {
  const formObj = await participantnameRef?.validate()
  console.log('[ formObj ] >', formObj)
  if (formObj) {
    formData.customername = formObj.customerName
    formData.customerid = formObj.customerId
    formData.certid = formObj.certId
    done()
  }
}
const openParticipantname = () => {
  addDialog({
    title: '请选择：',
    width: '1200px',
    contentRenderer: () => (
      <Participantname
        ref={(el) => {
          participantnameRef = el
        }}
        customerType='01'
        type='selectCustomerInfoPage'
        source='SubentCortAcctList'
        customerId={props.customerId}
      />
    ),
    props: {
      onSuccess: selectParticipantname
    },
    beforeSure: (done) => selectParticipantname(done)
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
         relativeSerialNo: currentRow.serialno,
      }
      if(props.saveKey) {
        params[props.saveKey] = 1
      }
      // 项目详情页 管理员保存多传一个参数
      if(props.projectDetailsIsAdmin) {
        params['operatetype'] = 1
        params['projectid'] = props.projectId
      }
      await deleteSubEntAcctAdjust(params).finally(() => (instance.confirmButtonLoading = false))
      ElMessage.success('删除成功')
      tempTableRef.value?.getList()
      done()
    }
  })
}

const exportExcel = async (btn: ActionButton) => {
  btn.loading = true
  const res = await exportEntCoreAccountExcel({
    ...(tempTableRef.value?.queryParams ?? {})
  }).finally(()=> btn.loading = false)
  download.excel(res, '核心企业子公司扣款账户列表.xls')
}
</script>

<style scoped></style>
