<template>
  <div class="sso-container">
    <div v-loading.fullscreen.lock="loading" element-loading-text="正在登录中...">
      <div class="sso-loading-content">
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
        <p class="loading-text">{{ loadingText }}</p>
      </div>
    </div>

    <!-- 错误提示 -->
    <el-dialog
      v-model="errorDialogVisible"
      title="登录失败"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div class="error-content">
        <el-icon class="error-icon" :size="48" color="#f56c6c">
          <WarningFilled />
        </el-icon>
        <p class="error-message">{{ errorMessage }}</p>
      </div>
      <template #footer>
        <el-button tpye="" @click="handleErrorConfirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { WarningFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as SsoApi from '@/api/sso'
import * as authUtil from '@/utils/auth'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'
import {deleteUserCache} from '@/hooks/web/useCache'
import { encrypt } from '@/utils/jsencrypt'
import {removeToken} from "@/utils/auth";
import { resetRouter } from '@/router'


defineOptions({ name: 'SingleSignOn' })

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const loadingText = ref('正在验证登录信息...')
const errorDialogVisible = ref(false)
const errorMessage = ref('')

/**
 * 解析 URL 参数
 */
const parseUrlParams = () => {
  const params = route.query 
      // 给systemCode 赋默认值 ========= 解决oa系统跳转无法识别问题

  const systemCode = (params.systemCode ?? '500340') as string 
  
  if (!systemCode) {
    throw new Error('缺少 systemCode 参数')
  }

  if (systemCode == '500340') {
    // systemCode=1: 验证 ticket
    let ticket = params.ticket as string
    if(!ticket){
      ticket = tryAcquireTicket(ticket); 
      console.log('ticket修改后:' + ticket)
    }else{
      throw new Error('缺少 ticket 参数')
    }
    if (!ticket) {
      
    }
    return {
      systemCode: '500340',
      ticket,
      // userId,
      // userPwd
    }
  } else if (systemCode == '300020') {
    // systemCode=2: 验证用户名密码
    const userId = params.userId as string
    const userPwd =  params.userPwd as string
    if (!userId || !userPwd) {
      throw new Error('缺少 userId 或 userPwd 参数')
    }
    return {
      systemCode: '300020',
      userId,
      userPwd
    }
  } else {
    throw new Error(`不支持的 systemCode: ${systemCode}`)
  }
}

// 从url地址中获取ticket ========== oa系统由于无法识别history路由模式下 # 号 自动将ticket拼接到
function tryAcquireTicket(ticket) : string {
   ticket = new URLSearchParams(location.search).get('ticket')
   return ticket                                                                                                                                                                                                                           
}

/**
 * 处理 systemCode=1: ticket 验证
 */
const handleticketLogin = async (params) => {
  loadingText.value = '正在验证 ticket...'

  try {
    // 调用 mock API 验证 ticket
    console.log('正在验证 ticket...');
    await removeUser()
    const res = await SsoApi.verifyTicket(params)

    console.log('res',res);

    if (!res) {
      throw new Error('ticket 验证失败')
    }

    authUtil.setToken(res)

    // 设置 ticket
    // authUtil.setticket({
    //   accessticket: res.accessticket,
    //   refreshticket: res.refreshticket
    // })

    // 加载用户信息和路由
    // loadingText.value = '正在加载用户信息...'
    // await Promise.all([userStore.setUserInfoAction(), permissionStore.generateRoutes()])

    // loadingText.value = '登录成功，正在跳转...'

    // 延迟一下让用户看到成功提示
    loadingText.value = '正在加载用户信息...'
await Promise.all([userStore.setUserInfoAction(), permissionStore.generateRoutes()])

loadingText.value = '登录成功，正在跳转...'

// 延迟一下让用户看到成功提示
setTimeout(() => {
  loading.value = false
   router.replace({ path: '/' })
   window.location.href = '/SCFMOS'
}, 500)
  } catch (error: any) {
    console.error('[SSO] ticket 验证失败:', error)
    loading.value = false
    errorMessage.value = error?.message || 'ticket 验证失败，请重新登录'
    errorDialogVisible.value = true
  }
}

const removeUser = async () =>{
  return new Promise((resolve)=> {
    removeToken()
    deleteUserCache() // 删除用户缓存
    setTimeout(() => {
      resolve('1')
    }, 500)
   
  })
}

/**
 * 处理 systemCode=2: 用户名密码验证
 */
const handlePasswordLogin = async (params) => {
  loadingText.value = '正在验证用户名和密码...'

  try {
    // 加密密码
    // const encryptedPassword = encrypt(password) as string
    await removeUser().then(async res => {
     if(res == '1') {
      const res = await SsoApi.verifyTicket(params)

if (!res) {
  throw new Error('登录失败')
}


 console.log('res',res);
 
authUtil.setToken(res)

// resetRouter() //重置路由
//  userStore.resetState()

// 加载用户信息和路由
loadingText.value = '正在加载用户信息...'
await Promise.all([userStore.setUserInfoAction(), permissionStore.generateRoutes()])

loadingText.value = '登录成功，正在跳转...'

// 延迟一下让用户看到成功提示
setTimeout(() => {
  loading.value = false
   router.replace({ path: '/' })
   window.location.href = '/SCFMOS'
}, 500)
     }
    })
   
   
  } catch (error: any) {
    console.error('[SSO] 密码登录失败:', error)
    loading.value = false
    errorMessage.value = error?.message || '用户名或密码错误，请重新登录'
    errorDialogVisible.value = true
  }
}

/**
 * 执行登录流程
 */
const performLogin = async () => {

  try {
    
    
    
    const params = parseUrlParams()
    console.log('params',params);
    
    if (params.systemCode === '500340') {
      await handleticketLogin(params)
    } else if (params.systemCode === '300020') {
      await handlePasswordLogin(params)
    }
  } catch (error: any) {
    console.error('[SSO] 登录流程失败:', error)
    loading.value = false
    errorMessage.value = error?.message || '登录参数错误，请检查 URL 参数'
    errorDialogVisible.value = true
  }
}

/**
 * 处理错误确认
 */
const handleErrorConfirm = () => {
  errorDialogVisible.value = false
  router.replace({ path: '/login' })
}

const userStore = useUserStore()
const permissionStore = usePermissionStore()

onMounted(() => {
  performLogin()
})
</script>

<style lang="scss" scoped>
.sso-container {
  display: flex;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  align-items: center;
  justify-content: center;
}

.sso-loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.loading-spinner {
  width: 80px;
  height: 80px;
}

.spinner {
  width: 100%;
  height: 100%;
  border: 4px solid rgb(255 255 255 / 30%);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  text-shadow: 0 2px 4px rgb(0 0 0 / 20%);
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 16px;
}

.error-icon {
  margin-bottom: 8px;
}

.error-message {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--el-text-color-primary);
  text-align: center;
}
</style>
