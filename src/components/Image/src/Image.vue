<template>
  <IFrame  v-if="!loading" v-loading="loading" :src="src" />
</template>
<script lang="ts" setup>
import * as ImageApi from '@/api/system/image'

defineOptions({ name: 'Image' })

const props = defineProps({
  data: {
    type: Object,
    default: () => ref()
  }
})
const loading = ref(true)
let src = ref()
/** 初始化 */
/**
 * 数据格式，treeId和对应业务id  业务逻辑在各自页面处理好 传过来
 * ★★★每个bizId只会有一个对应的treeId★★★
 * ★★★name为自定义节点名称，非必填★★★
 * ★★★canDelete，canUpload没传则默认不可删除和上传★★★
 * {
 *   treeNodes: [
 *     {
 *       treeId: 'zxgl',
 *       bizReferenceId: 'zxgl123456',
 *       name: '债项管理的管理'
 *     },{
 *       treeId: 'businessTX ',
 *       bizReferenceId: 'zxgl123456'
 *     }
 *   ],
 *   canDelete: true,
 *   canUpload: true
 * }
 */
const init = async () => {
  try {
    loading.value = true
    console.log(props.data)
    src = await ImageApi.queryImgUrl(props.data)
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
