<template>
  <div class="third-party-login-container">
    <div class="login-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-icon">
          <el-icon :size="80" class="rotating">
            <Loading />
          </el-icon>
        </div>
        <div class="loading-title">正在连接第三方平台</div>
        <div class="loading-subtitle">{{ statusMessage }}</div>
        <el-progress
          :percentage="progress"
          :color="progressColors"
          :show-text="false"
          class="progress-bar"
        />
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">
          <el-icon :size="80" color="#f5222d">
            <CircleClose />
          </el-icon>
        </div>
        <div class="error-title">连接失败</div>
        <div class="error-message">{{ errorMessage }}</div>
        <div class="error-actions">
          <el-button tpye="" @click="handleRetry" :icon="Refresh"> 重试 </el-button>
          <el-button @click="handleBack" :icon="Back"> 返回 </el-button>
        </div>
      </div>

      <!-- 成功状态 -->
      <div v-else-if="success" class="success-state">
        <div class="success-icon">
          <el-icon :size="80" color="#52c41a">
            <SuccessFilled />
          </el-icon>
        </div>
        <div class="success-title">验证成功</div>
        <div class="success-subtitle">即将跳转到第三方平台...</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// @ts-ignore
import { Loading, CircleClose, SuccessFilled, Refresh, Back } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import request from '@/config/axios'
import { getAccessToken } from '@/utils/auth'

defineOptions({ name: 'ThirdPartyLogin' })

const route = useRoute()
const router = useRouter()

// 从 URL 参数获取配置
const targetUrl = ref((route.query.targetUrl as string) || '')
const platformName = ref((route.query.platformName as string) || '第三方平台')
const apiUrl = ref((route.query.apiUrl as string) || '/sso/third-party/login') // 后端接口地址

// 状态
const loading = ref(true)
const error = ref(false)
const success = ref(false)
const progress = ref(0)
const statusMessage = ref('正在验证身份...')
const errorMessage = ref('')

// 进度条颜色
const progressColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 }
]

// 定时器
let progressTimer: any = null
let redirectTimer: any = null

// 启动进度条动画
const startProgress = () => {
  progressTimer = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 15
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

/**
 * 调用后端接口获取 sessionId
 * 这是核心对接函数，根据后端实际接口调整
 */
const getThirdPartySessionId = async () => {
  try {
    loading.value = true
    error.value = false
    startProgress()

    // 第一步：验证当前用户登录状态
    statusMessage.value = '正在验证用户身份...'
    const token = getAccessToken()

    if (!token) {
      throw new Error('用户未登录，请先登录系统')
    }

    progress.value = 20

    // 第二步：调用后端接口获取第三方平台的 sessionId
    statusMessage.value = '正在获取第三方平台凭证...'

    /**
     * 调用后端接口
     * 根据你们后端实际的接口格式调整
     */
    const response = await request.post({
      url: apiUrl.value,
      data: {
        token: token,
        targetUrl: targetUrl.value,
        platform: platformName.value
      }
    })

    progress.value = 60

    // 第三步：验证响应数据
    statusMessage.value = '正在验证返回数据...'

    if (!response || !response.sessionId) {
      throw new Error('未获取到有效的 sessionId')
    }

    const sessionId = response.sessionId
    const redirectUrl = response.redirectUrl || targetUrl.value

    progress.value = 80

    // 第四步：构建跳转URL
    statusMessage.value = '正在准备跳转...'

    let finalUrl = redirectUrl
    const separator = finalUrl.includes('?') ? '&' : '?'
    finalUrl += `${separator}sessionId=${encodeURIComponent(sessionId)}`

    // 如果后端返回了其他参数，也添加上
    if (response.userId) {
      finalUrl += `&userId=${encodeURIComponent(response.userId)}`
    }
    if (response.timestamp) {
      finalUrl += `&timestamp=${encodeURIComponent(response.timestamp)}`
    }

    completeProgress()
    success.value = true
    loading.value = false

    // 第五步：延迟跳转，让用户看到成功状态
    statusMessage.value = '即将跳转...'
    redirectTimer = setTimeout(() => {
      window.location.href = finalUrl
    }, 1000)
  } catch (err: any) {
    stopProgress()
    loading.value = false
    error.value = true
    errorMessage.value = err.message || err.msg || '连接第三方平台失败，请稍后重试'
    ElMessage.error(errorMessage.value)
    console.error('第三方登录失败:', err)
  }
}

// 重试
const handleRetry = () => {
  progress.value = 0
  getThirdPartySessionId()
}

// 返回
const handleBack = () => {
  router.back()
}

// 组件挂载
onMounted(() => {
  // 验证必要参数
  if (!targetUrl.value) {
    error.value = true
    errorMessage.value = '错误：未指定目标平台地址'
    ElMessage.error('未指定目标平台地址')
    return
  }

  // 延迟执行，显示加载动画
  setTimeout(() => {
    getThirdPartySessionId()
  }, 500)
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
.third-party-login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;

  .login-content {
    background: #fff;
    border-radius: 16px;
    padding: 60px 40px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    text-align: center;
    max-width: 500px;
    width: 100%;
    animation: fadeInUp 0.6s ease-out;

    .loading-state,
    .error-state,
    .success-state {
      .loading-icon,
      .error-icon,
      .success-icon {
        margin-bottom: 30px;

        .rotating {
          animation: rotate 2s linear infinite;
        }
      }

      .loading-title,
      .error-title,
      .success-title {
        font-size: 24px;
        font-weight: 600;
        color: #262626;
        margin-bottom: 12px;
      }

      .loading-subtitle,
      .success-subtitle {
        font-size: 14px;
        color: #8c8c8c;
        margin-bottom: 30px;
      }

      .error-message {
        font-size: 14px;
        color: #f5222d;
        margin-bottom: 30px;
        padding: 16px;
        background: #fff1f0;
        border-radius: 8px;
        border: 1px solid #ffccc7;
      }

      .progress-bar {
        margin-bottom: 20px;

        :deep(.el-progress-bar__outer) {
          height: 8px !important;
          border-radius: 4px;
        }

        :deep(.el-progress-bar__inner) {
          border-radius: 4px;
        }
      }

      .error-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
      }
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
  .third-party-login-container {
    .login-content {
      padding: 40px 20px;

      .loading-title,
      .error-title,
      .success-title {
        font-size: 20px;
      }
    }
  }
}
</style>
