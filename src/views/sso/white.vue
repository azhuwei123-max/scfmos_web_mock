<template>
    <div class="login" >
      <div  v-loading.fullscreen.lock="loginLoading">
  
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { encrypt, decrypt } from '@/utils/jsencrypt'
  import * as LoginApi from '@/api/login'
  import * as authUtil from '@/utils/auth'
  import { useUserStore } from '@/store/modules/user'
  import { usePermissionStore } from '@/store/modules/permission'
  import { useMessage } from '@/hooks/web/useMessage'
  
  defineOptions({ name: 'SsoWhite' })
  
  const router = useRouter()
  const message = useMessage()
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  const loginLoading = ref(true)
  
  interface SsoAccountPayload {
    username: string
    password: string
    tenantName?: string
  }
  
  const redirectToLogin = () => {
    router.replace({ path: '/login' })
  }
  
  const parseAccountParam = (): SsoAccountPayload | null => {
    const params = new URLSearchParams(window.location.search)
    const account = params.get('account')
    if (!account) {
      return null
    }
    try {
      const decrypted = decrypt(decodeURIComponent(account))
      if (!decrypted) {
        return null
      }
      return JSON.parse(decrypted)
    } catch (error) {
      console.error('[SSO] decode account param failed', error)
      return null
    }
  }
  
  const performLogin = async (payload: SsoAccountPayload) => {
    try {
      loginLoading.value = true
      if (import.meta.env.VITE_APP_TENANT_ENABLE === 'true' && payload.tenantName) {
        const tenantId = await LoginApi.getTenantIdByName(payload.tenantName)
        authUtil.setTenantId(tenantId)
      }
      const res = await LoginApi.login({
        username: payload.username,
        password: encrypt(payload.password) as string,
        captchaVerification: '',
        tenantName: payload.tenantName
      })
      if (!res) {
        throw new Error('登录响应为空')
      }
      authUtil.setToken(res)
      await Promise.all([userStore.setUserInfoAction(), permissionStore.generateRoutes()])
      loginLoading.value = false
      router.replace({ path: '/' })
    } catch (error) {
      console.error('[SSO] login failed', error)
      loginLoading.value = false
      message.error('SSO 登录失败，请重新登录')
      redirectToLogin()
    }
  }
  
  onMounted(async () => {
    const payload = parseAccountParam()
    if (!payload?.username || !payload?.password) {
      redirectToLogin()
      return
    }
    await performLogin(payload)
  })
  </script>
  
  <style lang="scss" scoped>
  
  </style>
  
  