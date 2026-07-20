<template>
  <div class="dy-container">
    <!-- 左侧菜单 -->
    <div class="!mr-20px dy-container-left">
      <div class="side-item-list">
        <!-- 主菜单项（带子集） -->
        <template v-for="item in leftMenuList" :key="item.value">
          <div class="menu-group">
            <div
              class="side-item group-header"
              :class="{ 'group-expanded': item.expanded }"
              @click="toggleGroup(item)"
            >
              <Icon v-if="item.children && item.children.length" class="mr-5px" icon="ep:folder-opened" />
              <div v-else class="w-1.5 h-1.5 bg-[#5ce472] mr-1.5"></div>
              <span class="side-item-text">
                {{ item.label }}
              </span>
              <Icon v-if="item.children && item.children.length" size="12" :icon="item.expanded ? 'ep:arrow-up' : 'ep:arrow-down'" class="group-icon" />
            </div>
            <div v-if="item.expanded && item.children" class="group-children">
              <div
                v-for="(child, childIndex) in item.children"
                :key="childIndex"
                :class="activeMenu === child.value && currentType == child.type ? 'side-item-select' : 'side-item-default'"
                class="side-item side-item-child"
                @click="handleMenuClick2(child)"
              >
                <div class="w-1.5 h-1.5 bg-[#5ce472] mr-1.5"></div>
                <span class="side-item-text">{{ child.label }} {{ child.count }}件</span>
                <!-- <el-badge
                  v-if="child.count !== undefined && child.count > 0"
                  :max="99"
                  :value="child.count"
                  class="side-item-badge"
                /> -->
              </div>
            </div>
            <!-- 加载中状态 -->
            <div
              v-if="menuLoading && (!item.children || item.children.length === 0)"
              class="loading-item"
            >
              <Icon icon="svg-spinners:180-ring" class="is-loading" />
              <span>加载中...</span>
            </div>
          </div>
        </template>
      </div>
    </div>
    <!-- 右侧内容区域（一整块） -->
    <div class="dy-container-right">
      <ContentWrap>

        <div class="flex items-center mb-2 w-[110px]" @click="isExpand = !isExpand">
      <Icon v-show="!isExpand" class="mr-4px" icon="ep:plus" />
      <Icon v-show="isExpand" class="mr-4px" icon="ep:minus" />
      <el-button link> 查询条件 </el-button>
    </div>
        <!-- 操作栏 -->
<!--        <div class="mb-15px flex justify-between items-center">-->
<!--          <div></div>-->
<!--          <el-button tpye="" @click="handleCreate">-->
<!--            <Icon icon="ep:plus" class="mr-5px" />-->
<!--            新增申请-->
<!--          </el-button>-->
<!--        </div>-->

        <!-- 搜索表单 -->
        <el-form
          class="mb-15px search-form"
          :model="queryParams"
          v-show="isExpand"
          ref="queryFormRef"
          label-width="68px"
          @keyup.enter="handleQuery"
        >
          <el-form-item label="流水编号" prop="serialNo">
            <el-input
              v-model="queryParams.serialNo"
              placeholder="请输入流水编号"
              clearable
              @keyup.enter="handleQuery"
              class="!w-240px"
            />
          </el-form-item>
          <el-form-item label="客户名称" prop="applicantName">
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
<!--          <el-form-item label="业务品种" prop="businessType">-->
<!--            <el-input-->
<!--              v-model="queryParams.businessType"-->
<!--              placeholder="请输入业务品种"-->
<!--              clearable-->
<!--              @keyup.enter="handleQuery"-->
<!--              class="!w-240px"-->
<!--            />-->
<!--          </el-form-item>-->
          <el-form-item label="发生类型" prop="virtualOccurType">
            <el-select
              v-model="queryParams.virtualOccurType"
              placeholder="请选择发生类型"
              clearable
              class="!w-240px"
            >
              <el-option
                v-for="item in occurrenceTypeOptions"
                :key="item.itemNo"
                :label="item.itemName"
                :value="item.itemNo"
              />
            </el-select>
          </el-form-item>
