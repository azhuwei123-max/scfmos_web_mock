<template>
  <div>
    <ActionBar :buttons="btns" />
    <tempTable
      ref="tempTableRef"
      :api-func="getListValue"
      :tempNo="templateNo.list"
      :templateApiFunc="getTemplateFunc"
      :params="ListParams"
      :fetchCback="getFetchCback"
    />
  </div>
</template>

<script setup lang="tsx">
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import {
  addTeamWorkSettlerPageVo,
  deleteTeamWorkSettlerPageVo,
  getTemplateInfo,
  getListValue,
} from '../../../api'
import { addDialog } from '@/components/Dialog'
import useFormChange from '@/views/assistApprProject/assistApprDetail/hooks/useFormChange'
import Participantname from '../Participantname/index.vue'
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
    list: 'TeamworkSettlerList',
    objecttype: 'ProjectParamAdjust'
  },
  'ProjectDetails': {
    list: 'TeamworkSettlerList',
    objecttype: 'TeamWorkProject'
  }
}

const templateNo = computed(()=> {
  return templateNoMap[props?.tempType]
})

const tempTableRef = ref()

const ListParams = ref({
  serialno: props.serialno,
  templateno: templateNo.value.list,
  objecttype: templateNo.value.objecttype
})
const getTemplateFunc = () => {
  return getTemplateInfo({ templateNo: templateNo.value.list, objecttype: templateNo.value.objecttype })
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
    key: 'delete',
    label: '删除',
    show: () => {
      return props.isEdit
    },
    icon: 'ep:delete',
    plain: true,
    onClick: (btn) => del(btn)
  },
])
const dynamicFormRef = ref()
// 所有弹窗选择 ref
const mapRefs = ref({})
const setMapRef = (el, key) => {
  mapRefs.value[`select${key}InputRef`] = el
}
const formData = reactive<Recordable>({})
// 本地写死 formTempList，包含客户类型和客户名称字段
const formTempList = ref([
  {
  "colindex": "0040",
  "sortno": "0040",
  "isinuse": "1",
  "coltablename": "O",
  "coldefaultvalue": "公司客户",
  "colactualname": "CUSTOMERTYPE",
  "colname": "customertypename",
  "coltype": "String",
  "colheader": "客户类型",
  "colcolumntype": "1",
  "coleditstyle": "输入框",
  "colcheckformat": "字符串",
  "colalign": "1",
  "coleditsourcetype": "JSON",
  "collimit": "50",
  "colvisible": "1",
  "colreadonly": "1",
  "colrequired": "1",
  "colsortable": "0",
  "isfilter": "0",
  "colspan": 2,
},{
  "dono": "TeamworkParticipantInfo",
  "colindex": "0060",
  "sortno": "0060",
  "isinuse": "1",
  "coltablename": "O",
  "colactualname": "participantname",
  "colname": "participantname",
  "coltype": "String",
  "coldefaultvalue": null,
  "colheader": "客户名称",
  "colunit": "<input class=\\\"info_unit_button\\\" value=\\\"...\\\" type=button onClick=selectRelativeType()>",
  "colcolumntype": "1",
  "coleditstyle": "文本框",
  "colcheckformat": "字符串",
  "colalign": "1",
  "collimit": "50",
  "colvisible": "1",
  "colreadonly": "0",
  "colrequired": "1",
  "colsortable": "0",
  "isfilter": "0",
  "colspan": 2,
  "isautocomplete": null,
  "groupid": null,
  "dockid": null,
}])
// 表单动态事件处理
const { customVisible: CustomVisible, customRequired: CustomRequired } = useFormChange(
  { formData },
  { dynamicFormRef, mapRefs }
)
let addFormRef: any = null
const validateOnRuleChange = ref(false)

const add = async (btn: ActionButton) => {
  for (let key in formData) {
    formData[key] = ''
  }
  // 客户类型默认公司客户且不可选择
  formData.customertype = '01'
  formData.customertypename = '公司客户'
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
        button.btn!.loading = true
        const params = {
          objecttype: templateNo.value.objecttype,
          objectno: props.serialno,
          operatetype: '1',
          customerID: formData.participantid
        }
        await addTeamWorkSettlerPageVo(params).finally(() => (button.btn!.loading = false))
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
  if(formInfo.colname === "participantname") {
    openParticipantname()
  }
}

// 客户名称
let participantnameRef: any = null
const selectParticipantname = async (done) => {
  const formObj = await participantnameRef?.validate()
  console.log('[ formObj ] >', formObj)
  if (formObj) {
    formData.participantname = formObj.customerName
    formData.participantid = formObj.customerId
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
        type='selectCustomerInfoPage'
        source='SubentCortAcctList'
        customerId={props.customerId}
        customerType={formData.customertype}
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
  ElMessageBox.confirm('确定要删除吗？', '提示', {
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
        objecttype: templateNo.value.objecttype,
        customerID: props.customerId,
        objectno: currentRow.serialno
      }
      await deleteTeamWorkSettlerPageVo(params).finally(() => (instance.confirmButtonLoading = false))
      ElMessage.success('删除成功')
      tempTableRef.value?.getList()
      done()
    }
  })
}
</script>

<style scoped></style>
