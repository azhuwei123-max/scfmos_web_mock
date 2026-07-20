<template>
  <ContentWrap>
    <!-- 操作栏 -->
    <!-- <div class="mb-15px flex justify-end">
      <el-button tpye="" @click="handleCreate">
        <Icon icon="ep:plus" class="mr-5px" />
        新增申请
      </el-button>
      <el-button @click="relatedWhite" :loading="checkWhiteLoading">
        关联白名单
      </el-button>
      <el-button @click="handleSignOpinion">
        签署意见
      </el-button>
      <el-button @click="doRiskDetection">
        自动风险探测
      </el-button>
      <el-button @click="submit">
        提交
      </el-button>
      <el-button @click="writeDutReport">
        填写尽职调查报告
      </el-button>
      <el-button @click="delDutReport">
        删除尽职调查报告
      </el-button>
      <el-button @click="checkDutReport">
        查看尽职调查报告
      </el-button>
    </div> -->
    
    <!-- 搜索工作栏 -->
    <div class="flex items-center mb-2 w-[110px]" @click="isExpand = !isExpand">
      <Icon v-show="!isExpand" class="mr-4px" icon="ep:plus" />
      <Icon v-show="isExpand" class="mr-4px" icon="ep:minus" />
      <el-button link> 查询条件 </el-button>
    </div>
    <el-form
      ref="queryFormRef"
      v-show="isExpand"
      :model="queryParams"
      class="search-form"
      label-width="auto"
      @keyup.enter="handleQuery"
    >
      <el-form-item label="申请编号" prop="serialNo">
        <el-input
          v-model="queryParams.serialNo"
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
      <el-form-item label="发生类型" prop="virtualOccurTypeName">
        <el-select
          v-model="queryParams.virtualOccurTypeName"
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
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
    <div class="mb-15px flex">
      <template v-for="button in currentButtons" :key="button.key">
        <el-button
         :type="button.type"
         :loading="button.loading"
         @click="handleButtonClick(button)"
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

    <relatedWhiteList ref="relatedWhiteListRef" @confirm="getList" />

    <RiskMonitor
      v-model="riskMonitorVisible"
      :risk-data="riskData"
      @confirm="handleRiskMonitorConfirm"
      @cancel="handleRiskMonitorCancel"/>




      <el-dialog
      v-model="addVisible"
      title="新增申请"
      width="850px"
      append-to-body
      destroy-on-close
      :close-on-click-modal="false"
    >
      <CreditApplicationPenddingCreate  :creditSourceFlag = "props.creditSourceFlag"   @close="close" @handle-success="handleSuccess"/>
    </el-dialog>


    <CreditFlowApproval
      v-model="creditFlowApprovalVisible"
      :serial-no="serialNo"
      :phase-no="phaseNo"
      :object-type="selectedRows?.[0]?.objectType"
      @refresh="getList"
      @cancel="handleCreditFlowApprovalCancel"
    />

     <!-- 签署意见 -->
    <ApprovalOpinion v-model="approvalOpinionVisible"  :process-instance="selectedRows" @submit="submit"/>
  </ContentWrap>


  <MiniPageSelectDialog
   ref="dialogRef" 
    v-model="visible"
    width="880"
    :columns="columns"
    @confirm="okPick"
    :data='datalist'
    
   />


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

  <apprCustTypePop ref="apprCustTypePopRef" @confirm="handleQuery" />

  <!-- 查看意见 -->
  <viewPhaseOpinionPop ref="viewPhaseOpinionRef" />
</template>

<script lang="tsx" setup>
import { ElMessageBox } from 'element-plus'
import { defaultQueryParams, tableColumns,occurrenceTypeOptions,routeNameTobuttonGroupsMap ,routeNameToProcrssTypeMap} from '../const/pendding'
import relatedWhiteList from './components/relatedWhiteList.vue'
import { applicationPenddingApi } from '@/api/creditapplication'
import CreditApplicationPenddingCreate from './create/index.vue'
import { creditApplyJobApi } from '@/api/creditapplication/creditApplyJob'
import apprCustTypePop from './components/apprCustTypePop.vue'
import ApprovalOpinion from '@/views/creditapplication/creditApplyJob/components/approvalOpinion.vue'
import * as CreditFlowApi from "@/api/creditflow";
import {addDialog, Dialog} from "@/components/Dialog";
import viewPhaseOpinionPop from '@/views/reviewapproval/credit/viewApplyPhaseOpinion/index.vue'
import download from '@/utils/download'