<!--          <el-form-item label="补件状态" prop="status">-->
<!--            <el-select-->
<!--              v-model="queryParams.status"-->
<!--              placeholder="请选择补件状态"-->
<!--              clearable-->
<!--              class="!w-240px"-->
<!--            >-->
<!--              <el-option-->
<!--                v-for="item in statusTypeOptions"-->
<!--                :key="item.value"-->
<!--                :label="item.label"-->
<!--                :value="item.value"-->
<!--              />-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <el-form-item label="完成时间" prop="completeTime">
            <el-date-picker
              v-model="queryParams.endTime"
              type="date"
              placeholder="请选择完成时间"
              value-format="YYYY/MM/DD"
              clearable
              class="!w-240px"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="handleQuery"  tpye=""
              ><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button
            >
            <el-button @click="resetQuery"
              ><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button
            >
          </el-form-item>
        </el-form>
        
        <div   style="display: flex; justify-content: space-between; margin-bottom: 17px">
          <!-- <div style="font-size: 18px; font-weight: 700"> 查询结果</div> -->
          <div>
            <el-button @click="goDetail" plain type="">
              申请详情
            </el-button>
            <el-button @click="watchInvesigation" plain type="">
              查看调查报告
            </el-button>
            <el-button @click="viewPhaseOpinion" plain type="">
              查看审批意见
            </el-button>
            <el-button v-if="currMenu?.type === 'N'" @click="handleSignOpinion" plain type="">
              签署意见
            </el-button>
            <el-button v-if="currMenu?.type == 'N'" @click="submit" plain type="">
              提交
            </el-button>
            <el-button v-if="currMenu?.type === 'N'" @click="doBack" plain type="">
              退回前一步
            </el-button>
            <el-button v-if="currMenu?.type === 'N' && !['0235','0031'].includes(currMenu?.phaseNo)" @click="doRiskDetection" plain type="">
              自动风险探测 
            </el-button>
            <el-button v-if="currMenu?.type === 'N'" @click="doMoreBack" plain type="">
              否决/退补
            </el-button>

<!--            <el-button v-if="currMenu?.type === 'Y'" @click="submit"plain type="">-->
<!--              查看审批意见-->
<!--            </el-button>-->
            <el-button v-if="currMenu?.type === 'Y'" @click="toRecord" plain type="">
              查看流转记录
            </el-button>
            <el-button v-if="currMenu?.type === 'Y'" @click="takeBack" plain type="">
              收回
            </el-button>

            <el-button
              type=""
              plain
              @click="handleExport"
              :loading="exportLoading">
              <Icon icon="ep:download" class="mr-5px" /> 导出
            </el-button>
          </div>
        </div>

        <!-- 表格 -->
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
          @row-dblclick="goDetail"
        >
          <template #action="{ row }">
            <el-button link tpye="" @click="handleDetail(row)">申请详情</el-button>
            <el-button link tpye="" @click="handleApprovalOpinion(row)">审批意见</el-button>
            <el-button link type="" @click="handleCancel(row)">取消申请</el-button>
          </template>
        </Table>
      </ContentWrap>
    </div>
  </div>

  <!-- 签署意见 -->
  <ApprovalOpinion v-model="approvalOpinionVisible"  :process-instance="selectedRows" @submit="hanldesubmit"/>

  <CreditFlowApproval
    v-model="creditFlowApprovalVisible"
    :serial-no="serialNo"
    :phase-no="phaseNo"
    :object-type="selectRow?.objecttype"
    :nextUserInfoRequired="false"
    @confirm="handleCreditFlowApprovalConfirm"
    @cancel="handleCreditFlowApprovalCancel"
  />


  <RiskMonitor
    v-model="riskMonitorVisible"
    :risk-data="riskData"
    @confirm="handleRiskMonitorConfirm"
    @cancel="handleRiskMonitorCancel"/>

  <Dialog v-model="backMsgConfirmShow" title="提示">
    <span>您确认要将该申请退回上一环节吗？</span>
    <template #footer>
      <el-button tpye=""  @click="backConfirm">确 认</el-button>
      <el-button @click="backMsgConfirmShow = false">取 消</el-button>
    </template>
  </Dialog>


  <Dialog v-model="moreBackMsgConfirmShow" title="请选择">
    <el-select
      v-model="nextUserRole"
      placeholder="意见类型"
      clearable
      class="!w-300px"
    >
      <el-option label="退回补件" value="退回补件"/>
      <el-option label="退回补充资料" value="退回补充资料"/>
      <el-option label="否决" value="否决"/>
    </el-select>
    <template #footer>
      <el-button tpye=""  @click="moreBackConfirm">确 认</el-button>
      <el-button @click="moreBackMsgConfirmShow = false">取 消</el-button>
    </template>
  </Dialog>


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


  <viewPhaseOpinionPop ref="viewPhaseOpinionRef" />
