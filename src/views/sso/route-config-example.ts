/**
 * SSO 单点登录路由配置示例
 *
 * 使用方法：
 * 将以下路由配置添加到 src/router/modules/remaining.ts 文件中
 */

import { Layout } from '@/utils/routerHelper'

/**
 * 方法 1：作为独立的一级菜单（推荐）
 */
export const ssoRouteExample1 = {
  path: '/sso',
  component: Layout,
  name: 'Sso',
  meta: {
    title: '系统跳转',
    icon: 'ep:link',
    alwaysShow: false
  },
  children: [
    {
      path: 'menu',
      component: () => import('@/views/sso/SsoMenu.vue'),
      name: 'SsoMenu',
      meta: {
        title: '系统跳转',
        icon: 'ep:link',
        noCache: true
      }
    },
    {
      path: 'redirect',
      component: () => import('@/views/sso/SsoRedirect.vue'),
      name: 'SsoRedirect',
      meta: {
        title: '跳转中',
        hidden: true,
        noCache: true,
        noTagsView: true
      }
    }
  ]
}

/**
 * 方法 2：添加到现有菜单下
 * 例如：添加到"系统管理"菜单下
 */
export const ssoRouteExample2 = {
  // 在系统管理的 children 中添加
  children: [
    // ... 其他子菜单
    {
      path: 'sso-menu',
      component: () => import('@/views/sso/SsoMenu.vue'),
      name: 'SsoMenu',
      meta: {
        title: '系统跳转',
        icon: 'ep:link',
        noCache: true
      }
    }
  ]
}

/**
 * 方法 3：直接在 remaining.ts 中添加
 *
 * 找到 remainingRouter 数组，添加以下配置：
 */
export const ssoRouteFull = {
  path: '/sso',
  component: Layout,
  name: 'Sso',
  meta: {
    title: '系统跳转',
    icon: 'ep:link',
    alwaysShow: false
  },
  children: [
    {
      path: 'menu',
      component: () => import('@/views/sso/SsoMenu.vue'),
      name: 'SsoMenu',
      meta: {
        title: '系统跳转',
        icon: 'ep:link',
        noCache: true
      }
    },
    {
      path: 'redirect',
      component: () => import('@/views/sso/SsoRedirect.vue'),
      name: 'SsoRedirect',
      meta: {
        title: '跳转中',
        hidden: true,
        noCache: true,
        noTagsView: true
      }
    }
  ]
}

/**
 * 具体添加位置示例：
 *
 * 在 src/router/modules/remaining.ts 文件中：
 *
 * const remainingRouter: AppRouteRecordRaw[] = [
 *   // ... 其他路由
 *
 *   // 添加 SSO 路由
 *   {
 *     path: '/sso',
 *     component: Layout,
 *     name: 'Sso',
 *     meta: {
 *       title: '系统跳转',
 *       icon: 'ep:link',
 *       alwaysShow: false
 *     },
 *     children: [
 *       {
 *         path: 'menu',
 *         component: () => import('@/views/sso/SsoMenu.vue'),
 *         name: 'SsoMenu',
 *         meta: {
 *           title: '系统跳转',
 *           icon: 'ep:link',
 *           noCache: true
 *         }
 *       },
 *       {
 *         path: 'redirect',
 *         component: () => import('@/views/sso/SsoRedirect.vue'),
 *         name: 'SsoRedirect',
 *         meta: {
 *           title: '跳转中',
 *           hidden: true,
 *           noCache: true,
 *           noTagsView: true
 *         }
 *       }
 *     ]
 *   }
 * ]
 */

/**
 * 在 BPM 首页中添加快速入口：
 *
 * 修改 src/views/Home/BpmHome.vue 的 quickActions：
 *
 * const quickActions = ref([
 *   // ... 其他入口
 *   {
 *     name: '系统跳转',
 *     icon: Link,
 *     path: '/sso/menu',
 *     color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
 *   }
 * ])
 */
