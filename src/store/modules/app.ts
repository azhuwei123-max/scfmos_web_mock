import { defineStore } from 'pinia'
import { store } from '../index'
import { updateCssVariables, humpToUnderline, setCssVar } from '@/utils'
import { ElMessage } from 'element-plus'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { ElementPlusSize } from '@/types/elementPlus'
import { LayoutType } from '@/types/layout'
import { ThemeTypes } from '@/types/theme'

const { wsCache } = useCache()

const lightTheme: ThemeTypes = {
  elColorPrimary: '#409eff',
  leftMenuBorderColor: 'rgba(0, 0, 0, 0.06)',
  leftMenuBgColor: '#ffffff',
  leftMenuBgLightColor: '#f5f7fa',
  leftMenuBgActiveColor: 'rgba(64, 158, 255, 0.14)',
  leftMenuCollapseBgActiveColor: 'rgba(64, 158, 255, 0.2)',
  leftMenuTextColor: 'rgba(31, 41, 55, 0.78)',
  leftMenuTextActiveColor: '#1d4ed8',
  logoTitleTextColor: '#1f2937',
  logoBorderColor: 'rgba(0, 0, 0, 0.05)',
  topHeaderBgColor: '#fff',
  topHeaderTextColor: 'inherit',
  topHeaderHoverColor: '#f6f6f6',
  topToolBorderColor: '#eee'
}

const darkTheme: ThemeTypes = {
  elColorPrimary: '#3b82f6',
  leftMenuBorderColor: 'inherit',
  leftMenuBgColor: '#141414',
  leftMenuBgLightColor: '#1f2937',
  leftMenuBgActiveColor: 'rgba(59, 130, 246, 0.35)',
  leftMenuCollapseBgActiveColor: 'rgba(59, 130, 246, 0.35)',
  leftMenuTextColor: 'rgba(255, 255, 255, 0.82)',
  leftMenuTextActiveColor: '#fff',
  logoTitleTextColor: '#fff',
  logoBorderColor: 'inherit',
  topHeaderBgColor: '#111827',
  topHeaderTextColor: 'rgba(255, 255, 255, 0.85)',
  topHeaderHoverColor: '#1f2937',
  topToolBorderColor: '#1f2937'
}

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null
}

const getLightColor = (color: string, level: number) => {
  const rgb = hexToRgb(color)
  if (!rgb) return color
  const { r, g, b } = rgb
  const mixR = Math.round(r + (255 - r) * level)
  const mixG = Math.round(g + (255 - g) * level)
  const mixB = Math.round(b + (255 - b) * level)
  return `rgb(${mixR}, ${mixG}, ${mixB})`
}

const getDarkColor = (color: string, level: number) => {
  const rgb = hexToRgb(color)
  if (!rgb) return color
  const { r, g, b } = rgb
  const mixR = Math.round(r * (1 - level))
  const mixG = Math.round(g * (1 - level))
  const mixB = Math.round(b * (1 - level))
  return `rgb(${mixR}, ${mixG}, ${mixB})`
}