</template>

<script lang="tsx" setup>
import {ElMessage, ElMessageBox} from 'element-plus'
import { defaultQueryParams, tableColumnsY,tableColumnsN,statusTypeOptions } from './const'
// import { defaultQueryParams, tableColumnsY, tableColumnsN,statusTypeOptions } from './const'
import { Table } from '@/components/Table'
import { IFrame } from '@/components/IFrame'
import {addDialog, Dialog} from '@/components/Dialog'
import * as api from "./api";
import * as CreditFlowApi from "@/api/creditflow";
import {associatedCreditApi} from "@/api/creditapplication/associatedCredit";
import ApprovalOpinion from '@/views/creditapplication/creditApplyJob/components/approvalOpinion.vue'
import download from "@/utils/download";
import viewPhaseOpinionPop from '@/components/viewApplyPhaseOpinion/index.vue'
import { useOldDictStore } from '@/store/modules/oldDict'

defineOptions({ name: 'Applicationpendding' })

const message = useMessage()
const router = useRouter()
const { push, currentRoute } = router

const queryParams = reactive({ ...defaultQueryParams })
const queryFormRef = ref()

const currentType =ref('N')
const tableColumns = computed(()=> currentType.value === 'N'? tableColumnsN: tableColumnsY)


const isExpand = ref(false)

const { getDictFetch, getDictOptions } = useOldDictStore()

// 发生类型选项
const occurrenceTypeOptions = ref([])
getDictFetch(['OccurType']).then(()=>{
  occurrenceTypeOptions.value = getDictOptions('OccurType')
  console.log('[ occurrenceTypeOptions.value ] >', occurrenceTypeOptions.value)
})

// 菜单项类型定义
interface MenuChildItem {
  label: string
  value: string
  count?: number
}

interface MenuItem {
  label: string
  value: string
  expanded: boolean
  children?: MenuChildItem[]
}

// 左侧菜单列表（两个固定的主菜单）
const leftMenuList = ref<MenuItem[]>([
  {
    label: '当前工作',
    value: 'currentWork',
    expanded: true,
    children: []
  },
  {
    label: '已完成工作',
    value: 'completedWork',
    expanded: true,
    children: []
  }
])

// 菜单加载状态
const menuLoading = ref(false)

// 当前选中的菜单
const activeMenu = ref('')

// 菜单点击事件
const handleMenuClick = (item: MenuChildItem) => {

  currMenu.value = item
  console.log(currMenu)
  activeMenu.value = item.value
  currentType.value= item.type
  // 根据选中的菜单更新查询条件，传递菜单值作为参数
  // 重置页码到第一页
  tableObject.currentPage = 1

  // resetQuery()
  // 更新查询参数，将菜单值传递给接口
  setSearchParams({
    phaseNo: item.phaseNo, // 传递菜单值，根据实际接口参数名调整
    flowNo: item.flowNo, // 可选：传递菜单标签
    type: item.type
  })
}

const handleMenuClick2 = (item: MenuChildItem) => {

currMenu.value = item
console.log(currMenu)
activeMenu.value = item.value
currentType.value= item.type
// 根据选中的菜单更新查询条件，传递菜单值作为参数
// 重置页码到第一页
tableObject.currentPage = 1

resetQuery()
// 更新查询参数，将菜单值传递给接口
setSearchParams({
  phaseNo: item.phaseNo, // 传递菜单值，根据实际接口参数名调整
  flowNo: item.flowNo, // 可选：传递菜单标签
  type: item.type
})
}

// 切换分组展开/折叠
const toggleGroup = (item: MenuItem) => {
  item.expanded = !item.expanded
  // 如果展开且还没有加载子菜单，则加载
  if (item.expanded && (!item.children || item.children.length === 0)) {
    loadMenuChildren(item)
  }
}

