<template>
  <div class="code-viewer">
    <div v-if="title || showCopy" class="code-viewer-header flex items-center justify-between mb-15px">
      <span v-if="title" class="text-16px font-bold">{{ title }}</span>
      <el-button v-if="showCopy" size="small" tpye="" @click="handleCopy">
        <Icon icon="ep:document-copy" class="mr-5px" />
        复制
      </el-button>
    </div>
    <el-scrollbar :height="height">
      <pre class="code-viewer-container"><code class="hljs" :class="language" v-dompurify-html="highlightedCode"></code></pre>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useClipboard } from '@vueuse/core'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import java from 'highlight.js/lib/languages/java'
import sql from 'highlight.js/lib/languages/sql'
import css from 'highlight.js/lib/languages/css'
import scss from 'highlight.js/lib/languages/scss'
import python from 'highlight.js/lib/languages/python'
import bash from 'highlight.js/lib/languages/bash'
import yaml from 'highlight.js/lib/languages/yaml'
import { propTypes } from '@/utils/propTypes'

defineOptions({ name: 'CodeViewer' })

const message = useMessage()

interface Props {
  /** 代码内容 */
  code?: string
  /** 语言类型：xml, json, javascript, typescript, java, sql, css, scss, python, bash, yaml 等 */
  language?: string
  /** 标题 */
  title?: string
  /** 是否显示复制按钮 */
  showCopy?: boolean
  /** 代码区域高度 */
  height?: string
  /** 是否自动检测语言类型 */
  autoDetect?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  code: '',
  language: 'xml',
  title: '',
  showCopy: true,
  height: '400px',
  autoDetect: false
})

// 已注册的语言
const registeredLanguages = ref<Set<string>>(new Set())

// 注册语言支持
const registerLanguage = (lang: string) => {
  if (registeredLanguages.value.has(lang)) {
    return
  }

  try {
    switch (lang) {
      case 'xml':
      case 'html':
        hljs.registerLanguage('xml', xml)
        hljs.registerLanguage('html', xml)
        break
      case 'json':
        hljs.registerLanguage('json', json)
        break
      case 'javascript':
      case 'js':
        hljs.registerLanguage('javascript', javascript)
        break
      case 'typescript':
      case 'ts':
        hljs.registerLanguage('typescript', typescript)
        break
      case 'java':
        hljs.registerLanguage('java', java)
        break
      case 'sql':
        hljs.registerLanguage('sql', sql)
        break
      case 'css':
        hljs.registerLanguage('css', css)
        break
      case 'scss':
      case 'sass':
        hljs.registerLanguage('scss', scss)
        break
      case 'python':
      case 'py':
        hljs.registerLanguage('python', python)
        break
      case 'bash':
      case 'shell':
      case 'sh':
        hljs.registerLanguage('bash', bash)
        break
      case 'yaml':
      case 'yml':
        hljs.registerLanguage('yaml', yaml)
        break
    }
    registeredLanguages.value.add(lang)
  } catch (error) {
    console.warn(`注册语言 ${lang} 失败:`, error)
  }
}

// 自动检测语言类型
const detectLanguage = (code: string): string => {
  if (!code || !code.trim()) {
    return 'xml'
  }

  const trimmedCode = code.trim()

  // 检测 XML
  if (trimmedCode.startsWith('<?xml') || trimmedCode.startsWith('<')) {
    return 'xml'
  }

  // 检测 JSON
  if ((trimmedCode.startsWith('{') && trimmedCode.endsWith('}')) ||
      (trimmedCode.startsWith('[') && trimmedCode.endsWith(']'))) {
    try {
      JSON.parse(trimmedCode)
      return 'json'
    } catch {
      // 不是有效的 JSON
    }
  }

  // 检测其他语言（可以根据需要扩展）
  if (trimmedCode.includes('function') || trimmedCode.includes('const ') || trimmedCode.includes('let ')) {
    if (trimmedCode.includes('interface') || trimmedCode.includes('type ')) {
      return 'typescript'
    }
    return 'javascript'
  }

  // 默认返回 XML
  return 'xml'
}

// 当前使用的语言
const currentLanguage = computed(() => {
  if (props.autoDetect && props.code) {
    return detectLanguage(props.code)
  }
  return props.language
})

// 代码高亮
const highlightedCode = computed(() => {
  if (!props.code) {
    return '&nbsp;'
  }

  try {
    const lang = currentLanguage.value
    registerLanguage(lang)
    
    const result = hljs.highlight(props.code, { language: lang })
    return result.value || props.code
  } catch (error) {
    console.error('代码高亮失败:', error)
    return props.code
  }
})

// 复制代码
const handleCopy = async () => {
  if (!props.code) {
    message.warning('没有可复制的内容')
    return
  }

  const { copy, copied, isSupported } = useClipboard({ source: props.code })
  if (!isSupported) {
    message.error('复制功能不支持')
    return
  }
  
  await copy()
  if (unref(copied)) {
    message.success('复制成功')
  }
}

// 监听语言变化，注册新语言
watch(() => props.language, (newLang) => {
  if (newLang) {
    registerLanguage(newLang)
  }
}, { immediate: true })

// 初始化：注册常用语言
onMounted(() => {
  registerLanguage('xml')
  registerLanguage('json')
  registerLanguage('javascript')
  registerLanguage('typescript')
})
</script>

<style scoped lang="scss">
.code-viewer {
  width: 100%;
  
  &-header {
    min-height: 32px;
  }
  
  &-container {
    margin: 0;
    padding: 15px;
    background-color: #f6f8fa;
    border-radius: 4px;
    overflow-x: auto;
    
    :deep(.hljs) {
      background-color: #f6f8fa !important;
      padding: 0;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.6;
      color: #24292e;
    }
    
    // XML/HTML 样式
    :deep(.hljs-tag),
    :deep(.hljs-name) {
      color: #22863a;
    }
    
    :deep(.hljs-attribute) {
      color: #6f42c1;
    }
    
    :deep(.hljs-string) {
      color: #032f62;
    }
    
    :deep(.hljs-comment) {
      color: #6a737d;
      font-style: italic;
    }
    
    // JSON 样式
    :deep(.hljs-attr) {
      color: #005cc5;
    }
    
    // 数字
    :deep(.hljs-number) {
      color: #005cc5;
    }
    
    // 关键字
    :deep(.hljs-keyword) {
      color: #d73a49;
    }
    
    // 函数
    :deep(.hljs-function) {
      color: #6f42c1;
    }
  }
}
</style>

