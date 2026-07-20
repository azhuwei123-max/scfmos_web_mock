<template>
  <div class="pl-2 py-1">
    <el-button
      v-for="tab in tabs"
      class="rounded-0px!"
      :key="tab.key"
      :loading="tab.loading"
      @click="tab.onClick(tab)"
      :type="activeTabKey === tab.key ? 'primary' : 'default'"
      plain
    >
      {{ tab.label }}
    </el-button>
  </div>
  <div v-show="activeTabKey === 'detail'">
    <dynamicContainer
      :active-menu="activeMenu"
      :comp-modules="modules"
      :menu-list="menuList"
      :loading="loading"
      :default-component="customerProfile"
      :get-component="getComponent"
      :menu-select="menuSelect"
      @send-data="sendData"
    />
  </div>

  <div v-if="activeTabKey === 'imageSystem'">
    <ContentWrap>
      <IFrame :src="imageSystemUrl" />
    </ContentWrap>
  </div>

  <div v-if="activeTabKey === 'customerDetail'">
    <!-- 自雇 -->
    <customerDetail v-if="baseData.customerType === '0320'" />

    <!-- 授薪 -->
    <customerDetail2 v-else-if="baseData.customerType === '0310'" />

    <!-- 公司 -->
    <companyCustomerDetail v-else-if="baseData.customerType === '0110'" />
  </div>
</template>

<script setup>
import * as Api from './api.js'
import customerProfile from './components/customerProfile/index.vue'
import { IFrame } from '@/components/IFrame'
import { getImageGalleryInfo } from '@/api/common'
import customerDetail from './components/customerDetail/index.vue'
import customerDetail2 from './components/customerDetail2/index.vue'
import companyCustomerDetail from './components/companyCustomerDetail/index.vue'

const modules = import.meta.glob('./components/*/index.vue')

defineOptions({
  name: 'customerDetail'
})
const baseData = ref({})
const sendData = (info) => {
  baseData.value = info
}

// 默认展示客户概况

let quickFlag
const activeMenu = ref('010005')
const route = useRoute()

const menuList = ref([])

const getQuickFlagBySerialNo = () => {
  Api.getQuickFlagBySerialNo({
    serialNo: route.query.serialNo
   
  })
    .then((res) => {
      quickFlag = res
      getCustomerView();
    })
}
getQuickFlagBySerialNo()

// 获取菜单列表
const loading = ref(false)
const getCustomerView = () => {
  loading.value = true
  Api.getCustomerView({
    serialNo: route.query.serialNo,
    objectType: 'CreditApply',
    codeNo:  quickFlag && route.query.quick == "1" ? 'QuickCreditView':'CreditView'
    // codeNo:  'CreditView'

  })
    .then((res) => {
      menuList.value = res || []
    })
    .finally((_) => (loading.value = false))
}
// getCustomerView()

const getComponent = (menu) => {
  if (menu.value === './components/customerProfile/index.vue') {
    return customerProfile
  }
}
const menuSelect = (menu) => {
  
  const { objectType } = menu
  const tpserialno = objectType === 'SelfEmployed' ? route.query.customerID:route.query.serialNo
 
  return {
    tpserialno
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
    label: '授信额度详情',
    onClick: (btn) => handleTabsChange(btn)
  },
  {
    key: 'customerDetail',
    label: '客户详情',
    loading: false,
    onClick: (btn) => handleTabsChange(btn)
  },
  {
    key: 'imageSystem',
    label: '影像系统资料',
    loading: false,
    onClick: (btn) => handleTabsChange(btn)
  }
])

// const checkTab = () => {
//   if (!(route.query.customerType || route.query.customerType)?.startsWith('01')) {
//     tabs.value.push()
//   }
// }
// checkTab()

// ====== 影像系统资料 ======
const imageSystemUrl = ref('')
const toImageInfo = async (btn) => {
  try {
    btn.loading = true
    const params = {
      objectNo: route.query.serialNo,
      objectType: 'CreditApply',
      customerID: route.query.customerID
    }
    const res = await getImageGalleryInfo(params)
    imageSystemUrl.value = res
  } finally {
    btn.loading = false
  }
}
</script>
