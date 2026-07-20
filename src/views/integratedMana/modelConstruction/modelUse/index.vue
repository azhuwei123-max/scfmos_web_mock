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
import { getFRUrl } from '@/api/modelUse'


defineOptions({
 name: 'modelUse'
})



const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
// const dictStore = useDictStoreWithOut()


const iframeUrl = ref('')
const loading = ref(true)

const getUserCredntials = async () => {
  const loginForm = authUtil.getLoginForm()

 if(!loginForm || !loginForm.username) {
   return null
 }


  
 const response = await getUserPassword({
   userId:loginForm.username
 })
  const password  = typeof response === 'string' ? response :(response?.password || response.data.password)
  console.log('password',password);

 if(!password) {
   return {
     username:loginForm.username,
     password:null
   }
 }


 return {
   username:loginForm.username,
   password:password
 }
}

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

   const templateno = route.name === 'modelSxspWatch' ? '01' : '02'
   const credentials = await getFRUrl({templateno})

  //  if(!credentials) {
  //    ElMessage.Error('无法获取用户信息，请重新登录')
  //    router.back()
  //    return
  //  }

  //  if(!credentials.password) {
  //    ElMessage.Error('无法获取密码信息吗，请重新登录并勾选“记住我”')
  //    router.back()
  //    return
  //  }

  //  const targetDomain = getTargetDomain()


   

  //  const url = new URL(targetDomain)



  //  url.pathname = '/dashboard/analysis'

  //  url.searchParams.set('userId',credentials.username)
  //  url.searchParams.set('userPwd',encodeURIComponent(credentials.password))

   const finalUrl = credentials


   console.log('finalUrl',finalUrl)
   //  window.location.href = finalUrl
    window.open(finalUrl,'_blank')
    router.push({path:'/'})
  } catch (error) {
    //  console.error("跳转失败",error)
    //  loading.value = false
    //  router.push({path:'/'})
  }
}



onMounted(()=> {
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
