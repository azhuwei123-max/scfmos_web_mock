<template>
  <ContentWrap>
    <IFrame  v-if="!loading" v-loading="loading" :src="src" />
  </ContentWrap>
</template>
<script lang="ts" setup>
import * as ImageApi from '@/api/system/image'

defineOptions({ name: 'SystemImage' })

const loading = ref(true)
let src = ref()
/** 初始化 */
const init = async () => {
  try {
    loading.value = true
    src = await ImageApi.queryImgDefault()
  } catch (e) {
  } finally {
    loading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  await init()
})
</script>
