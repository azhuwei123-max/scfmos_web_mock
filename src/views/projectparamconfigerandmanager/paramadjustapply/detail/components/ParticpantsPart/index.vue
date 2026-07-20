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
    @dbl-click="detail"
  />
</template>

<script setup lang="tsx">
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import {
  dealInfo,
  deleteParticipantInfoPageVo,
  getTemplateInfo,
  getListValue,
  selectRelativeType,
  selectZXQueryReason,
  getMaxZXQueryTime,
  selectCustomerInfo,
  getCustomerInfo
} from '../../../api'
import { addDialog } from '@/components/Dialog'
import useFormChange from '@/views/assistApprProject/assistApprDetail/hooks/useFormChange'
import { FormSchema } from '@/types/form'
import Participantname from '../Participantname/index.vue'
import Relativetype from '../Relativetype/index.vue'
import { useUserStoreWithOut } from '@/store/modules/user'
import dayjs from 'dayjs'
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
    list: 'TeamworkParticipantRiskList'
  },
  'ProjectDetails': {
    list: 'TeamworkParticipantRiskList'
  }
}

const templateNo = computed(()=> {
  return templateNoMap[props?.tempType]
})

// <!-- 参与方维护 （列表，只展示） -->
const route = useRoute()
const router = useRouter()
const tempTableRef = ref()
const userStroe = useUserStoreWithOut()

const searchRef = ref<any>()
const searchSchema = ref<FormSchema[]>([
  {
    label: '客户类型',
    field: 'customertype',
    component: 'Select',
    componentProps: {
      options: [
        {
          label:'公司客户',
          value: '01'
        },
        {
          label:'个人客户',
          value: '03'
        }
      ],
    }
  },
  {
    label: '业务关联关系',
    field: 'relativetype',
    component: 'Select',
    componentProps: {
      options: [],
      optionsAlias: {
        labelField: 'itemName',
        valueField: 'itemNo'
      }
    }
  },
  {
    label: '征信授权时间',
    field: 'zxquerytime',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange'
    }
  }
])

async function getRelativetype() {
  const res = await selectRelativeType({ customertype: '' })
  searchSchema.value[1]!.componentProps!.options = res
}
getRelativetype()

const search = (model) => {
  tempTableRef.value.queryParams['selectMap'] = {}
  tempTableRef.value.queryParams['selectMap']['customertype'] = model.customertype
  tempTableRef.value.queryParams['selectMap']['relativetype'] = model.relativetype
  if(model.zxquerytime) {
    tempTableRef.value.queryParams['selectMap']['zxquerytimestart'] = dayjs(model.zxquerytime[0]).format('YYYY/MM/DD')
    tempTableRef.value.queryParams['selectMap']['zxquerytimeend'] = dayjs(model.zxquerytime[1]).format('YYYY/MM/DD')
  }
  tempTableRef.value?.search()
}
const reset = () => {
  tempTableRef.value?.reSearch()
}