defineOptions({ name: 'Applicationpendding' })

const isExpand = ref(false)

const props = defineProps({
  params: Object,
  creditSourceFlag:String
})

const message = useMessage()
const router = useRouter()
const route = useRoute()
const { push, currentRoute } = router


console.log('currentRoute111',currentRoute,currentRoute.value.name);

const queryParams = reactive({ ...defaultQueryParams,creditSourceFlag:'02' })
const queryFormRef = ref()
const addVisible =ref(false)




const currentButtons = ref([])

function initCurrentButtons() {
  const routeName = props.params?.type
  if(routeName && routeNameTobuttonGroupsMap[routeName]) {
    return routeNameTobuttonGroupsMap[routeName].map((button) =>({
      ...button,
      loading: false,
      handler: buttonHandler[button.key] || (()=> {})
    }))
  }
}
onBeforeMount(()=>{
  currentButtons.value = initCurrentButtons()
})

const handleButtonClick = async (button)=>{
  try {
    button.loading = true
    await button.handler()
  } finally {
    button.loading = false
  }
}



// 使用 useTable hook
// 注意：这里需要创建对应的 API，暂时使用模拟数据
const { tableObject, tableMethods } = useTable({
  getListApi: async (params: any) => {
    // TODO: 替换为实际的 API 调用
    const res =   await applicationPenddingApi.getApplicationPenddingPage(params)

    return {
      list: res.list || [],
      total: res.total
    }
  },
  defaultParams: { ...defaultQueryParams }
})

const { getList, setSearchParams, } = tableMethods

/** 搜索按钮操作 */
const handleQuery = () => {
  setSearchParams(queryParams)
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
  const menuTitle = currentRoute.value.meta?.title || '待处理申请'
  const newTitle = `${menuTitle}-新增`

  addVisible.value = true


  // 跳转到新增页面
  // const newPath = '/creditapplication/pendding/create'
  // await push({
  //   path: newPath,
  //   query: {
  //     title: newTitle // 通过 query 传递标题，在新增页面中设置
  //   }
  // })
}


