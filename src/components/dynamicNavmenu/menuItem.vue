<template>
  <el-sub-menu v-if="item.children?.length" :index="item.key">
    <template #title><Icon class="mr-5px" icon="ep:folder-opened" />{{ item.title }}</template>

    <menu-item v-for="child in item.children" :key="child.key" :item="child"/>
  </el-sub-menu>

  <el-menu-item v-else :index="item.key">
   <div class="flex items-center gap-1.5">
      <div class="w-1.5 h-1.5 bg-[#5ce472]"></div> {{ item.title }}
   </div> 
  </el-menu-item>
</template>

<script setup>
defineProps({
  item: Object
})
</script>