const ListParams = ref({
  serialno: props.serialno,
  templateno: templateNo.value.list
})
console.log('[ props ] >', props)
const getTemplateFunc = () => {
  return getTemplateInfo({ templateNo: templateNo.value.list })
}
const getFetchCback = (list) => {
  console.log('[ list ] >', list)
}
const btns = ref<ActionButton[]>([
  {
    key: 'add',
    label: '新增参与方',
    icon: 'ep:circle-plus',
    plain: true,
    loading: false,
    show: () => {
      return props.isEdit
    },
    onClick: (btn) => add(btn)
  },
  {
    key: 'detail',
    label: '参与客户详情',
    icon: 'ep:view',
    plain: true,
    onClick: (btn) => detail(btn)
  },
  {
    key: 'add',
    label: '删除',
    icon: 'ep:delete',
    show: () => {
      return props.isEdit
    },
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

const detail = async (btn: ActionButton) => {
  const currentRow = tempTableRef.value?.currentRow
  if (!currentRow) {
    ElMessage.warning('请选择一条数据')
    return
  }
  btn ? btn.loading = true : ""
  try {
    if(currentRow.customertype === '03'){
      const res = await getCustomerInfo({customerId: currentRow.participantid})
      console.log('[ res ] >', res)
      if(!res) {
        ElMessage.error('获取客户详情失败')
        return
      }
      router.push({
        path:`/customerManagers/indCustMana/customerPersonalDetail/${res.mfcustomerID}`,
        query: {
          customerName: res.customerName,
          customerId:res.customerID,
          customerType: res.customerType,
        }
      })
    }else {
      const res = await selectCustomerInfo({ customerId: currentRow.participantid, customerType: currentRow.customertype})
      if(!res) {
        ElMessage.error('获取客户详情失败')
        return
      }
      router.push({
        name: 'compCustManalDetail',
        query: {
          customerID: res.customerid,
          orgNature: res.orgnature,
          mfcustomerID: res.mfcustomerid,
          t: new Date().getTime()
        }
      })
    }
  } finally {
    btn ? btn.loading = false : ""
  }

}

const add = async (btn: ActionButton) => {
  btn.loading = true
  const res = await getTemplateInfo({
    templateNo: 'TeamworkParticipantInfo',
    serialno: props.serialno
  }).finally(() => (btn.loading = false))
  formTempList.value = res.templates.map((item) => ({
    ...item
  }))
  for (let key in formData) {
    formData[key] = ''
  }
  formData.operusername = userStroe.user.nickname
  formData.operuserid = userStroe.user.id
  formData.opertime = dayjs().format('YYYY/MM/DD')
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
          onSelectChange={(formInfo) => {
            if (formInfo.colname === 'customertype') {
              for (let key in formData){
                if(!['operusername','operuserid','opertime','customertype'].includes(key)) {
                  formData[key] = ''
                }
              }
            }
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
          ...formData
        }
        params.serialno = props.serialno
        params.projectid = props.projectId
        if(props.saveKey) {
          params[props.saveKey] = 1
        }
        // 项目详情页 管理员保存多传一个参数
        if(props.projectDetailsIsAdmin) {
          params['operatetype'] = 1
        }
        await dealInfo(params).finally(() => (button.btn!.loading = false))
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
  if (!formData.customertype) {
    ElMessage.warning('请选择客户类型')
    return
  }
  if (formInfo.colname === 'participantname') {
    openParticipantname()
  } else if (formInfo.colname === "relativetypename") {
    openRelativetype('relativetype')
  } else if (formInfo.colname === 'reasoninfo') {
    openRelativetype('reasoninfo')
  }
}

// 客户名称
let participantnameRef: any = null
const selectParticipantname = async (done) => {
  const formObj = await participantnameRef?.validate()
  if (formObj) {
    formData.participantname = formObj.customerName
    formData.participantid = formObj.customerId
    const res = await getMaxZXQueryTime({customerId: formObj.customerId})
    if(res) {
      formData.zxquerytime = res.querytime
      formData.iszxauthor = '1'
      formData.reasoninfo = res.reasoname
      formData.zxqueryreason = res.reason
    }
    
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
        customerType={formData.customertype}
        customerId={props.customerId}
      />
    ),
    props: {
      onSuccess: selectParticipantname
    },
    beforeSure: (done) => selectParticipantname(done)
  })
}

// 业务关联关系
let relativetypeRef: any = null
const selectRelativetypeRef = async (done) => {
  const formObj = await relativetypeRef?.validate()
  if (formObj) {
    formData.relativetypename = formObj.itemName
    formData.relativetype = formObj.itemNo
    done()
  }
}
const selectReasoninfo = async (done) => {
  const formObj = await relativetypeRef?.validate()
  if (formObj) {
    formData.reasoninfo = formObj.itemName
    formData.zxqueryreason = formObj.itemNo
    done()
  }
}
const openRelativetype = (type: 'reasoninfo' | 'relativetype') => {
  addDialog({
    title: '请选择：',
    width: '800px',
    contentRenderer: () => (
      <Relativetype
        ref={(el) => {
          relativetypeRef = el
        }}
        apiFunc={type === 'relativetype' ? selectRelativeType : selectZXQueryReason}
        customerType={formData.customertype}
      />
    ),
    props: {
      onSuccess: type === 'relativetype' ? selectRelativetypeRef : selectReasoninfo
    },
    beforeSure: (done) =>
      type === 'relativetype' ? selectRelativetypeRef(done) : selectReasoninfo(done)
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
      await deleteParticipantInfoPageVo(params).finally(() => (instance.confirmButtonLoading = false))
      ElMessage.success('删除成功')
      tempTableRef.value?.getList()
      done()
    }
  })
}
</script>

<style>
.ISearch {
  .el-form-item {
    display: flex !important;
  }
}
</style>
