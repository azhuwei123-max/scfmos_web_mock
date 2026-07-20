<template>
  <ContentWrap>
    <!-- 操作栏 -->
    <!-- <div class="mb-15px flex justify-end">
      <el-button @click="writeDutReport">
        填写尽职调查报告
      </el-button>
      <el-button @click="delDutReport">
        删除尽职调查报告
      </el-button>
      <el-button @click="checkDutReport">
        查看尽职调查报告
      </el-button>
      <el-button @click="apprCustType">
        审批客户分类
      </el-button>
      <el-button tpye="" @click="handleCreate">
        <Icon icon="ep:plus" class="mr-5px" />
        新增申请
      </el-button>
      <el-button @click="relatedWhite" :loading="checkWhiteLoading">
        关联白名单
      </el-button>
      <el-button @click="doRiskDetection">
        自动风险探测
      </el-button>
      <el-button @click="doApprovalOpinion">
         签署意见
      </el-button>
      <el-button @click="submit">
        提交
      </el-button>
    </div> -->
    
    <div class="flex items-center mb-2 w-[110px]" @click="isExpand = !isExpand">
      <Icon v-show="!isExpand" class="mr-4px" icon="ep:plus" />
      <Icon v-show="isExpand" class="mr-4px" icon="ep:minus" />
      <el-button link> 查询条件 </el-button>
    </div>
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      v-show="isExpand"
      :model="queryParams"
      class="search-form"
      label-width="auto"
      @keyup.enter="handleQuery"
    >
      <el-form-item label="申请编号" prop="objectNo">
        <el-input
          v-model="queryParams.objectNo"
          placeholder="请输入申请编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="渠道标识" prop="mrchFlg">
        <el-input
          v-model="queryParams.mrchFlg"
          placeholder="请输入渠道标识"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="业务品种" prop="businessTypeName">
        <el-input
          v-model="queryParams.businessTypeName"
          placeholder="请输入业务品种"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="发生类型" prop="virOccurTypeName">
        <el-select
          v-model="queryParams.virOccurTypeName"
          placeholder="请选择发生类型"
          clearable
          class="!w-240px"
          @change="handleQuery"
        >
          <el-option
            v-for="item in occurrenceTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="完成时间" prop="endTime">
        <el-date-picker
            v-model="queryParams.endTime"
            type="data"
            placeholder="请选择完成时间"
            value-format="YYYY/MM/DD"
            clearable
            @change="handleQuery"
            class="!w-240px"
          />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
    <div class="mb-15px flex">
      <template v-for="button in currentButtons" :key="button.key">
        <el-button
         :type="button.type"
         @click="button.handler"
        >
          {{ button.label }}
        </el-button>
      </template>
    </div>

    <Table
      :columns="tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="{
        total: tableObject.total
      }"
      highlight-current-row
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      @current-change="handleSelectionChange"
      @row-dblclick="handleDetail"
    >
      <!-- <template #action="{ row }">
        <el-button link tpye="" @click="handleDetail(row)">申请详情</el-button>
        <el-button link type="" @click="handleCancel(row)">取消申请</el-button>
      </template> -->
    </Table>

    <!-- <relatedWhiteList ref="relatedWhiteListRef" /> -->

    <RiskMonitor
      v-model="riskMonitorVisible"
      :risk-data="riskData"
      @confirm="handleRiskMonitorConfirm"
      @cancel="handleRiskMonitorCancel"/>

    <apprCustTypePop ref="apprCustTypePopRef" @confirm="handleQuery" />
    <el-dialog
      v-model="addVisible"
      title="新增申请"
      width="850px"
      append-to-body
      destroy-on-close
      :close-on-click-modal="false"
    >
      <creditApplyJobCreate  @close="handleClose" :creditSourceFlag="props.creditSourceFlag"  @handle-success="handleSuccess" />
     
    </el-dialog>

    <CreditFlowApproval
      v-model="creditFlowApprovalVisible"
      :serial-no="serialNo"
      :phase-no="phaseNo"
      :object-type="selectRow?.objectType"
      @refresh="getList"
      @cancel="handleCreditFlowApprovalCancel"
    />



  </ContentWrap>


  <MiniPageSelectDialog
   ref="dialogRef" 
    v-model="visible"
    width="880"
    :columns="columns"
    @confirm="okPick"
    :data='datalist'
    
   />
 

  <!-- 签署意见 -->
  <ApprovalOpinion v-model="approvalOpinionVisible"  :process-instance="selectedRows" @submit="submit"/>


   <!-- IFrame Dialog（覆盖显示） -->
   <Dialog
    v-model="iframeDialogVisible"
    :title="iframeTitle"
    width="90%"
    :fullscreen="true"
    :scroll="false"
  >
    <IFrame
      v-if="iframeDialogVisible && iframeUrl"
      :src="iframeUrl"
      :auto-height="true"
      :min-height="'600px'"
      :height-offset="94.5"
    />

    </Dialog>

  <!-- 查看意见 -->
  <viewPhaseOpinionPop ref="viewPhaseOpinionRef" />
