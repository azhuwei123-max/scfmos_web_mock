<template>
  <ActionBar :buttons="guarantyBtns" />
  <tempTable
    ref="guarantyTempTableRef"
    :api-func="getGuarantyListValue"
    :templateApiFunc="getGuarantyListemplateVO"
    :params="guarantyListParams"
    :fetchCback="getGuarantyFetchCback"
    :hideOnSinglePage="true"
    @dbl-click="guarantyDetail"
  />
</template>

<script setup lang="tsx">
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import {
  dealGuarantyInfo,
  getGuarantyInfoTemplateVO,
  getGuarantyInfoValue,
  getGuarantyListemplateVO,
  getGuarantyListValue
} from '../../../api'
import { addDialog } from '@/components/Dialog'
import { KeysToLowerCase } from '@/utils'
import useFormChange from '@/views/assistApprProject/assistApprDetail/hooks/useFormChange'
import SelectBoCustomer from '../SelectBoCustomer/index.vue'

const route = useRoute()
const guarantyTempTableRef = ref()
const guarantyListParams = ref({
  serialNo: route.query.serialNo
})
const getGuarantyFetchCback = (list) => {
  console.log('[ list ] >', list)
}
const guarantyBtns = ref<ActionButton[]>([
  {
    key: 'add',
    label: '新增',
    icon: 'ep:circle-plus',
    plain: true,
    loading: false,
    onClick: (btn) => guarantyAdd(btn)
  },
  {
    key: 'detail',
    label: '详情',
    icon: 'ep:view',
    plain: true,
    onClick: (btn) => guarantyDetail(btn)
  },
  {
    key: 'add',
    label: '删除',
    icon: 'ep:delete',
    plain: true,
    onClick: (btn) => delGuaranty(btn)
  }
])
const dynamicFormRef = ref()
// 所有弹窗选择ref
const mapRefs = ref({})
const setMapRef = (el, key) => {
  mapRefs.value[`select${key}InputRef`] = el
}
const guarantyFormData = reactive<Recordable>({})
const guarantyFormTempList = ref([])
// 表单动态事件处理
const { customVisible: guarantyCustomVisible, customRequired: guarantyCustomRequired } =
  useFormChange({ guarantyFormData }, { dynamicFormRef, mapRefs })
let addGuarantyFormRef: any = null
const validateOnRuleChange = ref(false)

const guarantyDetail = async (btn: ActionButton) => {
  const currentRow = guarantyTempTableRef.value?.currentRow
  if (!currentRow) {
    ElMessage.warning('请选择一条数据')
    return
  }
  btn ? btn.loading = true : ""
  try {
    const vo = await getGuarantyInfoTemplateVO()
    const vl = await getGuarantyInfoValue({ serialno: currentRow.relativeserialno })
    guarantyFormTempList.value = vo.templates.map((item) => ({
      ...item,
      colreadonly: '1'
    }))
    let obj: Recordable = KeysToLowerCase(vl)
    Object.assign(guarantyFormData, obj)
  } finally {
    btn ? btn.loading = false : ""
  }

  addDialog({
    title: '担保人详情',
    width: '400px',
    hideFooter: true,
    contentRenderer: () => (
      <div>
        <simpleForm
          ref={(el) => {
            addGuarantyFormRef = el
          }}
          validateOnRuleChange={validateOnRuleChange.value}
          formData={guarantyFormData}
          formTempList={guarantyFormTempList.value}
          customVisible={guarantyCustomVisible}
          customRequired={guarantyCustomRequired}
          label-width="auto"
        />
      </div>
    ),
    close() {
      addGuarantyFormRef?.resetFields()
    },
  })
}

const guarantyAdd = async (btn: ActionButton) => {
  btn.loading = true
  const res = await getGuarantyInfoTemplateVO().finally(() => (btn.loading = false))
  guarantyFormTempList.value = res.templates.map((item) => ({
    ...item
  }))
  for(let key in guarantyFormData) {
    guarantyFormData[key] = ''
  }
  addDialog({
    title: '新增担保人',
    width: '400px',
    contentRenderer: () => (
      <div>
        <simpleForm
          ref={(el) => {
            addGuarantyFormRef = el
          }}
          validateOnRuleChange={validateOnRuleChange.value}
          formData={guarantyFormData}
          formTempList={guarantyFormTempList.value}
          customVisible={guarantyCustomVisible}
          customRequired={guarantyCustomRequired}
          label-width="auto"
          onSelectInputClick={() => {
            selectBoCustomerDialog()
          }}
        />
      </div>
    ),
    close() {
      addGuarantyFormRef?.resetFields()
      validateOnRuleChange.value = false
    },
    async beforeSure(done, { button }) {
      const valid = await addGuarantyFormRef?.formRef?.validate()
      if (valid) {
        button.btn!.loading = true
        const params = {
          cardid: guarantyFormData.cardid,
          customerid: guarantyFormData.customerid,
          customername: guarantyFormData.customername,
          identitystatus: guarantyFormData.identitystatus,
          objectType: 'newGuaranty',
          serialNo: route.query.serialNo
        }
        await dealGuarantyInfo(params).finally(() => (button.btn!.loading = false))
        ElMessage.success('新增成功')
        guarantyTempTableRef.value?.getList()
        done()
        validateOnRuleChange.value = false
      } else {
        validateOnRuleChange.value = true
      }
      addGuarantyFormRef?.resetFields()
    }
  })
}
let selectBoCustomerRef: any = null
const selectBoCustomerSuccess = async (done) => {
  const formData = await selectBoCustomerRef?.validate()
  if (formData) {
    let obj: Recordable = KeysToLowerCase(formData)
    Object.assign(guarantyFormData, obj)
    guarantyFormData.cardid = obj.certid
    done()
  }
}
const selectBoCustomerDialog = () => {
  addDialog({
    title: '请选择客户：',
    width: '1200px',
    contentRenderer: () => (
      <SelectBoCustomer
        ref={(el) => {
          selectBoCustomerRef = el
        }}
      />
    ),
    props: {
      onSuccess: selectBoCustomerSuccess
    },
    beforeSure: (done) => selectBoCustomerSuccess(done)
  })
}

const delGuaranty = (btn: ActionButton) => {
  const currentRow = guarantyTempTableRef.value?.currentRow
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
      await dealGuarantyInfo({
        serialNo: route.query.serialNo,
        WGRSERIALNO: currentRow.serialno,
        objectType: 'deleteGuaranty'
      }).finally(() => (instance.confirmButtonLoading = false))
      ElMessage.success('删除成功')
      guarantyTempTableRef.value?.getList()
      done()
    }
  })
}
</script>

<style scoped></style>