const getAlphaColor = (color: string, alpha: number) => {
  const rgb = hexToRgb(color)
  if (!rgb) return color
  const { r, g, b } = rgb
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

interface AppState {
  breadcrumb: boolean
  breadcrumbIcon: boolean
  collapse: boolean
  uniqueOpened: boolean
  hamburger: boolean
  screenfull: boolean
  search: boolean
  size: boolean
  locale: boolean
  message: boolean
  tagsView: boolean
  tagsViewIcon: boolean
  logo: boolean
  fixedHeader: boolean
  greyMode: boolean
  pageLoading: boolean
  layout: LayoutType
  title: string
  userInfo: string
  isDark: boolean
  currentSize: ElementPlusSize
  sizeMap: ElementPlusSize[]
  mobile: boolean
  footer: boolean
  theme: ThemeTypes
  fixedMenu: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => {
    return {
      userInfo: 'userInfo', // 登录信息存储字段-建议每个项目换一个字段，避免与其他项目冲突
      sizeMap: ['default', 'large', 'small'],
      mobile: false, // 是否是移动端
      title: import.meta.env.VITE_APP_TITLE, // 标题
      pageLoading: false, // 路由跳转loading

      breadcrumb: true, // 面包屑
      breadcrumbIcon: true, // 面包屑图标
      collapse: false, // 折叠菜单
      uniqueOpened: true, // 是否只保持一个子菜单的展开
      hamburger: true, // 折叠图标
      screenfull: true, // 全屏图标
      search: true, // 搜索图标
      size: true, // 尺寸图标
      locale: true, // 多语言图标
      message: true, // 消息图标
      tagsView: true, // 标签页
      tagsViewIcon: true, // 是否显示标签图标
      logo: true, // logo
      fixedHeader: true, // 固定toolheader
      footer: true, // 显示页脚
      greyMode: false, // 是否开始灰色模式，用于特殊悼念日
      fixedMenu: wsCache.get('fixedMenu') || false, // 是否固定菜单

      layout: wsCache.get(CACHE_KEY.LAYOUT) || 'top', // layout布局
      isDark: wsCache.get(CACHE_KEY.IS_DARK) || false, // 是否是暗黑模式
      currentSize: wsCache.get('default') || 'default', // 组件尺寸
      theme: wsCache.get(CACHE_KEY.THEME) || { ...lightTheme }
    }
  },
  getters: {
    getBreadcrumb(): boolean {
      return this.breadcrumb
    },
    getBreadcrumbIcon(): boolean {
      return this.breadcrumbIcon
    },
    getCollapse(): boolean {
      return this.collapse
    },
    getUniqueOpened(): boolean {
      return this.uniqueOpened
    },
    getHamburger(): boolean {
      return this.hamburger
    },
    getScreenfull(): boolean {
      return this.screenfull
    },
    getSize(): boolean {
      return this.size
    },
    getLocale(): boolean {
      return this.locale
    },
    getMessage(): boolean {
      return this.message
    },
    getTagsView(): boolean {
      return this.tagsView
    },
    getTagsViewIcon(): boolean {
      return this.tagsViewIcon
    },
    getLogo(): boolean {
      return this.logo
    },
    getFixedHeader(): boolean {
      return this.fixedHeader
    },
    getGreyMode(): boolean {
      return this.greyMode
    },
    getFixedMenu(): boolean {
      return this.fixedMenu
    },
    getPageLoading(): boolean {
      return this.pageLoading
    },
    getLayout(): LayoutType {
      return this.layout
    },
    getTitle(): string {
      return this.title
    },
    getUserInfo(): string {
      return this.userInfo
    },
    getIsDark(): boolean {
      return this.isDark
    },
    getCurrentSize(): ElementPlusSize {
      return this.currentSize
    },
    getSizeMap(): ElementPlusSize[] {
      return this.sizeMap
    },
    getMobile(): boolean {
      return this.mobile
    },
    getTheme(): ThemeTypes {
      return this.theme
    },
    getFooter(): boolean {
      return this.footer
    }
  },
  actions: {
    setBreadcrumb(breadcrumb: boolean) {
      this.breadcrumb = breadcrumb
    },
    setBreadcrumbIcon(breadcrumbIcon: boolean) {
      this.breadcrumbIcon = breadcrumbIcon
    },
    setCollapse(collapse: boolean) {
      this.collapse = collapse
    },
    setUniqueOpened(uniqueOpened: boolean) {
      this.uniqueOpened = uniqueOpened
    },
    setHamburger(hamburger: boolean) {
      this.hamburger = hamburger
    },
    setScreenfull(screenfull: boolean) {
      this.screenfull = screenfull
    },
    setSize(size: boolean) {
      this.size = size
    },
    setLocale(locale: boolean) {
      this.locale = locale
    },
    setMessage(message: boolean) {
      this.message = message
    },
    setTagsView(tagsView: boolean) {
      this.tagsView = tagsView
    },
    setTagsViewIcon(tagsViewIcon: boolean) {
      this.tagsViewIcon = tagsViewIcon
    },
    setLogo(logo: boolean) {
      this.logo = logo
    },
    setFixedHeader(fixedHeader: boolean) {
      this.fixedHeader = fixedHeader
    },
    setGreyMode(greyMode: boolean) {
      this.greyMode = greyMode
    },
    setFixedMenu(fixedMenu: boolean) {
      wsCache.set('fixedMenu', fixedMenu)
      this.fixedMenu = fixedMenu
    },
    setPageLoading(pageLoading: boolean) {
      this.pageLoading = pageLoading
    },
    setLayout(layout: LayoutType) {
      if (this.mobile && layout !== 'classic') {
        ElMessage.warning('移动端模式下不支持切换其他布局')
        return
      }
      this.layout = layout
      wsCache.set(CACHE_KEY.LAYOUT, this.layout)
    },
    setTitle(title: string) {
      this.title = title
    },
    setIsDark(isDark: boolean) {
      const defaultPrimary = isDark ? darkTheme.elColorPrimary : lightTheme.elColorPrimary
      const currentPrimary = this.theme.elColorPrimary || defaultPrimary || '#409eff'
      this.isDark = isDark
      if (this.isDark) {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
        this.setTheme({ ...darkTheme })
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
        this.setTheme({ ...lightTheme })
      }
      this.setCssVarTheme()
      this.applyPrimaryColor(currentPrimary)
      wsCache.set(CACHE_KEY.IS_DARK, this.isDark)
    },
    setCurrentSize(currentSize: ElementPlusSize) {
      this.currentSize = currentSize
      wsCache.set('currentSize', this.currentSize)
    },
    setMobile(mobile: boolean) {
      this.mobile = mobile
    },
    setTheme(theme: ThemeTypes) {
      this.theme = Object.assign(this.theme, theme)
      wsCache.set(CACHE_KEY.THEME, this.theme)
    },
    applyPrimaryColor(color: string) {
      if (!color) return
      const isDark = this.isDark
      const menuActiveBg = getAlphaColor(color, isDark ? 0.35 : 0.16)
      const menuCollapseActiveBg = getAlphaColor(color, isDark ? 0.35 : 0.22)
      const menuTextActive = isDark ? getLightColor(color, 0.35) : color

      this.setTheme({
        elColorPrimary: color,
        leftMenuBgActiveColor: menuActiveBg,
        leftMenuCollapseBgActiveColor: menuCollapseActiveBg,
        leftMenuTextActiveColor: menuTextActive
      })

      setCssVar('--el-color-primary', color)
      for (let i = 1; i <= 9; i++) {
        setCssVar(`--el-color-primary-light-${i}`, getLightColor(color, i / 10))
      }
      setCssVar('--el-color-primary-dark-2', getDarkColor(color, 0.2))

      this.setCssVarTheme()
    },
    setCssVarTheme() {
      const applyTheme = () => {
        const variables: Record<string, string> = {}
        for (const key in this.theme) {
          const value = this.theme[key]
          if (value !== undefined && value !== null) {
            variables[`--${humpToUnderline(key)}`] = value as string
          }
        }
        updateCssVariables(variables)
      }
      if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
        requestAnimationFrame(applyTheme)
      } else {
        applyTheme()
      }
    },
    setFooter(footer: boolean) {
      this.footer = footer
    }
  },
  persist: false
})

export const useAppStoreWithOut = () => {
  return useAppStore(store)
}