</template>

<script lang="tsx" setup>
import { ElMessageBox } from 'element-plus'
import { defaultQueryParams, tableColumns,occurrenceTypeOptions,routeNameTobuttonGroupsMap } from './const'
// import relatedWhiteList from './components/relatedWhiteList.vue'
import {getCurrentInstance,computed,onActivated,onDeactivated} from 'vue'

import { creditApplyJobApi } from '@/api/creditapplication/creditApplyJob'
import * as CommonSubmitApi from "@/api/bpm/common";
import * as CreditFlowApi from "@/api/creditflow";
import { deleteApprovalOpinion } from '@/api/creditapplication/pendding/approval-opinion';
import ApprovalOpinion from './components/approvalOpinion.vue'
import creditApplyJobCreate from './create/index.vue'
import apprCustTypePop from './components/apprCustTypePop.vue'
import { applicationPenddingApi } from '@/api/creditapplication'
import viewPhaseOpinionPop from '@/views/reviewapproval/credit/viewApplyPhaseOpinion/index.vue'
import {addDialog} from "@/components/Dialog";


defineOptions({ name: 'creditApplyJob' })

const props = defineProps({
  params: Object,
  creditSourceFlag:String
})

const isExpand = ref(false)

const message = useMessage()
const router = useRouter()
const route = useRoute()
const { push, currentRoute } = router
console.log('currentRoute222',currentRoute,currentRoute.value.name);

const routeNameToProcrssTypeMap:Record<string,string> = {
  creditApplyJob:'1010', // 待处理申请
  creditScSp:'1020', //审查审批
  creditThbj:'1025', //退回补件
  creditThbczl:'1030', //退回补充资料
  creditSptg:'1040',//审批通过
  creditBfj:'1050', // 被否决申请
  creditYzf:'1070',//已作废
  creditYqx:'1090' // 已取消
}

const queryParams = reactive({ ...defaultQueryParams })
const queryFormRef = ref()

const addVisible = ref(false)

const selectedRows = ref<any[]>([])
// const instance = getCurrentInstance()
// const type = computed(()=>instance?.type?.name )

// console.log('instance',instance,instance?.type.name,type);


const currentPhaseType = ref()

const setPhaseType = () => {
  const routeName = props.params?.type
  if(routeName&&typeof routeName==='string') {
    currentPhaseType.value = routeNameToProcrssTypeMap[routeName] || undefined
  }
}
setPhaseType()


// 使用 useTable hook
// 注意：这里需要创建对应的 API，暂时使用模拟数据
const { tableObject, tableMethods } = useTable({
  getListApi: async (params: any) => {
    // TODO: 替换为实际的 API 调用
    console.log('API 调用',params);
    
    const res =   await creditApplyJobApi.getList(params) 
    return {
      list: res.list || [],
      total: res.total
    }
  },
  defaultParams: { ...defaultQueryParams,creditSourceFlag:props.creditSourceFlag, phaseType:currentPhaseType.value }
})

const { getList, setSearchParams } = tableMethods

/** 搜索按钮操作 */
const handleQuery = () => {
  setSearchParams({...queryParams,phaseType:currentPhaseType})
  // getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  Object.assign(queryParams, defaultQueryParams,{phaseType:currentPhaseType.value,serialNo:undefined})
  handleQuery()
}

/** 新增申请操作 */
const handleCreate = async () => {
  // 获取当前路由的菜单标题
  const menuTitle = currentRoute.value.meta?.title || '授信额度申请'
  const newTitle = `${menuTitle}-新增`


  addVisible.value =true
  

  // 跳转到新增页面
  // const newPath = '/creditapplication/creditApplyJob/create'
  // await push({
  //   path: newPath,
  //   query: {
  //     title: newTitle // 通过 query 传递标题，在新增页面中设置
  //   }
  // })
}

const handleClose = () =>{
  addVisible.value= false
  getList()
}