// 加载菜单子集数据
const loadMenuChildren = async (menuItem: MenuItem) => {
  try {
    menuLoading.value = true

    // TODO: 替换为实际的接口调用
    // 根据菜单项的值调用不同的接口
    let apiMethod
    let type = 'N'
    if (menuItem.value === 'currentWork') {
      // 调用"当前工作"的接口
      apiMethod = getCurrentWorkMenuList
      type = 'N'
    } else if (menuItem.value === 'completedWork') {
      // 调用"已完成工作"的接口
      apiMethod = getCompletedWorkMenuList
      type = 'Y'
    } else {
      return
    }

    const res = await apiMethod()

    // 将接口返回的数据转换为菜单子集格式
    if (res && res.list) {
      menuItem.children = res.list.map((item: any) => ({
        label: item.phaseName,
        value: `${item.flowNo}${item.phaseNo}`, 
        count: item.workCount, 
        flowNo:item.flowNo,
        phaseNo:item.phaseNo,
        type
      }))
    } else if (Array.isArray(res)) {
      menuItem.children = res.map((item: any) => ({
        label: item.phaseName,
        value: `${item.flowNo}${item.phaseNo}`, 
        count: item.workCount, 
        flowNo:item.flowNo,
        phaseNo:item.phaseNo,
        type
      }))
    }
  } catch (error) {
    console.error('加载菜单子集失败:', error)
    message.error('加载菜单数据失败')
    menuItem.children = []
  } finally {
    menuLoading.value = false
  }
}

// 获取"当前工作"的菜单列表
const getCurrentWorkMenuList = async () => {
  // TODO: 替换为实际的接口调用
   return await api.getCustomerView({
    type:"N",
    creditSourceFlag:"02"
   })
}

// 获取"已完成工作"的菜单列表
const getCompletedWorkMenuList = async () => {
  // TODO: 替换为实际的接口调用
   return await api.getCustomerView({
    type:"Y",
    creditSourceFlag:"02"
   })

}
const currMenu = ref()
// 初始化加载菜单数据（合并请求两个接口）
const loadMenuData = async () => {
  try {
    menuLoading.value = true

    // 同时请求两个接口
    const [currentWorkRes, completedWorkRes] = await Promise.all([
      getCurrentWorkMenuList(),
      getCompletedWorkMenuList()
    ])
    // 将数据分别挂到对应的菜单项
    const currentWorkMenu = leftMenuList.value.find((item) => item.value === 'currentWork')
    const completedWorkMenu = leftMenuList.value.find((item) => item.value === 'completedWork')
    if (currentWorkMenu && currentWorkRes) {
     if (Array.isArray(currentWorkRes) && currentWorkRes != null &&  currentWorkRes.length != 0) {
        currentWorkMenu.children = currentWorkRes.map((item: any) => ({
          label: item.phaseName,
          value: `${item.flowNo}${item.phaseNo}`,
          count: item.workCount,
          flowNo:item.flowNo,
          phaseNo:item.phaseNo,
          type: 'N'
        }))
      }
    }
    if (completedWorkMenu && completedWorkRes) {
       if (Array.isArray(completedWorkRes) && completedWorkRes != null &&  completedWorkRes.length != 0) {
        completedWorkMenu.children = completedWorkRes.map((item: any) => ({
          label: item.phaseName,
          value: `${item.flowNo}${item.phaseNo}`,
          count: item.workCount,
          flowNo:item.flowNo,
          phaseNo:item.phaseNo,
          type: 'Y'
        }))
      }
    }
    if(currentWorkMenu?.children?.length && !activeMenu.value) {
      leftMenuList.value[0].expanded = true
      leftMenuList.value[1].expanded = false
      handleMenuClick(currentWorkMenu.children[0])
      return
    }
    if(completedWorkMenu?.children?.length && !activeMenu.value) {
      leftMenuList.value[1].expanded = true
      leftMenuList.value[0].expanded = false
      handleMenuClick(completedWorkMenu.children[0])
      return
    }
  } catch (error) {
    console.error('加载菜单数据失败:', error)
    message.error('加载菜单数据失败')
  } finally {
    menuLoading.value = false
  }
}