const close = () => {
  addVisible.value=false

}
const handleSuccess = (row) => {
  addVisible.value=false
  // getList()
  // handleDetail(row)
  // nextTick(()=> {
    
  // })
  setSearchParams({...queryParams,serialNo:row.serialNo})?.then(res => {
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
console.log(1111)
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

// 打开白名单
const relatedWhiteListRef = ref()
const relatedWhite = async () => {
  if (selectedRows.value?.length != 1) return message.warning('请选择')

  const result = await checkWhiteApply(selectedRows.value[0])
  if (!result) return

  relatedWhiteListRef.value.open(selectedRows.value[0])
}

// 表格选择变化
const selectedRows = ref()
const handleSelectionChange = (val) => {
  nextTick(() => {
    val ? selectedRows.value = [{objectNo: val.serialNo, ...val}] : selectedRows.value = []
  })
}

/** 申请详情操作 */
const handleDetail = async () => {
  // 跳转到详情页面，传递申请编号用于设置标题
  if (selectedRows.value?.length != 1) return message.warning('请选择 1 条数据')

   const row = selectedRows.value[0]
  
  const detailPath = `/creditapplication/pendding/peddingDetail`
  router.push({
    path: detailPath,
    query: {
      ...row,
      objectType:"CreditApply",
      serialNo : row.serialNo,
      customerID: row.customerID,
      businessType : row.businessType,
      customerType: row.customerType,
      t: new Date().getTime() // 解决重复打开相同详情，详情页面不加载的问题
    }
  })

  // await push({
  //   path: detailPath,
  //   query: {
  //     serialNo: row.serialNo // 传递申请编号，在详情页面中设置标题
  //   }
  // })
}

const toDetail = async (row) => {
  const detailPath = `/creditapplication/pendding/peddingDetail`
  router.push({
    path: detailPath,
    query: {
      ...row,
      serialNo : row.serialNo,
      businessType:row.businessType,
      objectNo:row.objectNo,
      objectType:row.objectType,
      customerID:row.customerID,
      t: Date.now() // 解决重复打开相同详情，详情页面不加载的问题
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
    // await ApplicationPenddingApi.cancelApplication(row.id)
    await creditApplyJobApi.cancelContract({ objectType: 'CreditApply', serialNo: row.serialNo })
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
const exportLoading = ref(false) // 导出的加载中

const doRiskDetection = async (rskTp = 1) => {
  if (selectedRows.value?.length != 1) return message.warning('请选择')
  riskData.value = {
    scenarioId: '001',
    rskTp: rskTp?.target ? 1 : rskTp,
    params: {
      OccurType: selectedRows.value[0].occurType,
      ObjectType: selectedRows.value[0].objectType,
      ObjectNo: selectedRows.value[0].serialNo,
      FlowNo: selectedRows.value[0].flowNo,
      PhaseNo: selectedRows.value[0].phaseNo,
      ApplyType1: selectedRows.value[0].applyType,
    }
  }
  riskMonitorVisible.value = true
  submitFlag.value = false
}

const checkCommentExec = async(serialNo,objectType,phaseNo) => {
  const resp = await creditApplyJobApi.checkComment({serialNo,objectType,phaseNo}).then(res => res)
  return resp;
}

const submit = async () => {
     
  if (selectedRows.value?.length != 1) return message.warning('请选择')

  const data = await checkCommentExec(selectedRows.value[0].serialNo,selectedRows.value[0].objectType,selectedRows.value[0].phaseNo)
  console.log("data:",data)
  if (!data?.phaseOpinion) {
   ElMessage.warning(`${selectedRows.value[0].serialNo}签署意见未保存`)
    return
  }

  await doRiskDetection(2)
  submitFlag.value = true
  // if (!selectedRows.value?.serialNo) return message.warning('请选择')
  // serialNo.value = selectedRows.value.serialNo
  // phaseNo.value = selectedRows.value.phaseNo
  // creditFlowApprovalVisible.value = true
}

const handleRiskMonitorConfirm = async (hasFailure) => {
  console.log('hasFailure',hasFailure)
  if (!submitFlag.value) {
    await handleRiskMonitorCancel()
    return
  }
  riskMonitorVisible.value = false

  serialNo.value = selectedRows.value[0].serialNo
  phaseNo.value = selectedRows.value[0].phaseNo
  creditFlowApprovalVisible.value = true
}

const handleRiskMonitorCancel = async () => {
  riskMonitorVisible.value = false
}

const handleCreditFlowApprovalCancel = () => {
  creditFlowApprovalVisible.value = false
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


const getSelect = () => {
  if(selectedRows.value.length !== 1) {
    message.warning("请选择一条记录")
    return true
  }
  selectRow.value = selectedRows.value[0]
  return false
}

const currentPhaseType = ref()

const setPhaseType = () => {
  const routeName = props.params?.type
  if(routeName&&typeof routeName==='string') {
    currentPhaseType.value = routeNameToProcrssTypeMap[routeName] || undefined
  }
}
setPhaseType()


const updateQueryByPhaseType = () => {
  const processType = currentPhaseType.value
  console.log('processTypeprocessType',processType);
  if(processType !== undefined) {
    ;(queryParams as any).phaseType = processType
        setSearchParams(queryParams)
  }
}

onMounted(()=> {
  updateQueryByPhaseType()
  getList()
})




// const lastRouteName = ref(null)

//  watch(
//   ()=> currentRoute.value.name,
//   (routeName)=> {
//     if(routeName === lastRouteName.value) return

//     if(routeName && typeof routeName ==='string') {
//       lastRouteName.value = routeName
//       const processType = routeNameToProcrssTypeMap[routeName]
//       console.log('processTypePenfinsdfg22',processType);
//       if(processType !== undefined) {
//         console.log('processTypePenfinsdfg22qqqq',processType);
//         ;(queryParams as any).phaseType = processType
//         setSearchParams(queryParams)
//       }else {
//         ;(queryParams as any).phaseType = undefined
//       }
     
//       // getList()
//     }else {
//       lastRouteName.value = null
//     }
//   },
//   {immediate:true}
// )





// 填写尽职报告
const writeDutReport =async () => {
  // ElMessage.info('功能待实现')
  // creditApplyJobApi.aa({}).then(res => {
  // })

  if (selectedRows.value?.length != 1) return message.warning('请选择 1 条数据')
  const res = await creditApplyJobApi.getFormatDocData({
    objectno:selectedRows.value[0].serialNo,
    objecttype:selectedRows.value[0].objectType,
  })


  if(res == null) {
    


    const status = await creditApplyJobApi.genReportCheck({
      objectno:selectedRows.value[0].serialNo,
     objecttype:selectedRows.value[0].objectType,
    })


    
     
    if(!status.data && status !== true) {
     await ElMessageBox.confirm(status.msg,'提示',{
      confirmButtonText:'继续',
      cancelButtonText:'取消',
      type:"warning"
     })
    }

    const res2 =  await creditApplyJobApi.getTemplateList({
     objectno:selectedRows.value[0].serialNo,
     objecttype:selectedRows.value[0].objectType,
   })
     
   console.log('resresresres1111',res2);
    // datalist.value = [...res2,...res2]
  // getDataList()

   await createFormatDocData(res2)
   
  }


  
  if(res) {

    await ElMessageBox.confirm('重新填写调查报告后，需要重新查看生成调查报告，您要确定重新填写吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      // beforeClose: async (action, instance, done) => {
      //   if(action === 'confirm') {
      //     try {
      //       instance.confirmButtonLoading = true
      //       instance.cancelButtonLoading = true
      //       await  createFormatDocData([res])
      //       done()
      //     } finally {
      //       instance.confirmButtonLoading = false
      //       instance.cancelButtonLoading = false
      //     }
          
      //   }else {
      //     done()
      //   }
      // }
    })
    await  createFormatDocData([res])
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
  
  try {
    tableObject.loading = true
    const res = await creditApplyJobApi.createFormatDocData({
     objectno:selectedRows.value[0].serialNo,
     objecttype:selectedRows.value[0].objectType,
     docid:list[0].docid,
     customerid:selectedRows.value[0].customerID
    })
    console.log('最后一步',res);
    
    if(res) {
      openIframeDialog(res)
    }

  } finally {
    tableObject.loading = false
  }
  

}


//删除尽填写报告
const delDutReport = async () => {
  if (selectedRows.value?.length != 1) return message.warning('请选择一条记录')
  await ElMessageBox.confirm('是否删除尽职调查报告', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await creditApplyJobApi.formatDocDataDelete({
    objectno:selectedRows.value[0].serialNo,
     objecttype:selectedRows.value[0].objectType,
  })


  if(res) {
    message.success('删除成功')
    getList()
  }

  
}


// 查看尽填写报告
const checkDutReport =  async () => {
  // await ElMessageBox.confirm('是否删除尽职调查报告', '提示', {
  //     confirmButtonText: '确定',
  //     cancelButtonText: '取消',
  //     type: 'warning'
  //   })

    if (selectedRows.value?.length !== 1) return message.warning('请选择一条记录')

    const res = await creditApplyJobApi.viewFormatDocData({
    objectno:selectedRows.value[0].serialNo,
     objecttype:selectedRows.value[0].objectType,
  })


  console.log('resres',res);
if(res) {
  openIframeDialog(res?.newreportno)
}
}

// 签署意见
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

const handleSignOpinion = () => {
  
  if(selectedRows.value.length !== 1) {
    message.warning("请选择一条记录")
    return
  }

  approvalOpinionVisible.value=true
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


//查看意见
const viewPhaseOpinionRef = ref()
const viewPhaseOpinion = () => {
  console.log('asdasdasdasasd');
  
    if (selectedRows.value?.length !== 1) {
    message.warning('请选择一条数据')
    return
  }

  viewPhaseOpinionRef.value.open(selectedRows.value[0])
  //   router.push({
  //   path: 'viewApplyPhaseOpinion',
  //   query: {
  //     serialNo: selectedRows.value[0].objectNo
  //   }
  // })

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
    fetchFunc: ()=> CreditFlowApi.submit({
      serialNo: selectedRows.value[0].serialNo,
      phaseNo: selectedRows.value[0].phaseNo,
      objectType: selectedRows.value[0].objectType,
      nextUserRole: "收回",
      nextUserInfo: '',
      objectType:'CreditApply'
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

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await creditApplyJobApi.singleExport(queryParams)
    download.excel(data, '单笔业务授信申请列表.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}


// 审批客户分类
const apprCustTypePopRef = ref()
const apprCustType = async () => {
  if (selectedRows.value?.length != 1) return message.warning('请选择 1 条')

  apprCustTypePopRef.value.open(selectedRows.value[0])
}

// Handler 函数映射 
const buttonHandler = {
  writeDutReport,
  delDutReport,
  checkDutReport,
  apprCustType,
  handleCreate,
  relatedWhite,
  doRiskDetection,
  doApprovalOpinion,
  submit,
  viewPhaseOpinion,
  toRecord,
  takeBack,
  viewEdpfReport,
  handleCancel,
  handleDetail,
  handleExport
}

onActivated(() => {
  getList()
})

</script>

