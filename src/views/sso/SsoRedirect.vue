<template>
  <div class="sso-redirect-container">
    <div class="sso-content">
      <div class="sso-logo">
        <el-icon :size="80" class="loading-icon">
          <Loading />
        </el-icon>
      </div>
      <div class="sso-title">正在跳转到 {{ systemName }}</div>
      <div class="sso-subtitle">请稍候，正在进行身份验证...</div>
      <el-progress
        :percentage="progress"
        :color="progressColors"
        :show-text="false"
        class="progress-bar"
      />
      <div class="sso-tips">
        <el-icon><InfoFilled /></el-icon>
        <span>{{ tipMessage }}</span>
      </div>
      <div class="sso-actions" v-if="showRetry">
        <el-button tpye="" @click="handleRetry">
          <el-icon><Refresh /></el-icon>
          重试
        </el-button>
        <el-button @click="handleCancel">
          <el-icon><Close /></el-icon>
          返回
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// @ts-ignore
import { Loading, InfoFilled, Refresh, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getAccessToken } from '@/utils/auth'
import { useUserStore } from '@/store/modules/user'

defineOptions({ name: 'SsoRedirect' })

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 获取目标系统信息
const targetUrl = ref((route.query.targetUrl as string) || '')
const systemName = ref((route.query.systemName as string) || '目标系统')
const ssoType = ref((route.query.type as string) || 'token') // token, form, iframe

// 进度条
const progress = ref(0)
const progressColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 }
]

// 提示信息
const tipMessage = ref('正在获取用户信息...')
const showRetry = ref(false)

// 定时器
let progressTimer: any = null
let redirectTimer: any = null

// 进度条动画
const startProgress = () => {
  progressTimer = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 10
    }
  }, 300)
}

// 停止进度条
const stopProgress = () => {
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
}

// 完成进度
const completeProgress = () => {
  stopProgress()
  progress.value = 100
}

// Token 方式跳转
const redirectWithToken = async () => {
  try {
    tipMessage.value = '正在获取访问令牌...'
    const token = getAccessToken()

    if (!token) {
      throw new Error('未获取到访问令牌')
    }

    progress.value = 40
    tipMessage.value = '正在验证用户身份...'

    // 获取用户信息
    const userInfo = userStore.getUser
    if (!userInfo || !userInfo.id) {
      throw new Error('未获取到用户信息')
    }

    progress.value = 60
    tipMessage.value = '正在构建跳转链接...'

    // 构建目标 URL
    let finalUrl = targetUrl.value
    const separator = finalUrl.includes('?') ? '&' : '?'

    // 添加 token 和用户信息
    finalUrl += `${separator}token=${encodeURIComponent(token)}`
    finalUrl += `&userId=${encodeURIComponent(userInfo.id)}`
    finalUrl += `&nickname=${encodeURIComponent(userInfo.nickname || '')}`
    finalUrl += `&timestamp=${Date.now()}`

    progress.value = 80
    tipMessage.value = '即将跳转...'

    completeProgress()

    // 延迟跳转，让用户看到完成状态
    redirectTimer = setTimeout(() => {
      window.location.href = finalUrl
    }, 500)
  } catch (error: any) {
    stopProgress()
    showRetry.value = true
    tipMessage.value = `跳转失败：${error.message}`
    ElMessage.error(error.message)
  }
}

// Form 表单方式跳转（POST）
const redirectWithForm = async () => {
  try {
    tipMessage.value = '正在准备表单数据...'
    const token = getAccessToken()

    if (!token) {
      throw new Error('未获取到访问令牌')
    }

    progress.value = 50
    const userInfo = userStore.getUser

    tipMessage.value = '正在提交表单...'

    // 创建隐藏表单
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = targetUrl.value
    form.target = '_self'
    form.style.display = 'none'

    // 添加表单字段
    const fields = {
      token: token,
      userId: userInfo?.id || '',
      nickname: userInfo?.nickname || '',
      timestamp: Date.now().toString()
    }

    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = name
      input.value = String(value)
      form.appendChild(input)
    })

    progress.value = 80
    completeProgress()

    // 添加到页面并提交
    document.body.appendChild(form)

    redirectTimer = setTimeout(() => {
      form.submit()
    }, 500)
  } catch (error: any) {
    stopProgress()
    showRetry.value = true
    tipMessage.value = `跳转失败：${error.message}`
    ElMessage.error(error.message)
  }
}

