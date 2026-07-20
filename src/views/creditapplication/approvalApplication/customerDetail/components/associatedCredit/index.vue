<template>
   <ContentWrap>
     <!-- 操作栏 -->
     <div class="mb-15px flex justify-end">
     <!--  <el-button @click="handleCreate">
        <Icon icon="ep:plus" class="mr-5px" />
        新增
      </el-button> -->
      <el-button @click="delDutReport">
        查看关联额度详情
      </el-button>
      <el-button @click="checkUsage">
        额度使用查询
      </el-button>
      <!-- <el-button type="" @click="handleDelete">
        删除
      </el-button> -->
      <el-button @click="watchInvesigation">
        查看调查报告
      </el-button>
      <el-button @click="watchApproval">
        查看批复通知书
      </el-button>
    </div>

    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="额度名称" prop="businesstypename">
        <el-input
          v-model="queryParams.businesstypename"
          placeholder="请输入额度名称"
          clearable
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="额度金额" prop="businesssum">
        <el-input
          v-model="queryParams.businesssum"
          placeholder="请输入额度金额"
          clearable
        
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="敞口金额" prop="exposuresum">
        <el-input
          v-model="queryParams.exposuresum"
          placeholder="请输入敞口金额"
          clearable
         
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="当前业务敞口" prop="curexposuresum">
        <el-input
          v-model="queryParams.curexposuresum"
          placeholder="请输入业务敞口"
          clearable
         
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>

   </ContentWrap>

   
   <ContentWrap>
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
      @row-dblclick="delDutReport"
    />
   </ContentWrap>
   <CreditLimitFormDialog
     ref="creditLimitFormDialogRef"
     v-model="createDialogVisible"
     :pageParams="_pageParams"
     @submit="handleCreateSubmit"
     @cancel="handleCreateCancel"
   />
   

   <!-- <ContentWrap v-if="showIframe" >
      <span>关联额度详情</span>
      <IFrame :src="iframeUrl" :auto-height="true" />
  </ContentWrap> -->


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

</template>


<script lang="ts" setup>
/**
 * 注意！！！！！
 * 该页面为公共页面，修改时注意通用性
 */
import { tableColumns } from './const'
import { associatedCreditApi } from '@/api/creditapplication/associatedCredit' 


import CreditLimitFormDialog from './component/create.vue'

// 其他父级组件传来的页面参数，用来替代route中的参数
const props = defineProps({
  pageParams: {
    type: Object,
    default: () => ({})
  }
})

const route = useRoute() // 路由对象

// 页面参数，凡是组件外的参数，都用这个！！。
// 该组件还会在其他地方被嵌套，所以在route拿不到的参数从props里面拿
const _pageParams = Object.assign({}, route.query, props.pageParams)

const message  = useMessage()


const router = useRouter() // 路由



const queryFormRef = ref()
const selectedRows = ref<any[]>([])


const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  objectno:_pageParams.serialNo,
  objecttype:'CreditApply',
  businesstypename:'',
  curexposuresum:'',
  exposuresum:'',
  businesssum:''
 })


defineOptions({ name: 'associatedCredit' })

// 使用 useTable hook
// 注意：这里需要创建对应的 API，暂时使用模拟数据
const { tableObject, tableMethods } = useTable({
  getListApi: async (params: any) => {
    // TODO: 替换为实际的 API 调用
    const res =   await associatedCreditApi.getList(params)
   
    return {
      list: res.list || [],
      total: res.total
    }
  },
  defaultParams: { ...queryParams }
})


const { getList, setSearchParams } = tableMethods

/** 搜索按钮操作 */
const handleQuery = () => {
  setSearchParams(queryParams)
  // getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  Object.assign(queryParams)
  handleQuery()
}


const handleSelectionChange = (val) => {
  val ? selectedRows.value = [val] : selectedRows.value = []
}



/** 初始化 */
onMounted(() => {
  getList()
})





const handleCreate = () => {
  // 新增
  if(creditLimitFormDialogRef.value) {
    creditLimitFormDialogRef.value.open()
  }else {
    creditLimitFormDialogRef.value = true
  }
}

