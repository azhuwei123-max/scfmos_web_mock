import type { App } from 'vue'
// 👇使用 form-create 需额外全局引入 element plus 组件
import {
  ElAside,
  ElPopconfirm,
  ElHeader,
  ElMain,
  ElContainer,
  ElDivider,
  ElTransfer,
  ElAlert,
  ElTabs,
  ElTable,
  ElTableColumn,
  ElTabPane
} from 'element-plus'

import formCreate from '@form-create/element-ui'
import install from '@form-create/element-ui/auto-import'

const components = [
  ElAside,
  ElPopconfirm,
  ElHeader,
  ElMain,
  ElContainer,
  ElDivider,
  ElTransfer,
  ElAlert,
  ElTabs,
  ElTable,
  ElTableColumn,
  ElTabPane
]

// 参考 http://www.form-create.com/v3/element-ui/auto-import.html 文档
export const setupFormCreate = (app: App<Element>) => {
  components.forEach((component) => {
    app.component(component.name, component)
  })
  formCreate.use(install)
  app.use(formCreate)
}