// IFrame 方式跳转
const redirectWithIframe = async () => {
  try {
    tipMessage.value = '正在创建安全通道...'
    const token = getAccessToken()

    if (!token) {
      throw new Error('未获取到访问令牌')
    }

    progress.value = 50
    tipMessage.value = '正在打开新窗口...'

    const userInfo = userStore.getUser

    // 构建 URL
    let finalUrl = targetUrl.value
    const separator = finalUrl.includes('?') ? '&' : '?'
    finalUrl += `${separator}token=${encodeURIComponent(token)}`
    finalUrl += `&userId=${encodeURIComponent(userInfo?.id || '')}`

    progress.value = 80
    completeProgress()

    // 在新窗口打开
    redirectTimer = setTimeout(() => {
      window.open(finalUrl, '_blank')
      // 停留在当前页面或返回
      setTimeout(() => {
        router.back()
      }, 1000)
    }, 500)
  } catch (error: any) {
    stopProgress()
    showRetry.value = true
    tipMessage.value = `跳转失败：${error.message}`
    ElMessage.error(error.message)
  }
}

// 执行跳转
const executeRedirect = () => {
  if (!targetUrl.value) {
    tipMessage.value = '错误：未指定目标系统地址'
    showRetry.value = true
    ElMessage.error('未指定目标系统地址')
    return
  }

  startProgress()

  switch (ssoType.value) {
    case 'form':
      redirectWithForm()
      break
    case 'iframe':
      redirectWithIframe()
      break
    case 'token':
    default:
      redirectWithToken()
      break
  }
}

// 重试
const handleRetry = () => {
  showRetry.value = false
  progress.value = 0
  executeRedirect()
}

// 取消返回
const handleCancel = () => {
  router.back()
}

// 组件挂载
onMounted(() => {
  // 检查是否已登录
  const token = getAccessToken()
  if (!token) {
    ElMessage.error('未登录，请先登录')
    router.push('/login')
    return
  }

  // 延迟执行，显示加载动画
  setTimeout(() => {
    executeRedirect()
  }, 800)
})

// 组件卸载
onBeforeUnmount(() => {
  stopProgress()
  if (redirectTimer) {
    clearTimeout(redirectTimer)
  }
})
</script>

<style lang="scss" scoped>
.sso-redirect-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;

  .sso-content {
    background: #fff;
    border-radius: 16px;
    padding: 60px 40px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    text-align: center;
    max-width: 500px;
    width: 100%;
    animation: fadeInUp 0.6s ease-out;

    .sso-logo {
      margin-bottom: 30px;

      .loading-icon {
        color: #667eea;
        animation: rotate 2s linear infinite;
      }
    }

    .sso-title {
      font-size: 24px;
      font-weight: 600;
      color: #262626;
      margin-bottom: 12px;
    }

    .sso-subtitle {
      font-size: 14px;
      color: #8c8c8c;
      margin-bottom: 30px;
    }

    .progress-bar {
      margin-bottom: 30px;

      :deep(.el-progress-bar__outer) {
        height: 8px !important;
        border-radius: 4px;
      }

      :deep(.el-progress-bar__inner) {
        border-radius: 4px;
      }
    }

    .sso-tips {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 16px;
      background: #f0f9ff;
      border-radius: 8px;
      color: #1890ff;
      font-size: 14px;
      margin-bottom: 20px;

      .el-icon {
        font-size: 18px;
      }
    }

    .sso-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-top: 24px;
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 响应式
@media (max-width: 768px) {
  .sso-redirect-container {
    .sso-content {
      padding: 40px 20px;

      .sso-title {
        font-size: 20px;
      }

      .sso-logo .loading-icon {
        font-size: 60px;
      }
    }
  }
}
</style>