// 使用 useTable hook
// 注意：这里需要创建对应的 API，暂时使用模拟数据
const { tableObject, tableMethods } = useTable({
  getListApi: async (params: any) => {
    // TODO: 替换为实际的 API 调用
    // 注意：params 中会包含 menuValue 参数（从菜单点击传入）
    params.creditSourceFlag = '02'
    // return await api.getList(params)
    if(params.phaseNo === null || params.phaseNo === undefined || params.phaseNo === ""){
      return ;
    }
    const res =  await api.getList(params)

    // 模拟接口延迟
    // await new Promise((resolve) => setTimeout(resolve, 300))

    console.log('表格查询参数:', params,res) // 调试用，可以看到传入的参数包括 menuValue

    // 根据查询条件过滤数据
    // let filteredList = [...mockDataList]

    // 如果有菜单值，可以根据菜单值进行过滤（示例逻辑，根据实际需求调整）
    if (params.menuValue) {
      // 示例：根据菜单值过滤数据
      // filteredList = filteredList.filter((item) => item.status === params.menuValue)
    }

   
    // 分页处理
    // const pageNo = params.pageNo || 1
    // const pageSize = params.pageSize || 10
    // const start = (pageNo - 1) * pageSize
    // const end = start + pageSize
    // const paginatedList = filteredList.slice(start, end)

    return {
      list: res.list,
      total: res.total
    }
  },
  defaultParams: { ...defaultQueryParams }
})

const { getList, setSearchParams } = tableMethods

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.phaseNo = currMenu.value?.phaseNo
  queryParams.flowNo = currMenu.value?.flowNo
  setSearchParams(queryParams)
  // 注意：setSearchParams 内部已经会调用 getList()，所以这里不需要再调用
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  Object.assign(queryParams, defaultQueryParams)
  handleQuery()
}

/** 新增申请操作 */
const handleCreate = async () => {
  // 获取当前路由的菜单标题
  const menuTitle = currentRoute.value.meta?.title || '待处理申请'
  const newTitle = `${menuTitle}-新增`

  // 跳转到新增页面
  const newPath = '/creditapplication/pendding/create'
  await push({
    path: newPath,
    query: {
      title: newTitle // 通过 query 传递标题，在新增页面中设置
    }
  })
}

/** 申请详情操作 */
const handleDetail = async (row: any) => {
  // 在 IFrame Dialog 中打开详情页面
  openIframeDialog(
    `/creditapplication/pendding/detail/${row.id}`,
    `申请详情 - ${row.applicationNo}`
  )
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

/** 审批意见操作 */
const handleApprovalOpinion = async (row: any) => {
  // 在 IFrame Dialog 中打开审批意见页面
  const opinionPath = `/creditapplication/pendding/approval-opinion/${row.id}?applicationNo=${row.applicationNo}`
  openIframeDialog(opinionPath, `审批意见 - ${row.applicationNo}`)
}

/** 取消操作 */
const handleCancel = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要取消该申请吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    // TODO: 调用取消接口
    // await ApplicationPenddingApi.cancelApplication(row.id)
    message.success('取消成功')
    await getList()
  } catch {
    // 用户取消操作，忽略 row 参数未使用的警告
    void row
  }
}

const handleCreditFlowApprovalConfirm = ()=> {
  loadMenuChildren(leftMenuList.value[0])
  loadMenuChildren(leftMenuList.value[1])
  handleQuery()
}

const selectedRows = ref<any[]>([])

const handleSelectionChange = (val) => {
  val ? selectedRows.value = [{objectNo: val.objectno, ...val}] : selectedRows.value = []
}

const backMsgConfirmShow = ref(false)

const doBack = async () => {
  if (getSelect()) return;
  backMsgConfirmShow .value = true

}

const goDetail = () => {
  if (selectedRows.value.length !== 1) {
    message.warning("请选择一条记录")
    return true
  }
  const detailPath = `/creditapplication/pendding/peddingDetail`
  router.push({
    path: detailPath,
    query: {
      objectType: "CreditApply",
      serialNo : selectedRows.value[0].objectno,
      objectNo: selectedRows.value[0].objectNo,
      customerID: selectedRows.value[0].customerid,
      businessType: selectedRows.value[0].businesstype,
      type:currentType.value,
      t: new Date().getTime() // 解决重复打开相同详情，详情页面不加载的问题
    }
  })
}

