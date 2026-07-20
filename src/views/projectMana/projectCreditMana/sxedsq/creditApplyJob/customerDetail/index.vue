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
    />
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
import dynamicContainer from '@/components/dynamicContainer/index.vue'
import { IFrame } from '@/components/IFrame'
import { getImageGalleryInfo } from '@/api/common'

const modules = import.meta.glob('./components/*/index.vue')

defineOptions({
  name: 'creditApplyJobDetail'
})

// 默认展示客户概况
const activeMenu = ref('010')
const route = useRoute()

const menuList = ref([])

// 获取菜单列表
const loading = ref(false)
const getCustomerView = () => {
  loading.value = true
  Api.getCustomerView({
    codeNo: 'CreditLineView1',
    serialNo: route.query.serialNo,
    objectType: route.query.objectType
  })
    .then((res) => {
      menuList.value = res || []
    })
    .finally((_) => (loading.value = false))
}
getCustomerView()

const getComponent = (menu) => {
  if (menu.value === './components/customerProfile/index.vue') {
    return customerProfile
  }
}
const menuSelect = (menu) => {
  return {
    tpserialno: route.query.serialNo
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
      objectNo: route.query.serialNo,
      objectType: 'CreditLineView1',
      customerID: route.query.customerID
    }
    const res = await getImageGalleryInfo(params)
    imageSystemUrl.value = res
  } finally {
    btn.loading = false
  }
}
</script>
