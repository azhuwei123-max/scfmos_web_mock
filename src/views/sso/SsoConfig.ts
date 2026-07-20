/**
 * SSO 单点登录配置文件
 * 配置需要跳转的外部系统信息
 */

export interface SsoSystem {
  id: string
  name: string
  description: string
  icon: string
  url: string
  type: 'token' | 'form' | 'iframe' // 跳转方式
  enabled: boolean
  order: number
  color?: string // 菜单颜色
}

/**
 * SSO 系统配置列表
 * 根据实际业务配置需要跳转的系统
 */
export const ssoSystems: SsoSystem[] = [
  {
    id: 'erp',
    name: 'ERP 系统',
    description: '企业资源计划系统',
    icon: 'ep:shopping-cart',
    url: 'http://erp.company.com',
    type: 'token',
    enabled: true,
    order: 1,
    color: '#1890ff'
  },
  {
    id: 'crm',
    name: 'CRM 系统',
    description: '客户关系管理系统',
    icon: 'ep:user',
    url: 'http://crm.company.com',
    type: 'token',
    enabled: true,
    order: 2,
    color: '#52c41a'
  },
  {
    id: 'oa',
    name: 'OA 办公系统',
    description: '办公自动化系统',
    icon: 'ep:document',
    url: 'http://oa.company.com',
    type: 'form',
    enabled: true,
    order: 3,
    color: '#fa8c16'
  },
  {
    id: 'hr',
    name: 'HR 系统',
    description: '人力资源管理系统',
    icon: 'ep:user-filled',
    url: 'http://hr.company.com',
    type: 'token',
    enabled: true,
    order: 4,
    color: '#eb2f96'
  },
  {
    id: 'finance',
    name: '财务系统',
    description: '财务管理系统',
    icon: 'ep:coin',
    url: 'http://finance.company.com',
    type: 'form',
    enabled: true,
    order: 5,
    color: '#f5222d'
  },
  {
    id: 'project',
    name: '项目管理',
    description: '项目管理系统',
    icon: 'ep:folder',
    url: 'http://project.company.com',
    type: 'iframe',
    enabled: true,
    order: 6,
    color: '#722ed1'
  }
]

/**
 * 获取启用的系统列表
 */
export const getEnabledSystems = (): SsoSystem[] => {
  return ssoSystems.filter((system) => system.enabled).sort((a, b) => a.order - b.order)
}

/**
 * 根据 ID 获取系统配置
 */
export const getSystemById = (id: string): SsoSystem | undefined => {
  return ssoSystems.find((system) => system.id === id)
}

/**
 * 生成 SSO 跳转 URL
 */
export const generateSsoUrl = (system: SsoSystem): string => {
  const baseUrl = '/sso/redirect'
  const params = new URLSearchParams({
    targetUrl: system.url,
    systemName: system.name,
    type: system.type
  })
  return `${baseUrl}?${params.toString()}`
}
