<template>
  <div v-loading="loading">
    <IFrame v-if="!isError" :iframe-vh="_params.iframeVh" :auto-height="false" :src="src" :onload="onIframeLoad" />
    <template v-else>
      <el-result v-if="showElResult" icon="warning" title="地址获取失败" sub-title="点击再次前往">
        <template #extra>
          <el-button tpye="" @click="init" :loading="loading">再次前往</el-button>
        </template>
      </el-result>
      <el-result v-else icon="warning" title="地址获取失败" sub-title="" />
    </template>
  </div>
</template>
<script lang="ts" setup>
import * as Api from './api.js'
import { creditApplyJobApi } from '@/api/creditapplication/creditApplyJob'

defineOptions({ name: 'CrmsIframe' })

const props = defineProps({
  params: {
    type: Object,
    default: () => ref()
  }
})
const loading = ref(false)
const isError = ref(false)
const _params = { ...props.params }
delete _params.detailInfo
const src = ref()
const showElResult = ref(true)
/** 初始化 */
const init = async () => {
  loading.value = true

  // 查看尽职报告特殊处理
  if(props.params.codeNo === "QuickCreditView" && props.params.key === '010035') {
    showElResult.value = false
    creditApplyJobApi.viewFormatDocData({
      objectno: props.params?.tpserialno,
      objecttype: 'CreditApply'
    }).then((res)=> {
      src.value = res.newreportno
      isError.value = false
    }).catch(()=> isError.value = true)
    .finally(()=> loading.value = false)
    return
  }
  Api.getIframeUrl(_params)
    .then((res) => {
      src.value = res
      isError.value = false
    })
    .catch((e) => (isError.value = true))
    .finally(() => (loading.value = false))
  console.log(src.value)
}

init()

let observer: MutationObserver | null = null
function onIframeLoad(frameRef:HTMLIFrameElement) {
  const iframe = frameRef
  if(!iframe) return
  try {
    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if(!doc) return

    const updateContentStyle = () => {
      const target = doc.querySelector('.ui-dialog-content') as HTMLElement
      if (target) {
        if(target.dataset.resized === "true") return;

        const originalWidth = target.getBoundingClientRect().width || target.offsetWidth
        const docWidth = doc.body.getBoundingClientRect().width || doc.body.offsetWidth

        if(originalWidth > docWidth) {
          target.style.width = `${docWidth}px`
          target.dataset.resized = 'true'
        }
      }
    }

    const updateModalStyle = () => {
      const target = doc.querySelector('.ui-popup-modal') as HTMLElement
      if (target) {
        if(target.dataset.resized === "true") return;
        target.style.left = '50%'
        target.style.transform = 'translateX(-50%)'
        target.dataset.resized = 'true'
      }
    }
    // updateModalStyle()
    updateContentStyle()

    if(observer) observer.disconnect()

    observer = new MutationObserver(() => {
      updateContentStyle()
      // updateModalStyle()
    })
    observer.observe(doc?.body,{
      childList: true,
      subtree: true,
      attributes: false
    })
  } catch (error) {
    console.error('[ 无法访问iframe ] >', error)
  }
}

onBeforeUnmount(() => {
  if(observer) {
    observer.disconnect()
    observer = null
  }
})
</script>