const handleSuccess = (row) => {
  addVisible.value=false
  // getList()
 setSearchParams({...queryParams,objectNo:row.serialNo})?.then(res => {
  console.log('resresres',res);
  
  if(res.list.length > 0) {
    // nextTick(()=> {
      console.log('res.list.length',res.list[0]);
      toDetail(res.list[0])
  //  })
  }
 })

  
}

// 关联白名单校验
const checkWhiteLoading = ref(false)
const checkWhiteApply = (row) => {
  checkWhiteLoading.value = true
  return new Promise((resolve, rej) => {
    applicationPenddingApi
      .checkWhiteApply({ objectNo: row.serialNo })
      .then((res) => {
        if (!res) {
          resolve(false)
          return
        }
        
        // btr约定
        if (['1', '2', '3'].includes(res['msgreturn'])) {
          ElMessage.warning(res['msg'])
          resolve(false)
          return
        }

        resolve(true)
      }).
      catch(e => {
        resolve(false)
      })
      .finally(() => {
        checkWhiteLoading.value = false
      })
  })
}

// 审批客户分类
const apprCustTypePopRef = ref()
const apprCustType = async () => {
  if (selectedRows.value?.length != 1) return message.warning('请选择 1 条')

  apprCustTypePopRef.value.open(selectedRows.value[0])
}

// 打开白名单
const relatedWhiteListRef = ref()
const relatedWhite = async () => {
  if (!selectedRows.value?.serialNo) return message.warning('请选择')

  const result = await checkWhiteApply(selectedRows.value)
  if (!result) return

  relatedWhiteListRef.value.open(selectedRows.value)
}


const handleSelectionChange = (val) => {
  val ? selectedRows.value = [val] : selectedRows.value = []
}

/** 申请详情操作 */
const handleDetail = async () => {
  // 跳转到详情页面，传递申请编号用于设置标题
  // console.log('rowrowrow',row);
  
    if (selectedRows.value?.length != 1) return message.warning('请选择 1 条数据')
   const row = selectedRows.value[0]
  const detailPath = `/creditapplication/creditApplyJob/detail`
  router.push({
    path: detailPath,
    query: {
      serialNo : row.objectNo,
      businessType:row.businessType,
      phaseNo:row.phaseNo,
      applyType: row.applyType,
      objectNo:row.objectNo,
      objectType:row.objectType,
      customerID:row.customerID,
      creditSourceFlag:'01',
      t: Date.now(), // 解决重复打开相同详情，详情页面不加载的问题
      _tagTitle: '项目授信详情', // 对tag页签中的title，重命名
    }
  })

}

const toDetail = async (row) => {
  const detailPath = `/creditapplication/creditApplyJob/detail`
  router.push({
    path: detailPath,
    query: {
      serialNo : row.objectNo,
      businessType:row.businessType,
      applyType: row.applyType,
      objectNo:row.objectNo,
      objectType:row.objectType,
      customerID:row.customerID,
      phaseNo:row.phaseNo,
      creditSourceFlag: '01',
      t: Date.now(), // 解决重复打开相同详情，详情页面不加载的问题
      _tagTitle: '项目授信详情', // 对tag页签中的title，重命名
    }
  })
}

