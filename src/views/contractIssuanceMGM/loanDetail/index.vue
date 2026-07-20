<template>
  <div class="pl-2 py-1">
    <template v-for="tab in visibleTabs" :key="tab.key">
      <el-button
        class="rounded-0px!"
        :loading="tab.loading"
        @click="tab.onClick(tab)"
        :type="activeTabKey === tab.key ? 'primary' : 'default'"
        plain
      >
        {{ tab.label }}
      </el-button>
    </template>
  </div>
  <div v-show="activeTabKey === 'detail'">
    <dynamicContainer
      :active-menu="activeMenu"
      :comp-modules="modules"
      :menu-list="menuList"
      :loading="loading"
      :default-component="baseInfo"
      :get-component="getComponent"
      :menu-select="menuSelect"
      @send-data="setBaseInfo"
      showCustomerName
    />
  </div>
  <div v-if="activeTabKey === 'cusDetail'">
    <!-- 自雇 -->
    <customerDetail v-if="baseData.customerType === '0320'" />

    <!-- 授薪 -->
    <customerDetail2 v-else-if="baseData.customerType === '0310'" />

    <!-- 公司 -->
    <companyCustomerDetail v-else-if="baseData.customerType === '0110'" />
  </div>
  <!-- 合同详情 -->
  <div v-if="activeTabKey === 'contractDetail'">
    <ContractDetail :show-tab="false" :is-edit="false" :serial-no-by-props="baseData?.bcSerialNo" />
  </div>
  <!-- 批复详情 -->
  <div v-if="activeTabKey === 'contractApprovalDetail'">
    <contractApprovalDetail :show-tab="false" :serial-no-by-props="baseData?.bapSerialNo"/>
  </div>
  <!-- 申请详情 -->
  <div v-if="activeTabKey === 'creditApplyJobDetail'">
    <CreditApplyJobDetail :show-tab="false" :is-edit="false" :serial-no-by-props="baseData?.baSerialNo" />
  </div>
  <div v-if="activeTabKey === 'imageSystem'">
    <ContentWrap>
      <IFrame :src="imageSystemUrl" />
    </ContentWrap>
  </div>
</template>

<script setup>
import * as Api from './api.js'
import baseInfo from './components/baseInfo/index.vue'
import dynamicContainer from '@/components/dynamicContainer/index.vue'
import { IFrame } from '@/components/IFrame'
import { getImageGalleryInfo } from '@/api/common'
import companyCustomerDetail from '@/views/customerManagers/compCustMana/customerDetail/index.vue'
import customerDetail from '@/views/customerManagers/indCustMana/personal/customerDetail/index.vue'
import customerDetail2 from '@/views/customerManagers/indCustMana/sxrs/customerDetail/index.vue'
import CreditApplyJobDetail from '@/views/creditapplication/creditApplyJob/customerDetail/index.vue'
import contractApprovalDetail from '@/views/contractIssuanceMGM/approvalDetail/index.vue'
import ContractDetail from '@/views/contractIssuanceMGM/contractDetail/index.vue'
import { isBoolean, isFunction } from '@/utils/is'

const modules = import.meta.glob('./components/*/index.vue')

defineOptions({
  name: 'loanDetail'
})

const baseData = ref({})
const setBaseInfo = (info)=> {
  baseData.value = info
}

// 默认展示客户概况
const activeMenu = ref('010')
const route = useRoute()

const menuList = ref([])

// 获取菜单列表
const loading = ref(false)
const getCustomerView = () => {
  loading.value = true
  Api.getCustomerView({ objectType: 'PutOutApply', objectNo: route.query.serialno, businessType: route.query.businesstype , serialNo: route.query.serialno  })
    .then((res) => {
      menuList.value = res || []
    })
    .finally((_) => (loading.value = false))
}
getCustomerView()

const getComponent = (menu) => {
  if (menu.value === './components/baseInfo/index.vue') {
    return baseInfo
  }
}
const menuSelect = (menu) => {
  return {
    tpserialno: route.query.serialno
  }
}

// ====== tabs 相关 ======
const activeTabKey = ref('detail')

const handleTabsChange = (btn) => {
  activeTabKey.value = btn.key
  switch (btn.key) {
    case 'imageSystem':
      toImageInfo(btn)
      break;
  
    default:
      break;
  }
}

const tabs = ref([
  {
    key: 'detail',
    label: '出账详情',
    onClick: (btn) => handleTabsChange(btn)
  },
  {
    key: 'contractDetail',
    label: '合同详情',
    onClick: (btn) => handleTabsChange(btn)
  },
  {
    key: 'contractApprovalDetail',
    label: '批复详情',
    show: ()=> ['IndependentApply','ApproveChangeApply'].includes(baseData.value.bcApplyType),
    onClick: (btn) => handleTabsChange(btn)
  },
  {
    key: 'creditApplyJobDetail',
    label: '申请详情',
    show: ()=> ['IndependentApply','ApproveChangeApply'].includes(baseData.value.bcApplyType),
    onClick: (btn) => handleTabsChange(btn)
  },
  {
    key: 'cusDetail',
    label: '客户详情',
    onClick: (btn) => handleTabsChange(btn)
  },
  {
    key: 'imageSystem',
    label: '影像系统资料',
    loading: false,
    onClick: (btn) => handleTabsChange(btn)
  }
])

const visibleTabs = computed(()=> {
  return tabs.value.filter((btn) => {
    if (btn.show === undefined) return true
    if (isBoolean(btn.show)) return btn.show
    if (isFunction(btn.show)) return btn.show(btn)
    return true
  })
})

// ====== 影像系统资料 ======
const imageSystemUrl = ref('')
const toImageInfo = async (btn) => {
  try {
    btn.loading = true
    const params = {
      objectNo: route.query.serialno,
      objectType: 'PutOutApply',
      customerID: route.query.customerID
    }
    const res = await getImageGalleryInfo(params)
    imageSystemUrl.value = res
  } finally {
    btn.loading = false
  }
}
</script>
