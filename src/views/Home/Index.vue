<template>
  <div v-loading="loading" class="p-4 bg-gray-50">
    <el-row :gutter="16">
      <!-- 欢迎回来 -->
      <!-- <el-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
        <div
          class="flex justify-between items-center relative bg-gradient-to-r from-[#4169E1] to-[#1E90FF] rounded-lg p-4 mb-4 text-white overflow-hidden"
        >
          <div>
            <div class="text-2xl font-semibold mb-2">欢迎回来，{{ displayName }} ~</div>
            <div class="text-base opacity-90 flex items-center">
              <span>您有</span>
              <div v-if="dashboardTotalLoading" class="spinner mx-1"></div>
              <span class="font-bold underline mx-1" v-else>{{ dashboardTotal }}</span>
              <span>个待办事项，请及时处理！</span>
            </div>
          </div>
          
        </div>
      </el-col> -->
      <!-- Left Content -->
      <el-col :xl="16" :lg="16" :md="16" :sm="16" :xs="16">
        <!-- 待办任务 -->
        <div class="bg-white rounded-[4px] mb-4 shadow-sm">
          <div class="flex justify-between items-center p-4 border-b border-[#f1f5f9]">
            <div class="flex-shrink-0">
              <span class="font-semibold text-gray-800 flex items-center gap-5">
                <img :src="todo" class="w-5" />
                <span class="text-xl">待办任务</span>
                <div class="my-danger-tag" type="danger" effect="light" round>
                  {{ dashboardTotal }} 个待处理
                </div>
              </span>
            </div>
            <!-- tabs -->
            <div class="flex flex-wrap gap-4 border-[#f1f5f9]">
              <el-badge class="my-badge" v-for="tab in taskTabs" :key="tab.backlogGroupName" :value="tab?.count" :hidden="!tab.count">
                <el-button
                  class="m-0! rounded-[17px]! !text-sm"
                  :type="activeTaskTab === tab.attribute6 ? 'primary' : 'default'"
                  :loading="tab.loading"
                  @click="handleTaskTabsChange(tab)"
                  >{{ tab.backlogGroupName }} 
                </el-button>
              </el-badge>
              
            </div>
          </div>

          <el-scrollbar
            ref="pendingTaskScrollRef"
            @scroll="handlePendingTaskScroll"
            class="!h-[28rem]"
          >
            <div class="p-4" v-if="taskRows.length">
              <template v-for="(row, index) in taskRows" :key="index">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-3">
                  <div v-for="item in row" :key="item.itemNo">
                    <div
                      class="bg-[#fafafa] rounded-lg p-3 flex items-center justify-between"
                      :class="[
                        selectedItemTaskItemNo === item.itemNo ? 'border-1 border-[#096DD9] bg-white' : '',
                        item.count ? 'cursor-pointer' : 'cursor-default'
                      ]"
                      :style="{ boxShadow: selectedItemTaskItemNo === item.itemNo ? `0px 2px 7px 0px rgba(7,147,243,0.18)` : 'none' }"
                      v-loading="item.loading"
                      @click="handleItemTaskClick(item)"
                    >
                      <div class="flex items-center">
                        <div
                          class="w-8 h-8 rounded-full flex items-center justify-center mr-3 text-xl"
                          :style="{ background: item.color, color: '#fff' }"
                        >
                          <Icon :icon="item.icon" />
                        </div>
                        <span 
                          class="text-sm text-gray-700 font-medium"
                          :class="[
                            selectedItemTaskItemNo === item.itemNo ? 'color-[#096DD9]' : '',
                          ]"
                        >{{ item.itemName }}</span>
                      </div>
                      <div class="flex items-center">
                        <div
                          class="font-bold text-base"
                          :style="{ color: item.count ?  item.iconColor : '#999'}"
                          >{{ item.count }} </div
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <template v-if="getExpandedTaskInRow(row)?.count">
                  <el-scrollbar
                    max-height="340px"
                    class="mb-2 border-1 border-[#C2DDFE] rounded-lg py-1"
                  >
                    <ul class="w-full">
                      <template v-if="selectedItemTask?.attribute3 !== '3'">
                        <li
                          class="cursor-pointer py-0.5 px-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded"
                          v-for="subTask in selectedItemTask?.itemList"
                          :key="subTask.name"
                          @click="jumpTaskPage(selectedItemTask, subTask)"
                        >
                          <div class="flex items-center gap-2">
                            <div class="my-success-tag">待办</div>
                            <span
                              v-for="(name, i) in subTask.names"
                              class="text-xs"
                              :key="name"
                              :class="[
                                i === subTask.names.length - 1 ? 'text-[#9fa8bb]' : ''
                              ]"
                            >
                              {{ name }}
                            </span>
                          </div>
                          <!-- <Icon icon="ep:arrow-right" :size="16" color="#9fa8bb" /> -->
                        </li>
                      </template>
                      <template v-else>
                        <li
                          class="cursor-pointer py-0.5 px-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded"
                          @click="jumpTaskPage(selectedItemTask)"
                        >
                          <div class="flex items-center gap-2">
                            <el-tag effect="light" size="small" type="success">待办</el-tag>
                            <span>
                              {{
                                `${selectedItemTask?.itemName} ${selectedItemTask?.count ?? 0}件`
                              }}
                            </span>
                          </div>
                          <!-- <Icon icon="ep:arrow-right" :size="16" color="#9fa8bb" /> -->
                        </li>
                      </template>
                    </ul>
                  </el-scrollbar>
                </template>
              </template>
            </div>
            <div v-else class="w-full h-full flex items-center justify-center">
              <el-empty description="暂无待办任务" />
            </div>
          </el-scrollbar>
        </div>
        <div class="flex justify-between gap-4">
          <!-- 提示信息 -->
          <div class="bg-white rounded-[4px] shadow-sm flex-1">
            <div class="flex justify-between items-center p-4 pb-2">
              <span class="text-lg font-semibold text-gray-800 flex items-center">
                <img :src="tip" class="w-4" />
                <span class="ml-2">提示信息</span>
              </span>
              <span
                class="text-sm text-[#999] cursor-pointer"
                @click="jumpIframePage('提示信息')"
                >更多</span
              >
            </div>
            <el-scrollbar class="!h-[13.5rem] pb-1">
              <div>
                <div
                  v-for="(item, index) in tips"
                  :key="index"
                  class="px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors rounded"
                  @click="jumpIframePage(item.businessRemindGroup,item.itemno)"
                >
                  <div class="flex items-center">
                    <div class="my-warning-tag" effect="light" size="small" type="warning">预警</div>
                    <span class="text-sm ml-2">
                      {{ item.businessRemindGroup }}
                    </span>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </div>
          <!-- 工作提示 -->
          <div class="bg-white rounded-[4px] shadow-sm flex-1">
            <div class="flex justify-between items-center p-4 pb-2">
              <span class="text-lg font-semibold text-gray-800 flex items-center">
                <img :src="tip" class="w-4" />
                <span class="ml-2">工作提示</span>
              </span>
              <span
                class="text-sm text-[#999] cursor-pointer"
                @click="jumpIframePage('工作提示')"
                >更多</span
              >
            </div>

            <el-scrollbar class="!h-[13.5rem] pb-1">
              <div>
                <div
                  v-for="item in reminders"
                  :key="item.businessRemindGroup"
                  class="px-4 py-2 flex cursor-pointer items-center justify-between hover:bg-gray-50 transition-colors rounded"
                  @click="jumpIframePage(item.businessRemindGroup,item.attribute5)"
                >
                  <div class="flex items-center">
                    <div class="my-primary-tag">提示</div>
                    <span class="text-sm ml-2">{{ item.businessRemindGroup }}</span>
                  </div>
                  <!-- <div class="text-lg font-semibold text-[#1E90FF] whitespace-nowrap">
                    {{ item.businessRemindGroupNum }}
                    <small class="text-lg ml-0.5">件</small>
                  </div> -->
                </div>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </el-col>

      <!-- Right Content -->
      <el-col :xl="8" :lg="8" :md="8" :sm="8" :xs="8">
        <div class="flex gap-2 mb-4 bg-white rounded-[4px] p-2">
          <div
            v-for="entry in systemEntries"
            :key="entry.name"
            class="bg-white relative overflow-hidden w-[50%] h-22 rounded-[4px] p-4 flex items-center justify-between gap-2 cursor-pointer"
            @click="handleGoSystem(entry)"
          >
            <img class="absolute top-0 left-0 z-[0] w-full h-full" :src="entry.icon" />
            <div class="z-10 w-full h-full pl-4">
              <div class="text-lg font-bold text-black mb-2" style="letter-spacing: 2px;">{{ entry.name }}</div>
              <div class="text-[#1890FF]"> 点击登录 > </div>
            </div>
          </div>
        </div>
        <!-- 快速发起 -->
        <div class="bg-white rounded-[4px] shadow-sm mb-4 h-46">
          <div class="flex justify-between items-center p-4">
            <span class="text-lg font-semibold text-gray-800 flex items-center">
              <img :src="add" class="w-[18px]" />
              <span class="ml-2"> 快速发起 </span>
            </span>
          </div>

          <div class="grid grid-cols-4 p-2 gap-2 pt-5">
            <div
              v-for="action in quickActions"
              :key="action.name"
              class="text-center cursor-pointer group"
              @click="jumpStartsClick(action)"
            >
              <div
                class="rounded-lg"
              >
                <div
                  class="w-11 h-11 mx-auto mb-3 rounded-lg flex items-center justify-center text-white text-2xl shadow-md"
                >
                  <img :src="action.icon" />
                </div>
                <div class="font-medium text-sm">{{ action.name }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 快捷入口 -->
        <div class="bg-white rounded-[4px] mb-4 shadow-sm">
          <div class="flex justify-between items-center p-4 pb-0">
            <span class="text-lg font-semibold text-gray-800 flex items-center">
              <img :src="add" class="w-[18px]" />
              <span class="ml-2"> 快捷入口 </span>
            </span>
            <div class="flex items-center gap-2">
              <el-tooltip content="新增" placement="top">
                <Icon
                  icon="ep:plus"
                  :size="24"
                  class="text-[#1E90FF] cursor-pointer"
                  @click="handleAddShortcutEntries"
                />
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <Icon
                  icon="ep:minus"
                  :size="24"
                  class="text-red-500 cursor-pointer"
                  @click="showDelShortcutEntries"
                />
              </el-tooltip>
            </div>
          </div>
          <el-scrollbar class="!h-[9.3rem] pb-2">
            <div class="grid grid-cols-2 gap-2 p-4">
              <div
                v-for="entry in shortcutEntries"
                :key="entry.id"
                class="flex items-center justify-between p-2 rounded-lg cursor-pointer bg-[#F9FAFC] border border-[#F1F5F9] hover:bg-[#f8faff] transition-colors"
                @click="handleGoShortcut(entry)"
              >
                <div class="flex items-center gap-2 w-[80%]">
                  <Icon
                    class="flex-shrank-0"
                    v-if="entry.icon"
                    :icon="entry.icon"
                    color="#1E90FF"
                  />
                  <el-tooltip :content="entry.name" placement="top">
                    <span class="text-xs text-[#333] overflow-hidden truncate flex-1">{{
                      entry.name
                    }}</span>
                  </el-tooltip>
                </div>
                <Icon
                  v-if="showDelShortcutEntriesBtn"
                  :size="20"
                  icon="ep:circle-close"
                  class="text-red-500"
                  @click.stop="handleDelShortcutEntries(entry)"
                />
              </div>
            </div>
          </el-scrollbar>
        </div>
        <!-- 通知信息 -->
        <div class="bg-white rounded-[4px] shadow-sm">
          <div class="flex justify-between items-center p-4 pb-2">
            <span class="text-lg font-semibold text-gray-800 flex items-center">
              <img :src="tip" class="w-4" />
              <span class="ml-2">通知信息</span>
            </span>
            <!-- <span class="text-sm text-gray-400 cursor-pointer hover:text-[#1E90FF]">更多</span> -->
          </div>

          <el-scrollbar class="!h-[13.5rem] pb-1">
            <div>
              <div
                v-for="item in notifications"
                :key="`${item.title}-${item.date}`"
                class="cursor-pointer py-2 px-4 hover:bg-gray-50 transition-colors rounded"
                @click="handleNoticeClick(item)"
              >
                <div class="flex items-center">
                  <div class="my-primary-tag">提示</div>
                  <div class="text-sm ml-2">
                    <span>{{ item.title }}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </el-col>
    </el-row>
    <NoticeForm ref="noticeFormRef" :is-readonly="true" />

    <DealerDataLoan ref="DealerDataLoanRef" />
  </div>
</template>

<script setup lang="tsx">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { useMessage } from '@/hooks/web/useMessage'
import { formatDate } from '@/utils/formatTime'
import {
  getDashboardTotal,
  getPendingTasks,
  getWorkReminders,
  getNotifications,
  getTips,
  getQuickActions,
  getTabs,
  tasksConfig,
  putAssignUserMen,
  delAssignUserMen,
  getCodeLibraryIframeUrl,
  getIndebtUrl,
  getIndebtNum,
  getWaitDealQueryListGroupWithCount
} from './api'
import type {
  TaskItem,
  WorkReminder,
  Notice,
  TipItem,
  QuickAction,
  SystemEntry,
  DashboardTotal,
  TaskTab
} from './types'
import request from '@/config/axios'
import NoticeForm from '@/views/system/notice/NoticeForm.vue'
import { getIframeUrl } from '@/components/busiComp/crmsIframe/api'
import { isArray } from '@/utils/is'
import { addDialog } from '@/components/Dialog'
import { ElTree } from 'element-plus'
import {checkRoleIds } from '@/utils/permission'
// import { RecycleScroller } from 'vue-virtual-scroller'
import add from '@/assets/imgs/home/add.png'
import tip from '@/assets/imgs/home/tip.png'
import todo from '@/assets/imgs/home/todo.png'
import xdxt from '@/assets/imgs/home/xdxt.png'
import zxxt from '@/assets/imgs/home/zxxt.png'

defineOptions({ name: 'Index' })

const router = useRouter()
const userStore = useUserStore()
const message = useMessage()
const activeTaskTab = ref('001')

// State
const taskTabs = ref<TaskTab[]>([{
  attribute6: 'all',
  backlogGroupName: '全部',
  backlogGroupNum: 'all',
  itemNo: 'all',
  itemName: 'all',
  count: 0,
  itemAttribute: 'all',
  loading: false
}])

const notifications = ref<Notice[]>([])
const quickActions = ref<QuickAction[]>([])

const loading = ref(false)

const displayName = computed(() => userStore.getUser.nickname || '用户')

// ===== 获取总代办任务相关 ====
const dashboardTotal = ref<DashboardTotal>(0)
const dashboardTotalLoading = ref(false)
async function _getDashboardTotal() {
  dashboardTotalLoading.value = true
  const res = await getDashboardTotal().finally(()=> dashboardTotalLoading.value = false)
  dashboardTotal.value = res
}

// ====== 获取代办任务tab ======
const handleTaskTabsChange = (tab: TaskTab) => {
  if(activeTaskTab.value === tab.attribute6) return
  activeTaskTab.value = tab.attribute6
  tasks.value = []
  selectedItemTaskItemNo.value = ''
  pendingTaskParams.value.pageNo = 1
  pendingTaskTotal.value = 0
  handleGetPendingTasks(tab.attribute6)
}

async function handleGetTabs() {
  const res = await getTabs()
  activeTaskTab.value = res[0].attribute6
  taskTabs.value.push(...res)
  getTaskTabCount()
  handleGetPendingTasks(activeTaskTab.value)
}
// 获取代办项count
async function getTaskTabCount() {
  dashboardTotalLoading.value = true
  taskTabs.value.forEach(item => {
    item.loading = true
    if(item.attribute6 === 'all'){
      item.loading = false
      return
    }
    getWaitDealQueryListGroupWithCount({attribute6: item.attribute6}).then((res)=> {
      item.count = res.count
      dashboardTotal.value += res.count || 0
      taskTabs.value[0].count = dashboardTotal.value
    }).finally(()=> {
      item.loading = false
      dashboardTotalLoading.value = false
    })
  })
}


// ====== 代办任务子项 =====
const tasks = ref<TaskItem[]>([])
const taskRows = computed(() => {
  const rows: TaskItem[][] = []
  const rowList = tasks.value.filter(f => f.show)
  for (let i = 0; i < rowList.length; i += 3) {
    rows.push(rowList.slice(i, i + 3))
  }
  return rows
})
const pendingTaskScrollRef = ref()
const pendingTaskLoading = ref(false)
const pendingTaskTotal = ref(0)
const pendingTaskParams = ref({
  pageNo: 1,
  pageSize: 10000
})
async function handleGetPendingTasks(attribute6: string) {
  pendingTaskLoading.value = true
  const params = {
    ...pendingTaskParams.value,
    attribute6: attribute6 === 'all' ? '' : attribute6
  }
  const { total, list } = await getPendingTasks(params).finally(
    () => (pendingTaskLoading.value = false)
  )

  pendingTaskTotal.value = total
  const taskList = list.map((item, index) => {
    const i = tasks.value.length % tasksConfig.length
    const config = tasksConfig[(index + i) % tasksConfig.length]
    return {
      ...item,
      ...config,
      count: 0,
      show: true
    } as TaskItem
  })
  tasks.value = [...tasks.value, ...taskList]
  for (const item of tasks.value) {
    if (item.count) continue
    getPendingTasksInfo(item)
  }
}

const getPendingTasksInfo = (item) => {
  return new Promise<void>((resolve) => {
    item.loading = true
    request
      .get({ url: item.itemAttribute })
      .then((res) => {
        if (isArray(res)) {
          item.count = res?.length ?? 0
          item.itemList = res || []
          item.itemList = item.itemList?.map((iList) => {
            return {
              ...iList,
              names: (iList?.name?.split(' ') ?? []).filter(Boolean)
            }
          })
        } else if(item.itemName == '债项待办通知'){
          item.count = res.AgntNo
          item.itemList = []
        } else if(item.itemName == '待处理的债项预警申请/审批') {
         item.count = res.WrnNum
         item.itemList = []
        }
      })
      .finally(() => {
        if (!item.count) {
          item.show = false
        }
        item.loading = false
        resolve()
      })
  })
}
const handlePendingTaskScroll = (scroll: { scrollTop: number; scrollLeft: number }) => {
  const wrap = pendingTaskScrollRef.value?.wrapRef
  if (!wrap) return

  const { clientHeight, scrollHeight } = wrap
  if (
    scroll.scrollTop + clientHeight >= scrollHeight - 20 &&
    pendingTaskTotal.value > tasks.value.length
  ) {
    pendingTaskParams.value.pageNo += 1
    handleGetPendingTasks(activeTaskTab.value)
  }
}
const selectedItemTaskItemNo = ref('')
const selectedItemTask = ref<TaskItem | null>(null)
const handleItemTaskClick = (item: TaskItem) => {
  if (!item.count) return
  if (item.itemNo !== selectedItemTaskItemNo.value) {
    selectedItemTaskItemNo.value = item.itemNo
    item.expand = true
  } else {
    item.expand = !item.expand
  }
  selectedItemTask.value = item
}
const getExpandedTaskInRow = (row: TaskItem[]) => {
  return row.find((item) => item.itemNo === selectedItemTaskItemNo.value && item.expand)
}

/**
 * attribute3: 1跳转供应链 2跳转本系统 3跳转债项系统
 */
const jumpTaskPage = (row: TaskItem | null | undefined, subTask?: Recordable) => {
  console.log('[ subTask ] >', subTask)
  console.log('[ row ] >', row)
  if (!row) return
  const url = row.attribute2 || subTask?.url
  console.log('[ url ] >', url)
  if (row.attribute3 === '1') {
    router.push({
      name: 'IframeView',
      query: {
        url: encodeURIComponent(url),
        title: encodeURIComponent(row.itemName)
      }
    })
  } else if (row.attribute3 === '2') {
    if(url.indexOf("https://")>-1){
      router.push({
        name: 'IframeView',
        query: {
          url: encodeURIComponent(url),
          title: encodeURIComponent(row.itemName)
        }
      })
    }else{
      const newUrl = new URL(window.location.origin + '/' + url)
      const paramsObj = Object.fromEntries(newUrl.searchParams.entries())
      router.push({ path: url, query: {...paramsObj} })
    }
  } else if (row.attribute3 === '3') {
    pendingTaskLoading.value = true
    request
      .get({ url })
      .then((res) => {
        window.open(res)
      })
      .finally(() => (pendingTaskLoading.value = false))
  }
}

// ====== 通知信息 ======
const noticeFormRef = ref()
const handleNoticeClick = (notice: Notice) => {
  noticeFormRef.value.open('detail', notice.id)
}
// ====== 提示信息和工作信息 ======
const tips = ref<TipItem[]>([])
async function handleGetTips() {
  const res = await getTips()
  tips.value = res
}


const reminders = ref<WorkReminder[]>([])
async function handleGetWorkReminders() {
  const res = await getWorkReminders()
  reminders.value = res
}
const jumpIframePage = async (title: string, attribute5?:string) => {
  loading.value = true
  const res = await getIframeUrl({ tpopentype: 'AlarmHandleView&Argument=SelectItem='+attribute5 }).finally(
    () => (loading.value = false)
  )
  router.push({
    name: 'IframeView',
    query: {
      url: encodeURIComponent(res),
      title: encodeURIComponent(title)
    }
  })
}

// ====== 快捷入口 ======
const showDelShortcutEntriesBtn = ref(false)
const shortcutEntries = computed(() => userStore.quickMenus)
const filterMenu = (menus: Recordable[]) => {
  const visibleMenu: Recordable[] = []
  for(const menu of menus) {
    if(menu.visible) {
      if(menu.children) {
        menu.children = filterMenu(menu.children)
      }
      visibleMenu.push(menu)
    }
  }
  return visibleMenu
}
const menus = computed(() => filterMenu(userStore.menus))
const menuTreeRef = ref<InstanceType<typeof ElTree> | null>(null)
const isExpandAll = ref(false)
const handleAddShortcutEntries = () => {
  showDelShortcutEntriesBtn.value = false
  addDialog({
    title: '新增菜单',
    headerRenderer: ()=> {
      return (
        <div class="flex items-center justify-between w-full text-lg">
          <span>新增菜单</span>
          <span class="cursor-pointer mr-4 text-base" onClick={()=>handleExpand()}>
            <span v-show={!isExpandAll.value}>展开全部</span>
            <span v-show={isExpandAll.value}>收起全部</span>
          </span>
        </div>
      )
    },
    width: '400px',
    contentRenderer: () => (
      <el-scrollbar height="400px">
        <el-tree
          ref={menuTreeRef}
          data={menus.value}
          node-key="id"
          show-checkbox
          props={{ value: 'id', label: 'name' }}
        />
      </el-scrollbar>
    ),
    close: ()=> {
      isExpandAll.value = false
    },
    async beforeSure(done, { button }) {
      const selectedMenus = menuTreeRef.value?.getCheckedNodes(true)
      if (!selectedMenus?.length) {
        message.warning('请至少选择一个菜单')
        return
      }
      button!.btn!.loading = true
      const menuIdList = selectedMenus.map((item) => item.id).join(',')
      await putAssignUserMen(menuIdList).finally(() => (button!.btn!.loading = false))
      await userStore.updateQuickMenus()
      message.success('添加成功')
      done()
    }
  })
}

const handleExpand = ()=> {
  isExpandAll.value = !isExpandAll.value
  if(isExpandAll.value) {
    nextTick(()=> {
      const nodes = menuTreeRef.value?.store._getAllNodes()
      nodes?.forEach(node => {
        if(node.childNodes.length) {
          node.expanded = true
        }
      })
    })
    
  } else {
    nextTick(()=> {
      const nodes = menuTreeRef.value?.store._getAllNodes()
      nodes?.forEach(node => {
        if(node.childNodes.length) {
          node.expanded = false
        }
      })
    })
    
  }
}

const showDelShortcutEntries = () => {
  showDelShortcutEntriesBtn.value = !showDelShortcutEntriesBtn.value
}
const handleDelShortcutEntries = async (entry) => {
  ElMessageBox.confirm('您确定要删除这个菜单吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    async beforeClose(action, instance, done) {
      if (action !== 'confirm') {
        done()
        return
      }
      instance.confirmButtonLoading = true
      await delAssignUserMen(entry.id).finally(() => (instance.confirmButtonLoading = false))
      await userStore.updateQuickMenus()
      message.success('删除成功')
      done()
    }
  })
}
const handleGoShortcut = (entry) => {
  if (!entry.componentName) return
  router.push({ name: entry.componentName })
}