const handleDblClick = (row) => {
  const detailPath = `/creditapplication/pendding/peddingDetail`
  router.push({
    path: detailPath,
    query: {
      objectType: "CreditApply",
      serialNo : row.objectno,
      objectNo: row.objectNo,
      customerID: row.customerid,
      businessType: row.businesstype,
      type:currentType.value,
      t: new Date().getTime() // 解决重复打开相同详情，详情页面不加载的问题
    }
  })
}
const toRecord = () => {
  if (selectedRows.value?.length !== 1) {
    message.warning("请选择一条记录")
    return true
  }
  // router.push({
  //   path: 'creditreviewapprovalrecord',
  //   query: {
  //     serialNo: selectedRows.value[0].objectno,
  //     objectType: "CreditApply",
  //     t: new Date().getTime() // 解决重复打开相同详情，详情页面不加载的问题
  //   }
  // })
  addDialog({
    title: '流转记录',
    width:"1200px",
    hideFooter: true,
    contentRenderer: ()=> (
      <FlowRecord serialNo={selectedRows.value[0].objectno} objectType={'CreditApply'} />
)
})
}

const backConfirm = async () => {
  await CreditFlowApi.submit({
    serialNo: selectRow.value.objectno,
    phaseNo: selectRow.value.phaseno,
    objectType: "CreditApply",
    nextUserRole: '退回前一步',
    nextUserInfo: '',
    
  })
  ElMessage.success("退回成功")
  backMsgConfirmShow.value = false
  handleQuery()
}

const nextUserRole = ref('')
const moreBackMsgConfirmShow = ref(false)

const doMoreBack = async () => {
  if (getSelect()) return;
  nextUserRole.value = ''
  moreBackMsgConfirmShow.value = true

}
const moreBackConfirm = async () => {
  if (!nextUserRole.value) {
    ElMessage.warning("请选择一意见")
    return;
  }
  await CreditFlowApi.submit({
    serialNo: selectRow.value.objectno,
    phaseNo: selectRow.value.phaseno,
    objectType: "CreditApply",
    nextUserRole: nextUserRole.value,
    nextUserInfo: '',
    ftSerialNo:selectRow.value.ftSerialNo
  })
  ElMessage.success(nextUserRole.value + "成功")
  moreBackMsgConfirmShow.value = false
  handleQuery()
}
const { confirmFetch } = useMessage()
const takeBack = async () => {
  if (getSelect()) return;
  await confirmFetch({
    title: '确认收回该笔业务吗?',
    fetchFunc: ()=> CreditFlowApi.submit({
      serialNo: selectRow.value.objectno,
      phaseNo: selectRow.value.phaseno,
      ftSerialNo:selectRow.value.ftSerialNo,
      objectType: "CreditApply",
      nextUserRole: "收回",
      nextUserInfo: ''
    })
  })
  ElMessage.success("收回成功")
  handleQuery()
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
  console.log(selectRow.value)
  riskData.value = {
    scenarioId: '001',
    rskTp: rskTp?.target ? 1 : rskTp,
    params: {
      OccurType: selectRow.value.occurtype,
      ObjectType: selectRow.value.objecttype,
      ObjectNo: selectRow.value.objectno,
      FlowNo: selectRow.value.flowno,
      PhaseNo: selectRow.value.phaseno,
      ApplyType1: selectRow.value.applytype,
    }
  }
  riskMonitorVisible.value = true
  submitFlag.value = false
}


const hanldesubmit = async () => {
  approvalOpinionVisible.value = false
  await doRiskDetection(2)
  submitFlag.value = true
}

const submit = async () => {
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

  serialNo.value = selectRow.value.objectno
  phaseNo.value = selectRow.value.phaseno
  creditFlowApprovalVisible.value = true

  loadMenuChildren(leftMenuList.value[0])
  loadMenuChildren(leftMenuList.value[1])
}

