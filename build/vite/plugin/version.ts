/**
 * 版本文件生成插件
 * 在构建时自动生成 version.json 文件
 */
import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

export function versionPlugin(): Plugin {
  let isBuildMode = false
  return {
    name: 'vite-plugin-version',
    configResolved(config) {
     // 通过config 判断是否为构建模式
     isBuildMode = config.command === 'build'
    },
    buildStart() {

      // 只有生产构建时生成版本文件，开发环境不生成
      // const isBuild = process.env.NODE_ENV === 'production' || process.argv.includes('build')
      if(!isBuildMode) {
        return
      }

      const root = process.cwd()
      const publicDir = path.resolve(root, 'public')
      const versionFile = path.resolve(publicDir, 'version.json')

      // 确保 public 目录存在
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true })
      }

      // 读取 package.json 获取版本号
      const packageJsonPath = path.resolve(root, 'package.json')
      let version = '1.0.0'
      if (fs.existsSync(packageJsonPath)) {
        try {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
          version = packageJson.version || version
        } catch (error) {
          console.warn('[VersionPlugin] 无法读取 package.json:', error)
        }
      }

      // 生成版本信息
      const versionInfo = {
        version,
        buildTime: new Date().toISOString(),
        timestamp: Date.now()
      }

      // 写入版本文件
      fs.writeFileSync(versionFile, JSON.stringify(versionInfo, null, 2), 'utf-8')

      console.log('✅ [VersionPlugin] 版本文件已生成:', versionFile)
      console.log('📦 [VersionPlugin] 版本信息:', JSON.stringify(versionInfo, null, 2))
    }
  }
}
