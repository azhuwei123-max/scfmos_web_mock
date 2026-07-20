<template>
   <div class="indebt-container" v-loading="loading" element-loading-text="正在加载中...">
     <!-- <iframe v-if="iframeUrl" :src="iframeUrl" frameborder="0" class="indebt-iframe"></iframe> -->
   </div>
</template>

<script setup>
import {onMounted} from 'vue'

import {ElMessage} from 'element-plus'
import {useUserStore} from '@/store/modules/user'
import { useDictStoreWithOut } from '@/store/modules/dict'
import * as authUtil from '@/utils/auth'
import {getUserPassword} from '@/api/indebt'
import { getIndebtUrl } from '@/views/Home/api'


defineOptions({
  name: 'indebt'
})



const router = useRouter()
const userStore = useUserStore()
const dictStore = useDictStoreWithOut()


const iframeUrl = ref('')
const loading = ref(true)

const getTargetDomain = () => {
  if(!dictStore.getIsSetDict) {
    dictStore.setDictMap()
  }

  const dictOptions = dictStore.getDictByType('indebt_addr')
  
  if(!dictOptions || dictOptions.length ===0) {
      throw new Error('未配置跳转域名，请联系管理员')
  }

  const domain = dictOptions[0].value || dictOptions[0].label

  if(!domain) {
    throw new Error('字典配置的域名为空，请联系管理员')
  }

  return domain
}

const performRedirect = async () => {
   try {
    loading.value = true
    const url = await getIndebtUrl()

    console.log('url',url);

    const targetDomain = getTargetDomain()

    window.open(url,'_blank')

    router.push({path:'/'})

   } catch (error) {
      console.error("跳转失败",error)
      loading.value = false
      router.push({path:'/'})
   }
}



onActivated(()=> {
  performRedirect()
})




</script>

<style scoped lang="scss">
 .indebt-container {
  width: 100%;
  height: 100%;
  position: relative;
 }

 .indebt-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
 }

</style>
