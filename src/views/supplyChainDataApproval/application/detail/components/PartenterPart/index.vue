<template>
  <Search :schema="searchSchema" @search="search" @reset="reset" />
  <ActionBar :buttons="partenterPartBtns" />
  <tempTable
    ref="partenterPartTempTableRef"
    :api-func="getAutoApplyPartenterListValue"
    :templateApiFunc="getAutoApplyPartenterListTemplateVO"
    :params="partenterPartListParams"
    :fetchCback="getPartenterPartFetchCback"
    :hideOnSinglePage="true"
    @dbl-click="partenterPartDetail"
  />
</template>

<script setup lang="tsx">
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import {
  dealApplyPartenterInfo,
  getAutoApplyPartenterListValue,
  getAutoApplyPartenterListTemplateVO,
  getApplyPartenterTemplateVO,
  getApplyPartenterInfoValue,
  autoApplyPartenterExport
} from '../../../api'
import download from '@/utils/download'
import { addDialog } from '@/components/Dialog'
import { KeysToLowerCase } from '@/utils'
import useFormChange from '@/views/assistApprProject/assistApprDetail/hooks/useFormChange'
import { useUserStoreWithOut } from '@/store/modules/user'
import { FormSchema } from '@/types/form'
import dayjs from 'dayjs'

const route = useRoute()
const userStore = useUserStoreWithOut()

const searchSchema = ref<FormSchema[]>([
  {
    label: '合作商名称',
    field: 'partentername',
    component: 'Input'
  }
])

const partenterPartTempTableRef = ref()
const partenterPartListParams = ref({
  serialNo: route.query.serialNo
})

const search = (model) => {
  partenterPartTempTableRef.value.queryParams.partentername = model.partentername
  partenterPartTempTableRef.value?.search()
}
const reset = () => {
  partenterPartTempTableRef.value?.reSearch()
}

const getPartenterPartFetchCback = (list) => {
  console.log('[ list ] >', list)
}

const isMT: boolean = route.query.fromPage?.startsWith('60') ?? false
const partenterPartBtns = ref<ActionButton[]>([
  {
    key: 'add',
    label: '新增',
    icon: 'ep:circle-plus',
    plain: true,
    loading: false,
    show: !isMT,
    onClick: (btn) => partenterPartAdd(btn)
  },
  {
    key: 'detail',
    label: '详情',
    icon: 'ep:view',
    plain: true,
    onClick: (btn) => partenterPartDetail(btn)
  },
  {
    key: 'add',
    label: '删除',
    icon: 'ep:delete',
    plain: true,
    show: !isMT,
    onClick: (btn) => delPartenterPart(btn)
  },
  {
    key: 'exportExcel',
    label: '导出',
    plain: true,
    show: isMT,
    onClick: (btn) => exportExcel(btn)
  },
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
const { customVisible: partenterPartCustomVisible, customRequired: partenterPartCustomRequired } =
  useFormChange({ partenterPartFormData }, { dynamicFormRef, mapRefs })
let addPartenterPartFormRef: any = null
const validateOnRuleChange = ref(false)

const partenterPartDetail = async (btn: ActionButton) => {
  const currentRow = partenterPartTempTableRef.value?.currentRow
  if (!currentRow) {
    ElMessage.warning('请选择一条数据')
    return
  }
  btn ? btn.loading = true : ""
  try {
    const vo = await getApplyPartenterTemplateVO()
    const vl = await getApplyPartenterInfoValue({ serialno: currentRow.serialno })
    partenterPartFormTempList.value = vo.templates.map((item) => ({
      ...item,
      colreadonly: '1'
    }))
    let obj: Recordable = KeysToLowerCase(vl)
    Object.assign(partenterPartFormData, obj)
  } finally {
    btn ? btn.loading = false : ""
  }

  addDialog({
    title: '担保人详情',
    width: '600px',
    hideFooter: true,
    contentRenderer: () => (
      <div>
        <simpleForm
          ref={(el) => {
            addPartenterPartFormRef = el
          }}
          validateOnRuleChange={validateOnRuleChange.value}
          formData={partenterPartFormData}
          formTempList={partenterPartFormTempList.value}
          customVisible={partenterPartCustomVisible}
          customRequired={partenterPartCustomRequired}
          label-width="auto"
        />
      </div>
    ),
    close() {
      addPartenterPartFormRef?.resetFields()
    }
  })
}

const partenterPartAdd = async (btn: ActionButton) => {
  btn.loading = true
  const res = await getApplyPartenterTemplateVO().finally(() => (btn.loading = false))
  partenterPartFormTempList.value = res.templates.map((item) => ({
    ...item
  }))
  for (let key in partenterPartFormData) {
    partenterPartFormData[key] = ''
  }

  ;((partenterPartFormData.inputusername = userStore.user.nickname),
    (partenterPartFormData.inputtime = dayjs().format('YYYY/MM/DD HH:MM:ss')),
     (partenterPartFormData.updatetime = dayjs().format('YYYY/MM/DD HH:MM:ss')))
  partenterPartFormData.inputorgname = userStore.dept.name
  addDialog({
    title: '新增担保人',
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
          objectType: 'newPartent',
          serialNo: route.query.serialNo
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
      await dealApplyPartenterInfo({
        serialNo: route.query.serialNo,
        APSERIALNO: currentRow.serialno,
        objectType: 'deletePartent'
      }).finally(() => (instance.confirmButtonLoading = false))
      ElMessage.success('删除成功')
      partenterPartTempTableRef.value?.getList()
      done()
    }
  })
}

const exportExcel = async (btn: ActionButton) => {
  btn.loading = true
  const res = await autoApplyPartenterExport({
    ...(partenterPartTempTableRef.value.queryParams ?? {})
  }).finally(()=> btn.loading = false)
  download.excel(res, '合作商列表.xls')
}
</script>

<style scoped></style>
