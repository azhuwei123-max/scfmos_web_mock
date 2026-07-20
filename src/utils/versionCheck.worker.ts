/**
 * 版本检测 Web Worker
 * 在后台线程中检测版本更新，不阻塞主线程
 */

// Worker 全局作用域类型
declare const self: DedicatedWorkerGlobalScope

let checkTimer: ReturnType<typeof setInterval> | null = null
let currentVersion = ''
let checkInterval = 5 * 60 * 1000 // 默认5分钟

/**
 * 获取当前版本（从 version.json 或 index.html 的 etag）
 */
const getCurrentVersion = async (baseUrl: string): Promise<string> => {
  try {
    // 方法1: 优先检查 index.html 的 etag
    const response = await fetch(`${baseUrl}index.html?t=${Date.now()}`, {
      method: 'HEAD',
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    
    if (response.ok) {
      const etag = response.headers.get('etag')
      const lastModified = response.headers.get('last-modified')
      
      if (etag) {
        return etag.replace(/^"|"$/g, '')
      }
      
      if (lastModified) {
        return lastModified
      }
      
      const contentLength = response.headers.get('content-length')
      const date = response.headers.get('date')
      if (contentLength && date) {
        return `${contentLength}-${date}`
      }
    }
  } catch (error) {
    console.warn('[VersionCheck Worker] 无法获取 index.html etag:', error)
  }
  
  try {
    // 方法2: 从 version.json 获取版本信息
    const response = await fetch(`${baseUrl}version.json?t=${Date.now()}`, {
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
    console.warn('[VersionCheck Worker] 无法获取 version.json:', error)
  }
  
  return Date.now().toString()
}

/**
 * 检查版本更新
 */
const checkVersion = async (baseUrl: string) => {
  try {
    const newVersion = await getCurrentVersion(baseUrl)
    
    if (!currentVersion) {
      // 首次加载，保存当前版本
      currentVersion = newVersion
      // 通知主线程当前版本
      self.postMessage({
        type: 'version-initialized',
        version: currentVersion
      })
      return
    }
    
    if (currentVersion !== newVersion) {
      // 版本发生变化，检测到更新
      self.postMessage({
        type: 'version-updated',
        oldVersion: currentVersion,
        newVersion: newVersion
      })
    }
  } catch (error) {
    console.error('[VersionCheck Worker] 版本检查失败:', error)
    self.postMessage({
      type: 'error',
      error: String(error)
    })
  }
}

/**
 * 开始版本检测
 */
const startCheck = (baseUrl: string, interval: number) => {
  checkInterval = interval
  
  // 立即检查一次
  checkVersion(baseUrl)
  
  // 清除之前的定时器
  if (checkTimer !== null) {
    clearInterval(checkTimer)
  }
  
  // 设置定时检查
  checkTimer = setInterval(() => {
    checkVersion(baseUrl)
  }, checkInterval)
}

/**
 * 停止版本检测
 */
const stopCheck = () => {
  if (checkTimer !== null) {
    clearInterval(checkTimer)
    checkTimer = null
  }
}

// 监听主线程消息
self.addEventListener('message', (event: MessageEvent) => {
  const { type, payload } = event.data
  
  switch (type) {
    case 'start':
      startCheck(payload.baseUrl || '/', payload.interval || 5 * 60 * 1000)
      break
    case 'stop':
      stopCheck()
      break
    case 'check-now':
      checkVersion(payload.baseUrl || '/')
      break
    default:
      console.warn('[VersionCheck Worker] 未知消息类型:', type)
  }
})

// Worker 初始化完成
self.postMessage({
  type: 'worker-ready'
})
