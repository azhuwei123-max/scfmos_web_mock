<template>
  <!-- <Search :schema="searchSchema" @search="search" @reset="reset" /> -->
  <ActionBar :buttons="btns" />
  <tempTable
    ref="tempTableRef"
    :api-func="getListValue"
    :tempNo="templateNo.list"
    :templateApiFunc="getTemplateFunc"
    :params="ListParams"
    :fetchCback="getFetchCback"
  />
</template>

<script setup lang="tsx">
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import {
  saveDepositAcctAdjust,
  getTemplateInfo,
  getListValue,
  deleteDepositAcctAdjust,
} from '../../../api'
import { addDialog } from '@/components/Dialog'
import useFormChange from '@/views/assistApprProject/assistApprDetail/hooks/useFormChange'
import { TempType } from '../../type'

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
    list: 'ProjectLimitAccountList',
    objectType: 'ProjectParamAdjust'
  },
  'ProjectDetails': {
    list: 'ProjectLimitAccountList',
    objectType: 'TeamWorkProject'
  }
}

const templateNo = computed(()=> {
  return templateNoMap[props?.tempType]
})

const tempTableRef = ref()

const ListParams = ref({
  serialno: props.serialno,
  templateno: templateNo.value.list,
  objecttype: templateNo.value.objectType
})
const getTemplateFunc = () => {
  return getTemplateInfo({ templateNo: templateNo.value.list,  objecttype: templateNo.value.objectType })
}
const getFetchCback = (list) => {
  console.log('[ list ] >', list)
}
const btns = ref<ActionButton[]>([
  {
    key: 'add',
    label: '新增',
    icon: 'ep:circle-plus',
    show: () => {
      return props.isEdit
    },
    plain: true,
    loading: false,
    onClick: (btn) => add(btn)
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
  }
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

const add = async (btn: ActionButton) => {
  btn.loading = true
  const res = await getTemplateInfo({
    templateNo: 'ProjectLimitAccountInfo',
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
    width: '800px',
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
      validateOnRuleChange.value = false
    },
    async beforeSure(done, { button }) {
      const valid = await addFormRef?.formRef?.validate()
      if (valid) {
        button.btn!.loading = true
        
        const params = {
          ...formData
        }
        params.serialno = props.serialno
        if(props.saveKey) {
          params[props.saveKey] = 1
        }
        // 项目详情页 管理员保存多传一个参数
        if(props.projectDetailsIsAdmin) {
          params['operatetype'] = 1
        }
        await saveDepositAcctAdjust(params).finally(() => (button.btn!.loading = false))
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
        acctountno: currentRow.acctountno
      }
      if(props.saveKey) {
        params[props.saveKey] = 1
      }
      // 项目详情页 管理员保存多传一个参数
      if(props.projectDetailsIsAdmin) {
        params['operatetype'] = 1
        params['projectid'] = props.projectId
      }
      await deleteDepositAcctAdjust(params).finally(() => (instance.confirmButtonLoading = false))
      ElMessage.success('删除成功')
      tempTableRef.value?.getList()
      done()
    }
  })
}
</script>

<style scoped></style>
