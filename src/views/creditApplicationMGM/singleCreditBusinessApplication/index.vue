<template>
  <el-row :gutter="20" class="customer-detail">
    <el-col :span="3">
      <nav-menu @menuSelect="menuSelect" />
    </el-col>

    <el-col :span="21">
      <ContentWrap>
        <keep-alive>
          <component :is="componentId"></component>
        </keep-alive>
      </ContentWrap>
    </el-col>
  </el-row>
</template>

<script setup>
import navMenu from './components/navMenu/index.vue'

defineOptions({
  name: 'singleCreditBusinessApplication'
})

const componentId = ref()
const menuSelect = (menu) => {
  componentId.value = menu.component
}
</script>