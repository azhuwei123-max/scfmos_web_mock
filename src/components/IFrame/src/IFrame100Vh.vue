<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { url } from 'inspector'


defineOptions({ name: 'IFrame' })




const props = withDefaults(defineProps<{
    src: string,
    onload?: (frameRef: HTMLIFrameElement | null) => void
  }>(),
  {
    src: ''
  }
)
const loading = ref(true) // 不知道为什么loading不会消失，暂时先false
const height = ref('')
const frameRef = ref<HTMLIFrameElement | null>(null)
const currentSrc= ref(props.src)

// 解决参数src异步传输导致页面无法渲染的问题
const stopEffect = watchEffect(() => {
  if (props.src) {

    currentSrc.value = props.src
    nextTick(() => {
      stopEffect()
    })
  }
})

const init = () => {
  height.value = document.documentElement.clientHeight - 94.5 + 'px'
  nextTick(()=> {
    if(!frameRef.value) return
    frameRef.value.onload = () => {
      loading.value = false
    }
  })
}


const handleMessage = (event: MessageEvent) =>{
  try{
    const data = event.data
  console.log('data',data);
  
    if(data && data.url) {
      currentSrc.value = data.url
    }
  } catch(error) {
    // cuowu
  }
}

const onload = ()=> {
  loading.value = false
  props.onload && props.onload(frameRef.value)
}


onMounted(() => {
  setTimeout(() => {
    init()
  }, 300)

 
  const iframe =frameRef.value
  if(iframe) {
    // iframe.addEventListener('load',)
  }
  window.addEventListener('message',handleMessage)
})
</script>
<template>
  <div v-loading="loading" :style="'height:' + height">
    
    <iframe
      ref="frameRef"
      :src="currentSrc"
      frameborder="no"
      scrolling="auto"
      style="width: 100%; height: 100vh"
      @load="onload"
    ></iframe>
  </div>
</template>
