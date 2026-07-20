<template>
  <div class="pl-2 py-1" v-if="props.showTab">
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
      key="detail"
      :active-menu="activeMenu"
      :comp-modules="modules"
      :menu-list="menuList"
      :loading="loading"
      :defaultMenuParams="props"
      :default-component="customerProfile"
      :get-component="getComponent"
      :menu-select="menuSelect"
      @send-data="setBaseInfo"
      showCustomerName
    />
  </div>
  <div v-if="activeTabKey === 'cusDetail'">
      <!-- 自雇 -->
    <customerDetail v-if="baseInfo.customerType === '0320'" />

    <!-- 授薪 -->
    <customerDetail2 v-else-if="baseInfo.customerType === '0310'" />

    <!-- 公司 -->
    <companyCustomerDetail v-else-if="baseInfo.customerType === '0110'" />
  </div>
  <div v-if="activeTabKey === 'imageSystem'">
    <ContentWrap>
      <IFrame :src="imageSystemUrl" />
    </ContentWrap>
  </div>
</template>

<script setup>
import * as Api from './api.js'
import customerProfile from './components/customerProfile/index.vue'
import customerIndex from '@/views/customerManagers/compCustMana/customerDetail/index.vue'
import dynamicContainer from '@/components/dynamicContainer/index.vue'
import { IFrame } from '@/components/IFrame'
import { getImageGalleryInfo } from '@/api/common'
import associatedCredit from './components/associatedCredit/associatedCredit.vue'
import companyCustomerDetail from '@/views/customerManagers/compCustMana/customerDetail/index.vue'
import customerDetail from '@/views/customerManagers/indCustMana/personal/customerDetail/index.vue'
import customerDetail2 from '@/views/customerManagers/indCustMana/sxrs/customerDetail/index.vue'

const modules = import.meta.glob('./components/*/index.vue')

defineOptions({
  name: 'creditApplyJobDetail'
})

const baseInfo = ref({})
const setBaseInfo = (info) => {
  baseInfo.value = info
  console.log('[ baseInfo ] >', baseInfo.value)
}

// 默认展示客户概况
const activeMenu = ref('010')
const route = useRoute()
const props = defineProps({
  showTab: {
    type: Boolean,
    default: true
  },
  serialNoByProps: {
    type: String,
    default: ''
  },
  isEdit: {
    type: Boolean,
    default: true
  }
})

const menuList = ref([])
// serialNoByProps 用于被当作组件时传参
const serialNo = computed(()=> props.serialNoByProps || route.query.relativeserialno || route.query.serialNo || route.query.serialno)
const applyType = computed(() => baseInfo.value?.baApplyType || route.query?.applyType)
// 获取菜单列表
const loading = ref(false)
const getCustomerView = () => {
  loading.value = true
  Api.getCustomerView({
    codeNo: 'CreditLineView1',
    serialNo: serialNo.value,
    objectType: 'CreditApply'
  })
    .then((res) => {
      menuList.value = res || []
      console.log('[ menuList ] >', menuList.value)
    })
    .finally((_) => (loading.value = false))
}
getCustomerView()

const getComponent = (menu) => {
  if (menu.value === './components/customerProfile/index.vue') {
    return customerProfile
  }else if(menu.value === './components/associatedCredit/index.vue') {
    return associatedCredit
  }
}
const menuSelect = (menu) => {
  return {
    tpserialno: serialNo.value,
    serialNo: serialNo.value,
    applyType: applyType.value,
    serialNoByProps: props.serialNoByProps,
    isEdit: props.isEdit
  }
}

// ====== tabs 相关 ======
const activeTabKey = ref('detail')

const handleTabsChange = (btn) => {
  activeTabKey.value = btn.key
  console.log('[ btn ] >', btn)
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

// ====== 影像系统资料 ======
const imageSystemUrl = ref('')
const toImageInfo = async (btn) => {
  try {
    btn.loading = true
    const params = {
      objectNo: serialNo.value,
      objectType: route.query.objectType,
      customerID: route.query.customerID
    }
    const res = await getImageGalleryInfo(params)
    imageSystemUrl.value = res
  } finally {
    btn.loading = false
  }
}
</script>
