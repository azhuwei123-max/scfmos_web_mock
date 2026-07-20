<template>
  <div class="sso-menu-container">
    <el-card shadow="never" class="menu-card">
      <template #header>
        <div class="card-header">
          <span class="title">
            <el-icon><Link /></el-icon>
            系统跳转
          </span>
          <el-tag type="info" size="small">单点登录</el-tag>
        </div>
      </template>

      <div class="menu-content">
        <el-empty v-if="enabledSystems.length === 0" description="暂无可用系统" />

        <el-row :gutter="16" v-else>
          <el-col
            v-for="system in enabledSystems"
            :key="system.id"
            :xs="12"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <div class="system-card" @click="handleSystemClick(system)">
              <div class="system-icon" :style="{ background: system.color }">
                <el-icon :size="32">
                  <component :is="getIconComponent(system.icon)" />
                </el-icon>
              </div>
              <div class="system-info">
                <div class="system-name">{{ system.name }}</div>
                <div class="system-desc">{{ system.description }}</div>
              </div>
              <div class="system-badge">
                <el-tag :type="getTypeTag(system.type)" size="small">
                  {{ getTypeText(system.type) }}
                </el-tag>
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- 使用说明 -->
        <el-alert class="mt-4" title="使用说明" type="info" :closable="false" show-icon>
          <template #default>
            <p>点击系统卡片将自动跳转到对应系统，无需重复登录</p>
            <p class="mt-2">
              <el-icon><InfoFilled /></el-icon>
              <span class="ml-1">跳转方式：</span>
              <el-tag size="small" class="ml-1">Token</el-tag> URL参数传递
              <el-tag size="small" type="warning" class="ml-1">Form</el-tag> 表单POST提交
              <el-tag size="small" type="" class="ml-1">IFrame</el-tag> 新窗口打开
            </p>
          </template>
        </el-alert>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Link,
  InfoFilled,
  ShoppingCart,
  User,
  Document,
  UserFilled,
  Coin,
  Folder
} from '@element-plus/icons-vue'
import { getEnabledSystems, generateSsoUrl, type SsoSystem } from './SsoConfig'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'SsoMenu' })

const router = useRouter()

// 获取启用的系统列表
const enabledSystems = computed(() => getEnabledSystems())

// 图标组件映射
const iconMap: Record<string, any> = {
  'ep:shopping-cart': ShoppingCart,
  'ep:user': User,
  'ep:document': Document,
  'ep:user-filled': UserFilled,
  'ep:coin': Coin,
  'ep:folder': Folder
}

// 获取图标组件
const getIconComponent = (icon: string) => {
  return iconMap[icon] || Document
}

// 获取类型标签
const getTypeTag = (type: string) => {
  const typeMap: Record<string, string> = {
    token: '',
    form: 'warning',
    iframe: 'success'
  }
  return typeMap[type] || ''
}

// 获取类型文本
const getTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    token: 'Token',
    form: 'Form',
    iframe: 'IFrame'
  }
  return typeMap[type] || 'Token'
}

// 点击系统卡片
const handleSystemClick = (system: SsoSystem) => {
  ElMessage.info(`正在跳转到 ${system.name}...`)

  // 生成跳转 URL
  const ssoUrl = generateSsoUrl(system)

  // 跳转到 SSO 中间页
  router.push(ssoUrl)
}
</script>

<style lang="scss" scoped>
.sso-menu-container {
  padding: 20px;
  background: #f0f2f5;
  min-height: calc(100vh - 50px);

  .menu-card {
    border-radius: 8px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 600;
        color: #262626;
      }
    }

    .menu-content {
      .system-card {
        position: relative;
        padding: 24px 16px;
        border-radius: 12px;
        background: #fafafa;
        cursor: pointer;
        transition: all 0.3s;
        margin-bottom: 16px;
        overflow: hidden;

        &:hover {
          background: #fff;
          transform: translateY(-4px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

          .system-icon {
            transform: scale(1.1);
          }
        }

        .system-icon {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          margin: 0 auto 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: transform 0.3s;
        }

        .system-info {
          text-align: center;
          margin-bottom: 12px;

          .system-name {
            font-size: 16px;
            font-weight: 600;
            color: #262626;
            margin-bottom: 4px;
          }

          .system-desc {
            font-size: 12px;
            color: #8c8c8c;
            line-height: 1.5;
          }
        }

        .system-badge {
          text-align: center;
        }
      }
    }
  }
}

// 响应式
@media (max-width: 768px) {
  .sso-menu-container {
    padding: 10px;

    .menu-card {
      .menu-content {
        .system-card {
          padding: 20px 12px;

          .system-icon {
            width: 56px;
            height: 56px;

            .el-icon {
              font-size: 28px;
            }
          }

          .system-info {
            .system-name {
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
