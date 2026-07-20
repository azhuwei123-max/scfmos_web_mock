<template>
  <ContentWrap class="!w-1/1">
    <el-skeleton :loading="loading" animated></el-skeleton>
  </ContentWrap>
</template>

<script setup>
const loading = ref(true)
</script>