const getSelect = () => {
  if(selectedRows.value.length !== 1) {
    ElMessage.warning("请选择一条记录")
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

const watchInvesigation =async () => {
  // 产看调查报告
  if (selectedRows.value.length === 0 || selectedRows.value.length >1) {
    ElMessage.warning('请选择一条数据')
    return
  }

  const res = await associatedCreditApi.handleViewDcbg({
    objectno:selectedRows.value[0].objectno,
    //objectno:'BC2025120900000001',
    objecttype: "CreditApply",
  })

  console.log('产看调查报告',res);
  // openIframeDialog(res.newreportno,`调查报告-${res?.serialno}`)
  window.open(res.newreportno)
//  openIframeWindow(res)

}

const viewPhaseOpinionRef = ref()
const viewPhaseOpinion = () => {
    if (selectedRows.value.length === 0 || selectedRows.value.length >1) {
    message.warning('请选择一条数据')
    return
  }
  //   router.push({
  //   path: 'viewApplyPhaseOpinion',
  //   query: {
  //     serialNo: selectedRows.value[0].objectno
  //   }
  // })
  viewPhaseOpinionRef.value.open({ serialNo: selectedRows.value[0].objectNo }) 

}

// 签署意见
const approvalOpinionVisible = ref(false)

const handleSignOpinion = () => {

  if(selectedRows.value.length !== 1) {
    message.warning("请选择一条记录")
    return
  }

  approvalOpinionVisible.value=true
}
const exportLoading = ref(false) // 导出的加载中
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    console.log('hasFailure',queryParams)
    // 发起导出
    exportLoading.value = true
    queryParams.phaseNo = currMenu.value?.phaseNo
    queryParams.flowNo = currMenu.value?.flowNo
    console.log('hasFailure',queryParams)
    const data = await api.approveExport({...queryParams,type:currentType.value,creditSourceFlag:"02"})
    download.excel(data, '授信业务审查审批.xls')
  }finally {
    exportLoading.value = false
  }
}

// const exportLoading = ref(false) // 导出的加载中
//
// /** 导出按钮操作 */
// const handleExport = async () => {
//   try {
//     // 导出的二次确认
//     await message.exportConfirm()
//     // 发起导出
//     exportLoading.value = true
//     const data = await api.exportBusiness({...queryParams,type:currentType.value})
//     download.excel(data, '授信业务审查审批.xls')
//   } catch {
//   } finally {
//     exportLoading.value = false
//   }
// }

/** 初始化 */
onMounted(() => {
  // 加载菜单数据
  loadMenuData()
  // 加载表格数据
  getList()
})
</script>

<style lang="scss" scoped>
.dy-container {
  display: flex;

  .dy-container-left {
    // min-width: 230px;
    height: calc(100vh - 135px);
    background-color: #fff;
    padding: 8px;
    box-shadow: -5px 0 5px -2px #cecdcd inset;
  }

  .dy-container-right {
    width: calc(100% - 198px - 20px - 5px);
  }
}

.side-item-list {
  overflow: hidden;
  font-size: 14px;
  // background-color: var(--el-bg-color);
  // border: 1px solid var(--el-border-color);
  // border-radius: 4px;

  .side-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 36px;
    padding: 0 20px;
    line-height: 36px;
    margin: 4px 0;
    cursor: pointer;
    // border-bottom: 1px solid var(--el-border-color-lighter);
    transition: all 0.2s;
    color: #333;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      // background-color: var(--el-color-primary-light-9);
    }

    .side-item-text {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .side-item-badge {
      flex-shrink: 0;
      margin-left: 8px;
    }
  }

  .side-item-child {
    padding-left: 40px;
    // background-color: var(--el-fill-color-lighter);
  }

  .menu-group {
    .group-header {
      font-weight: 500;

      .group-icon {
        flex-shrink: 0;
        margin-left: 8px;
        transition: transform 0.2s;
      }
    }

    .group-expanded .group-icon {
      // transform: rotate(90deg);
    }

    .group-children {
      // background-color: var(--el-fill-color-lighter);
    }

    .loading-item {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50px;
      padding: 0 16px;
      font-size: 12px;
      // color: var(--el-text-color-secondary);
      gap: 8px;
    }
  }
}

.side-item-default {
  // color: var(--el-text-color-primary);
  // border-right: 3px solid transparent;
}

.side-item-select {
  font-weight: 600;
  // color: var(--el-color-primary);
  // background-color: var(--el-color-primary-light-9);
  // border-right: 3px solid var(--el-color-primary);
}

.el-badge :deep(.el-badge__content) {
  border: none;
}
</style>
