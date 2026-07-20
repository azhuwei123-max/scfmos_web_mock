/**
 * 生成版本文件脚本
 * 在构建时生成 version.json 文件到 public 目录
 */
const fs = require('fs')
const path = require('path')

const root = process.cwd()
const publicDir = path.resolve(root, 'public')
const versionFile = path.resolve(publicDir, 'version.json')

// 确保 public 目录存在
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

// 生成版本信息
const versionInfo = {
  version: process.env.npm_package_version || '1.0.0',
  buildTime: new Date().toISOString(),
  timestamp: Date.now()
}

// 写入版本文件
fs.writeFileSync(versionFile, JSON.stringify(versionInfo, null, 2), 'utf-8')

console.log('✅ 版本文件已生成:', versionFile)
console.log('📦 版本信息:', JSON.stringify(versionInfo, null, 2))