// const iframeUrl = ref('')
const showIframe = ref(false)
const delDutReport =async () => {
 // 查看关联额度详情

 if (selectedRows.value.length === 0 || selectedRows.value.length >1) {
    message.warning('请选择一条数据')
    return
  }

  router.push({
    path: '/contractIssuanceMGM/creditLineDetail',
    query: {
      businessType: selectedRows.value[0].businesstype,
      customerID: selectedRows.value[0].customerid,
      serialNo: selectedRows.value[0].relativeserialno,
      t: Date.now()
    }
  })

  

//  const res = await associatedCreditApi.getIframeUrl({
//   tpopentype:'CreditLineUseListMerge',
//   tpserialno:selectedRows.value[0].relativeserialno
//  })
  

//  console.log('res',res);
 

//  openIframeWindow(res)
// openIframeDialog(res,`关联额度详情`)

  // router.push({
  //   path: '/contractIssuanceMGM/creditLineDetail',
  //   query: {
  //     businessType: selectedRows.value[0].businesstype,
  //     customerID:selectedRows.value[0].customerid,
  //     serialNo: selectedRows.value[0].serialno,
  //   }
  // })

}

/** 打开 IFrame Dialog */
const iframeDialogVisible = ref(false)
const iframeUrl = ref('')
const iframeTitle = ref('')

const openIframeDialog = (url: string, title: string = '详情预览') => {
  iframeUrl.value = url
  iframeTitle.value = title
  iframeDialogVisible.value = true
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



const openIframeWindow = (url) => {
  iframeUrl.value = url
  showIframe.value = true
}

const checkUsage =async () => {
// 额度使用查询
 if (selectedRows.value.length === 0 || selectedRows.value.length >1) {
    message.warning('请选择一条数据')
    return
  }
  


 const res = await associatedCreditApi.getIframeUrl({
  tpopentype:'CreditLineUseListMergePage',
  tpserialno:selectedRows.value[0].relativeserialno
 })
  

 console.log('res',res);
 

//  openIframeWindow(res)
openIframeDialog(res,`关联额度详情`)
}

const watchInvesigation =async () => {
  // 产看调查报告
  if (selectedRows.value.length === 0 || selectedRows.value.length >1) {
    message.warning('请选择一条数据')
    return
  }
  
 const res = await associatedCreditApi.handleViewDcbg({
 objectno:selectedRows.value[0].relativeserialno,
 //objectno:'BC2025120900000001',
  objecttype: "BusinessContract",
 })

 console.log('产看调查报告',res);
//  openIframeDialog(res.newreportno,`调查报告-${res?.serialno}`)
  window.open(res.newreportno)
//  openIframeWindow(res)

}
const watchApproval =async () => {
  // 查看批复通知书
   if (selectedRows.value.length === 0 || selectedRows.value.length >1) {
    message.warning('请选择一条数据')
    return
  }

    
 const res = await associatedCreditApi.handleViewEdpfReport({
  objectNo:selectedRows.value[0].relativeserialno,
  // objectNo:'BC2025012300000051',
 //objectno:'BC2025120900000001'
 })
  if (res.checkflag !== 'true') {
    ElMessage.warning(res.msg)
    return
  }

 console.log('查看批复通知书',res);
//  openIframeDialog(res.url,`调查报告-${selectedRows.value[0].relativeserialno}`)
window.open(res.url)


}


const handleDelete =async () => {
// 删除

  if (selectedRows.value.length === 0 || selectedRows.value.length >1) {
    message.warning('请选择一条数据')
    return
  }
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await associatedCreditApi.deleteCreditLine(selectedRows.value[0].serialno)
    message.success('删除成功')
    // 刷新列表
    getList()
  } catch {}
  


  
}


const creditLimitFormDialogRef = ref()
const createDialogVisible = ref(false)

const handleCreateSubmit = async (data) => {
  try {

    const res =  await associatedCreditApi.handleCreate({
      objectno:_pageParams.objectNo,
      objecttype:_pageParams.objectType,
      relativeserialno:data.quotaNo
    })

    if(res) {
      message.success('新增成功')
      createDialogVisible.value = false
      nextTick(()=> {
        getList()
      })
     
    }
    
  } catch(error) {
   
  }
}


const handleCreateCancel = async (data) => {
  try {
     message.success('新增成功')
  } catch {

  }
}










</script>