// ====== 进入系统 ======
const systemEntries = ref<SystemEntry[]>([
  { name: '信贷系统', icon: xdxt, tagType: 'warning', count: 0, url: '' },
  { name: '债项系统', icon: zxxt, tagType: 'primary', count: 0, url: '' }
])
async function getsSystemEntriesInfo() {
  // 信贷
  getCodeLibraryIframeUrl().then((url) => {
    systemEntries.value[0].url = url
  })
  // 债项
  getIndebtUrl().then((url) => {
    systemEntries.value[1].url = url
  })
  getIndebtNum().then((res) => {
    systemEntries.value[1].count = Number(res.AgntNo || 0) + Number(res.WrnNum || 0)
  })
}
const handleGoSystem = (entry: SystemEntry) => {
  if (!entry.url) return
  window.open(entry.url)
}

// ====== Fetch Data ======
const fetchData = async () => {
  loading.value = true
  try {
    const results = await Promise.allSettled([
      getNotifications(),
      getQuickActions(),
      handleGetTabs(),
      handleGetTips(),
      handleGetWorkReminders(),
      getsSystemEntriesInfo()
    ])

    const [noticeRes, actionsRes] = results
    if (noticeRes.status === 'fulfilled') notifications.value = noticeRes.value.list
    if (actionsRes.status === 'fulfilled') quickActions.value = actionsRes.value

    if (results.some((r) => r.status === 'rejected')) {
      message.warning('部分首页数据加载失败，请稍后刷新重试')
    }
  } catch (error) {
    message.error('加载首页数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

import DealerDataLoan from '@/views/jumpStarts/dealerDataLoan/index.vue'
const DealerDataLoanRef = ref()
const jumpStartsClick = (action) => {
  switch (action.name) {
    case '经销商数据贷':
      if(!checkRoleIds(['480'])){
            message.warning('只有客户经理有权限操作')
            break;
      }
      DealerDataLoanRef.value.open()
      break;
    case '多级融资': 
     if(!checkRoleIds(['480'])){
           message.warning('只有客户经理有权限操作')
           break;
     }
      router.push({ path: '/singBusMana/channelEntryMana/financingAppliMGM' })
      break;
    default:
      message.info('功能待实现')
      break;
  }
}

onMounted(() => {
  fetchData()
  // _getDashboardTotal()
})

</script>

<style scoped>
  .my-badge :deep(.el-badge__content) {
    top: 2px;
    right: 18px;
  }
  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid #e5e7eb;
    border-top-color: #409eff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  .my-danger-tag {
    display: flex;
    align-items: center;
    padding: 0px 10px;
    height: 32px;
    font-size: 12px;
    border-radius: 9999px;
    color: #f56c6c;
    background-color: rgb(254, 240, 240);
    font-weight: 600;
    border: 1px solid #f57878;
  }
  .my-warning-tag {
    background: #FFF7E6;
    border: 1px solid rgba(250,140,22,1);
    border-radius: 2px;
    font-size: 12px;
    color: #FA8C16;
    line-height: 18px;
    font-weight: 400;
    padding: 0px 5px;
  }
  .my-primary-tag {
    background: #E6F7FF;
    border-radius: 2px;
    font-size: 12px;
    color: #1890FF;
    line-height: 18px;
    font-weight: 400;
    padding: 0px 5px;
  }
  .my-success-tag {
    background: #F0FAF2;
    border: 1px solid rgba(159,214,168,1);
    border-radius: 2px;
    font-size: 10px;
    color: #389E0D;
    line-height: 11px;
    font-weight: 400;
    padding: 1px 4px;
  }
</style>