/** 取消操作 */
const handleCancel = async () => {

  if (selectedRows.value?.length != 1) return message.warning('请选择 1 条数据')
  const row = selectedRows.value[0]

  try {
    await ElMessageBox.confirm('确定要取消该申请吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // TODO: 调用取消接口
    await creditApplyJobApi.cancelContract({ objectType: 'CreditApply', serialNo: row.objectNo })
    message.success('取消成功')
    await getList()
  } catch {
    // 用户取消操作，忽略 row 参数未使用的警告
    void row
  }
}

const riskMonitorVisible = ref(false)
const riskData = ref()
const submitFlag = ref(false)
const serialNo = ref('')
const phaseNo = ref('')
const creditFlowApprovalVisible = ref(false)
const selectRow = ref()

const doRiskDetection = async (rskTp = 1) => {
  if (getSelect()) return;
  riskData.value = {
    scenarioId: '001',
    rskTp: rskTp?.target ? 1 : rskTp,
    params: {
      OccurType: selectRow.value.occurType,
      ObjectType: selectRow.value.objectType,
      ObjectNo: selectRow.value.objectNo,
      FlowNo: selectRow.value.flowNo,
      PhaseNo: selectRow.value.phaseNo,
      ApplyType1: selectRow.value.applyType,
    }
  }
  riskMonitorVisible.value = true
  submitFlag.value = false
}

const checkCommentExec = async(serialNo,objectType,PhaseNo) => {
  const resp = await applicationPenddingApi.checkComment({serialNo,objectType,PhaseNo}).then(res => res)
  return resp;
}

const submit = async () => {
 
  if(selectedRows.value.length !== 1) {
    message.warning("请选择一条记录")
    return
  }
const data = await checkCommentExec(selectedRows.value[0].objectNo,selectedRows.value[0].objectType,selectedRows.value[0].phaseNo)
  console.log("data:",data)
  if (!data?.phaseOpinion) {
   ElMessage.warning(`${selectedRows.value[0].objectNo}签署意见未保存`)
    return
  }
  await doRiskDetection(2)
  submitFlag.value = true
}

const handleRiskMonitorConfirm = async (hasFailure) => {
  console.log('hasFailure',hasFailure)
  if (!submitFlag.value) {
    await handleRiskMonitorCancel()
    return
  }
  riskMonitorVisible.value = false

  serialNo.value = selectRow.value.objectNo
  phaseNo.value = selectRow.value.phaseNo
  creditFlowApprovalVisible.value = true
}

const getSelect = () => {
  if(selectedRows.value.length !== 1) {
    message.warning("请选择一条记录")
    return true
  }
  selectRow.value = selectedRows.value[0]
  return false
}

const handleRiskMonitorCancel = async () => {
  riskMonitorVisible.value = false
}
const handleCreditFlowApprovalCancel = () => {
  creditFlowApprovalVisible.value = false
}

/** 初始化 */
onMounted(() => {
   getList()
})





const approvalOpinionVisible = ref(false)


const doApprovalOpinion = () => {
  console.log('selectedRows.value',selectedRows.value);
  
  if(selectedRows.value.length !== 1) {
    message.warning("请选择一条记录")
    return
  }

  const selectRow = selectedRows.value[0]

  approvalOpinionVisible.value=true

}


const close = () => {
  addVisible.value=false
}

// 填写尽职报告
const writeDutReport =async () => {
  // ElMessage.info('功能待实现')
  // creditApplyJobApi.aa({}).then(res => {
  // })

  if (selectedRows.value?.length != 1) return message.warning('请选择 1 条数据')
  const res = await creditApplyJobApi.getFormatDocData({
    objectno:selectedRows.value[0].objectNo,
    objecttype:selectedRows.value[0].objectType,
  })


  if(res == null) {
  
    const status = await creditApplyJobApi.genReportCheck({
      objectno:selectedRows.value[0].objectNo,
     objecttype:selectedRows.value[0].objectType,
    })
    
     
    if(!status.data&& status !== true) {
     await ElMessageBox.confirm(status.msg,'提示',{
      confirmButtonText:'继续',
      cancelButtonText:'取消',
      type:"warning"
     })
    }


    const res2 =  await creditApplyJobApi.getTemplateList({
      objectno:selectedRows.value[0].objectNo,
      objecttype:selectedRows.value[0].objectType,
     })
     

    // datalist.value = [...res2,...res2]
  // getDataList()

   createFormatDocData(res2)
   
  }

  console.log('feriasdasd',res);
  

  if(res) {
    await ElMessageBox.confirm('重新填写调查报告后，需要重新查看生成调查报告，您要确定重新填写吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    createFormatDocData([res])
  }

  // console.log('resresresres',[...res,...res]);


}



const createFormatDocData =async (list)=> {
  
  if(list && list?.length > 1) {
      datalist.value = list
      visible.value =true
    // const res = await creditApplyJobApi.createFormatDocData({
    // objectno:selectedRows.value[0].objectNo,
    //  objecttype:selectedRows.value[0].objectType,
    // })
    // console.log('最后一步',res2);
   return
  }
  console.log('selectedRows',selectedRows.value,selectedRows.value[0].objectType);
  
  const res = await creditApplyJobApi.createFormatDocData({
     objectno:selectedRows.value[0].objectNo,
     objecttype:selectedRows.value[0].objectType,
     docid:list[0].docid,
     customerid:selectedRows.value[0].customerID
    })
    console.log('最后一步',res);
    
    if(res) {
      openIframeDialog(res)
    }


}


// 删除尽职报告
const delDutReport =async () => {
  // ElMessage.info('功能待实现')
  if (selectedRows.value?.length != 1) return message.warning('请选择 1 条数据')
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await creditApplyJobApi.formatDocDataDelete({
      objectno:selectedRows.value[0].objectNo,
     objecttype:selectedRows.value[0].objectType,
    })
    message.success('删除尽职报告成功')
    // 刷新列表
    await getList()
  } catch {}
}

// 查看尽职报告
const checkDutReport = async() => {
  // ElMessage.info('功能待实现')
  if (selectedRows.value?.length != 1) return message.warning('请选择 1 条数据')

  const res =  await creditApplyJobApi.viewFormatDocData({
    objectno:selectedRows.value[0].objectNo,
     objecttype:selectedRows.value[0].objectType,
  })
  

  if(res) {
  openIframeDialog(res?.newreportno)
}



}



const dialogRef = ref() 
 const datalist = ref([])

 const visible = ref(false)
 const columns = [
{prop:'docid',label:"模板编号",minWidth:120},
{prop:'docname',label:"模板名称",minWidth:120},

]
const okPick = (rowData)=> {
  console.log('rowData',rowData);
  createFormatDocData([rowData])
}



/** 打开 IFrame Dialog */
const iframeDialogVisible = ref(false)
const iframeUrl = ref('')
const iframeTitle = ref('')

const openIframeDialog = (url: string, title: string = '详情预览') => {
  // iframeUrl.value = url
  // iframeTitle.value = title
  // iframeDialogVisible.value = true
  window.open(url,'_blank')
}

// 监听 Dialog 关闭，延迟清空 URL（避免关闭动画闪烁）
watch(iframeDialogVisible, (visible) => {
  if (!visible) {
    // Dialog 关闭后延迟清空 URL
    setTimeout(() => {
      iframeUrl.value = ''
    }, 300)
  }
})




// diaable 状态映射  现在先不用
// const buttonDisableState = {
//     detail:()=> !hasSin
// }


//查看意见
const viewPhaseOpinionRef = ref()
const viewPhaseOpinion = () => {
    if (selectedRows.value.length === 0 || selectedRows.value.length >1) {
    message.warning('请选择一条数据')
    return
  }
  viewPhaseOpinionRef.value.open({ serialNo: selectedRows.value[0].objectNo }) 
}

// 查看流转记录
const toRecord = () => {
  if (selectedRows.value?.length !== 1) {
    message.warning("请选择一条记录")
    return true
  }
  // router.push({
  //   path: 'creditreviewapprovalrecord',
  //   query: {
  //     serialNo: selectedRows.value[0].objectNo,
  //     objectType: "CreditApply",
  //     t: new Date().getTime() // 解决重复打开相同详情，详情页面不加载的问题
  //   }
  // })
  addDialog({
    title: '流转记录',
    width:"1200px",
    hideFooter: true,
    contentRenderer: ()=> (
      <FlowRecord serialNo={selectedRows.value[0].objectNo} objectType={'CreditApply'} />
    )
  })
}
const { confirmFetch } = useMessage()
// 收回
const takeBack = async () => {
  if (getSelect()) return;
  await confirmFetch({
    title: '确认收回该笔业务吗?',
    fetchFunc: ()=> CreditFlowApi.withdraw({
      serialNo: selectedRows.value[0].objectNo,
      phaseNo: selectedRows.value[0].phaseNo,
      objectType: selectedRows.value[0].objectType,
      nextUserRole: "收回",
      nextUserInfo: '',
      flag:1//申请
    })
  })
  ElMessage.success("收回成功")
  handleQuery()
}


// 查看批复通知书
const viewEdpfReport = () => {
  if (selectedRows.value?.length !== 1) {
    message.warning("请选择一条记录")
    return true
  }


  console.log('electedRows.value',selectedRows.value,)

  // loading3.value = true
  creditApplyJobApi.viewEdpfReport({
    objectNo:  selectedRows.value[0].objectNo,
  }).then(res => {
    if (res.checkflag !== 'true') {
      ElMessage.warning(res.msg)
      return
    }
    window.open(res.url)
  }).finally(() =>{})
}

// Handler 函数映射 
const buttonHandler = {
  writeDutReport,
  delDutReport,
  checkDutReport,
  apprCustType,
  handleCreate,
  checkWhiteLoading,
  doRiskDetection,
  doApprovalOpinion,
  submit,
  viewPhaseOpinion,
  toRecord,
  takeBack,
  viewEdpfReport,
  handleDetail,
  handleCancel
}


const currentButtons = ref()

const setButtons = () => {
  const routeName = props.params?.type
  if(routeName && routeNameTobuttonGroupsMap[routeName]) {
    currentButtons.value = routeNameTobuttonGroupsMap[routeName].map((button) =>({
      ...button,
      handler: buttonHandler[button.key] || (()=> {})
    }))
  }
}
setButtons()

onActivated(() => {
  getList()
})
</script>

