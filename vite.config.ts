import { resolve } from 'path'
import { loadEnv } from 'vite'
import type { UserConfig, ConfigEnv } from 'vite'
import { createVitePlugins } from './build/vite'
import { include, exclude } from "./build/vite/optimize"
// 当前执行node命令时文件夹的地址(工作目录)
import {createSvgIconsPlugin } from "vite-plugin-svg-icons";

const root = process.cwd()

// 路径查找
function pathResolve(dir: string) {
  return resolve(root, '.', dir)
}

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  let env = {} as any
  const isBuild = command === 'build'
  if (!isBuild) {
    env = loadEnv((process.argv[3] === '--mode' ? process.argv[4] : process.argv[3]), root)
  } else {
    env = loadEnv(mode, root)
  }

  const plugins = [createSvgIconsPlugin(
    {
      iconDirs:[resolve(process.cwd(),'src/assets/svgs/system')],
      symbolId:'icon-[dir]-[name]',
    }),
    createVitePlugins(),
  ]

  // 浏览器中，alt+shift+左键 直接定位源码，会降低本地性能
  if (mode === 'dev') {
    const { CodeInspectorPlugin } = require('code-inspector-plugin')

    plugins.push(
      CodeInspectorPlugin({
        bundler: 'vite'
      })
    )
  }
  return {

    base: env.VITE_BASE_PATH,
    root: root,
    // 服务端渲染 000000als
    server: {
      port: env.VITE_PORT, // 端口号
      host: "0.0.0.0",
      open: env.VITE_OPEN === 'true',
      // 本地跨域代理. 目前注释的原因：暂时没有用途，server 端已经支持跨域
      proxy: {
        ['/admin-api']: {
          target: env.VITE_BASE_URL,
          ws: false,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^/admin-api`), ''),
        },
      },
    },
    // 项目使用的vite插件。 单独提取到build/vite/plugin中管理
    plugins: plugins,
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "./src/styles/variables.scss" as *;',
          javascriptEnabled: true
        }
      }
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss', '.css'],
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js'
        },
        {

          find: /\@\//,
          replacement: `${pathResolve('src')}/`
        }
      ]
    },
    build: {
      minify: 'esbuild', // esbuild压缩速度比terser快几十倍
      
      outDir: env.VITE_OUT_DIR || 'dist',
      sourcemap: env.VITE_SOURCEMAP === 'true' ? 'inline' : false,
      // brotliSize: false,
      terserOptions: {
        compress: {
          drop_debugger: env.VITE_DROP_DEBUGGER === 'true',
          drop_console: env.VITE_DROP_CONSOLE === 'true'
        }
      },
      rollupOptions:{
        output:{
          manualChunks:undefined
        },
        // output:{
        //   manualChunks:{
        //     // 核心框架
        //     "vue-vendor":['vue','vue-router','pinia'],
        //      // UI框架
        //      'element-plus':['element-plus','@element-plus/icons-vue'],
        //      // 图表库
        //      echatrs:['echarts','echarts-wordcloud'],
        //      // 其他大型依赖
        //      "bpmn":['bpmn-js','bpmn-js-properties-panel','bpmn-js-token-simulation'],
        //      'video':['video.js','@videojs-player/vue'],
        //      'cropper':['cropperjs']
        //   }
        // }
      },
      // 使用最新浏览器语法，不转ES5
      target:"esnext",
      // chunk 警告不要管，节省检查时间
      chunkSizeWarningLimit:2000,
    },
    optimizeDeps: { include, exclude }
  }
}
