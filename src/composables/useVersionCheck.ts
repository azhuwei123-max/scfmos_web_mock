/**
 * 版本检测 Composable
 * 使用 Web Worker 在后台线程检测版本更新，不阻塞主线程
 */
import { ref, onMounted, onUnmounted } from 'vue'

export interface VersionInfo {
  version: string
  buildTime: string
}

const currentVersion = ref<string>('')
const hasUpdate = ref(false)
let worker: Worker | null = null

/**
 * 开始版本检测
 * @param interval 检测间隔（毫秒），默认 5 分钟
 */
export const useVersionCheck = (interval: number = 5 * 60 * 1000) => {

  // 开发环境不启用版本检测
  if(import.meta.env.DEV) {
    return {
      hasUpdate:ref(false),
      currentVersion:ref(''),
      checkNow:()=> {},
      refreshPage:()=> {},
      startCheck:()=> {},
      stopCheck:()=> {}
    }
  }


  const startCheck = () => {
    // 如果 Worker 已存在，先终止
    if (worker) {
      worker.terminate()
    }
    
    try {
      // 创建 Web Worker
      // Vite 会自动处理 .worker.ts 文件
      worker = new Worker(
        new URL('../utils/versionCheck.worker.ts', import.meta.url),
        { 
          type: 'module',
          name: 'version-check-worker'
        }
      )
      
      // 监听 Worker 消息
      worker.addEventListener('message', (event: MessageEvent) => {
        const { type, version, oldVersion, newVersion, error } = event.data
        
        switch (type) {
          case 'worker-ready':
            // Worker 准备就绪，开始检测
            worker?.postMessage({
              type: 'start',
              payload: {
                baseUrl: import.meta.env.BASE_URL,
                interval
              }
            })
            break
            
          case 'version-initialized':
            // 版本初始化完成
            currentVersion.value = version
            console.log('[VersionCheck] 当前版本:', version)
            break
            
          case 'version-updated':
            // 检测到版本更新
            console.log('[VersionCheck] 检测到版本更新:', {
              oldVersion,
              newVersion
            })
            hasUpdate.value = true
            break
            
          case 'error':
            console.error('[VersionCheck] Worker 错误:', error)
            break
            
          default:
            console.warn('[VersionCheck] 未知消息类型:', type)
        }
      })
      
      // 监听 Worker 错误
      worker.addEventListener('error', (error) => {
        console.error('[VersionCheck] Worker 发生错误:', error)
        // Worker 出错时，回退到主线程检测（可选）
        fallbackToMainThread(interval)
      })
      
    } catch (error) {
      console.error('[VersionCheck] 无法创建 Worker，回退到主线程检测:', error)
      // 如果 Worker 不支持，回退到主线程检测
      fallbackToMainThread(interval)
    }
  }
  
  /**
   * 回退到主线程检测（当 Worker 不可用时）
   */
  const fallbackToMainThread = (interval: number) => {
    let checkTimer: NodeJS.Timeout | null = null
    
    const getCurrentVersion = async (): Promise<string> => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}version.json?t=${Date.now()}`, {
          method: 'GET',
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          return String(data.timestamp || data.buildTime || Date.now())
        }
      } catch (error) {
        console.warn('[VersionCheck] 无法获取 version.json:', error)
      }
      
      return Date.now().toString()
    }
    
    const checkVersion = async () => {
      try {
        const newVersion = await getCurrentVersion()
        
        if (!currentVersion.value) {
          currentVersion.value = newVersion
          return
        }
        
        if (currentVersion.value !== newVersion) {
          hasUpdate.value = true
        }
      } catch (error) {
        console.error('[VersionCheck] 版本检查失败:', error)
      }
    }
    
    // 立即检查一次
    checkVersion()
    
    // 设置定时检查
    checkTimer = setInterval(() => {
      checkVersion()
    }, interval)
  }
  
  const stopCheck = () => {
    if (worker) {
      worker.postMessage({ type: 'stop' })
      worker.terminate()
      worker = null
    }
  }
  
  const checkNow = () => {
    if (worker) {
      worker.postMessage({
        type: 'check-now',
        payload: {
          baseUrl: import.meta.env.BASE_URL
        }
      })
    }
  }
  
  const refreshPage = () => {
    window.location.reload()
  }
  
  onMounted(() => {
    startCheck()
  })
  
  onUnmounted(() => {
    stopCheck()
  })
  
  return {
    hasUpdate,
    currentVersion,
    checkNow,
    refreshPage,
    startCheck,
    stopCheck
  }
}
