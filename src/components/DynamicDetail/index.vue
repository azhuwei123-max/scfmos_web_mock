<template>
  <ContentWrap v-loading="loading" class="dynamic-detail-container">
    <!-- 操作按钮 -->
    <div v-if="showActions" class="flex justify-end gap-10px mb-20px">
      <el-button v-if="showBack" @click="handleBack">
        <Icon icon="ep:arrow-left" class="mr-5px" />
        返回
      </el-button>
      <el-button v-if="showSave" tpye="" :loading="saving" @click="handleSave">
        <Icon icon="ep:check" class="mr-5px" />
        保存
      </el-button>
    </div>

    <!-- 左侧菜单 + 右侧内容布局 -->
    <div v-if="templates.length > 0" class="dynamic-detail-layout">
      <!-- 左侧菜单 -->
      <div class="dynamic-detail-menu">
        <el-menu
          :default-active="activeTemplateKey"
          class="dynamic-detail-menu-list"
          @select="handleMenuSelect"
        >
          <template v-for="template in templates" :key="template.key">
            <!-- 有子菜单的情况 -->
            <el-sub-menu
              v-if="template.children && template.children.length > 0"
              :index="template.key"
            >
              <template #title>
                <span>{{ template.title }}</span>
              </template>
              <el-menu-item v-for="child in template.children" :key="child.key" :index="child.key">
                <span>{{ child.title }}</span>
              </el-menu-item>
            </el-sub-menu>
            <!-- 没有子菜单的情况 -->
            <el-menu-item v-else :index="template.key">
              <span>{{ template.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>

      <!-- 右侧内容 -->
      <div class="dynamic-detail-content">
        <el-scrollbar class="dynamic-detail-scrollbar">
          <div class="dynamic-detail-content-inner">
            <template v-if="currentTemplate">
              <!-- 分组渲染 -->
              <template v-if="groupedSchema.length > 0">
                <template v-for="(group, groupIndex) in groupedSchema" :key="groupIndex">
                  <div class="mb-30px">
                    <div v-if="group.title" class="text-18px font-bold mb-15px text-gray-700">
                      {{ group.title }}
                    </div>
                    <el-form
                      ref="formRef"
                      :model="formData"
                      :rules="formRules"
                      label-width="160px"
                      class="detail-form"
                    >
                      <el-row :gutter="20">
                        <el-col
                          v-for="item in group.fields"
                          :key="item.field"
                          :span="item.span || 12"
                        >
                          <el-form-item
                            :label="item.label"
                            :prop="item.field"
                            :required="item.required && editable"
                          >
                            <component
                              :is="getFieldComponent(item)"
                              v-bind="getFieldProps(item)"
                              v-model="formData[item.field]"
                            />
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                  </div>
                  <el-divider v-if="groupIndex < groupedSchema.length - 1" />
                </template>
              </template>

              <!-- 无分组渲染 -->
              <template v-else>
                <el-form
                  ref="formRef"
                  :model="formData"
                  :rules="formRules"
                  label-width="160px"
                  class="detail-form"
                >
                  <el-row :gutter="20">
                    <el-col
                      v-for="item in currentTemplate.schema"
                      :key="item.field"
                      :span="item.span || 12"
                    >
                      <el-form-item
                        :label="item.label"
                        :prop="item.field"
                        :required="item.required && editable"
                      >
                        <component
                          :is="getFieldComponent(item)"
                          v-bind="getFieldProps(item)"
                          v-model="formData[item.field]"
                          :disabled="!editable || readonly || item.disabled || item.readonly"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </template>
            </template>
          </div>
        </el-scrollbar>
      </div>
    </div>

    <!-- 兼容旧版本：无菜单模式（直接使用 schema 和 data） -->
    <template v-else>
      <el-scrollbar class="dynamic-detail-scrollbar">
        <div class="dynamic-detail-content-inner">
          <!-- 分组渲染 -->
          <template v-if="groupedSchema.length > 0">
            <template v-for="(group, groupIndex) in groupedSchema" :key="groupIndex">
              <div class="mb-30px">
                <div v-if="group.title" class="text-18px font-bold mb-15px text-gray-700">
                  {{ group.title }}
                </div>
                <el-form
                  ref="formRef"
                  :model="formData"
                  :rules="formRules"
                  label-width="160px"
                  class="detail-form"
                >
                  <el-row :gutter="20">
                    <el-col v-for="item in group.fields" :key="item.field" :span="item.span || 12">
                      <el-form-item
                        :label="item.label"
                        :prop="item.field"
                        :required="item.required && editable"
                      >
                        <component
                          :is="getFieldComponent(item)"
                          v-bind="getFieldProps(item)"
                          v-model="formData[item.field]"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
              <el-divider v-if="groupIndex < groupedSchema.length - 1" />
            </template>
          </template>

          <!-- 无分组渲染 -->
          <template v-else>
            <el-form
              ref="formRef"
              :model="formData"
              :rules="formRules"
              label-width="160px"
              class="detail-form"
            >
              <el-row :gutter="20">
                <el-col v-for="item in schema" :key="item.field" :span="item.span || 12">
                  <el-form-item
                    :label="item.label"
                    :prop="item.field"
                    :required="item.required && editable"
                  >
                    <component
                      :is="getFieldComponent(item)"
                      v-bind="getFieldProps(item)"
                      v-model="formData[item.field]"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </template>
        </div>
      </el-scrollbar>
    </template>
  </ContentWrap>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch, onMounted, PropType } from 'vue'
import { useRouter } from 'vue-router'
import { propTypes } from '@/utils/propTypes'
import dayjs from 'dayjs'
import { formatValue } from '@/utils/formatter'
import * as FieldComponents from './fields'

defineOptions({ name: 'DynamicDetail' })

interface FieldSchema {
  /** 字段名 */
  field: string
  /** 标签 */
  label: string
  /** 字段类型：text, number, date, datetime, select, textarea, tag, dict, boolean, custom */
  type?: string
  /** 字段值 */
  value?: any
  /** 是否必填 */
  required?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 占位列数（1-24） */
  span?: number
  /** 分组名称 */
  group?: string
  /** 字典类型（当 type 为 dict 时使用） */
  dictType?: string
  /** 字典值类型（type 为 dict 时使用，str/int/bool） */
  valueType?: 'str' | 'int' | 'bool'
  /** 选项列表（当 type 为 select 时使用） */
  options?: Array<{ label: string; value: any; disabled?: boolean }>
  /** 是否多选（type 为 select 或 dict 时使用） */
  multiple?: boolean
  /** 是否可搜索（type 为 select 或 dict 时使用） */
  filterable?: boolean
  /** 最大长度（type 为 text 或 textarea 时使用） */
  maxlength?: number
  /** 是否显示字数统计（type 为 text 或 textarea 时使用） */
  showWordLimit?: boolean
  /** 行数（type 为 textarea 时使用） */
  rows?: number
  /** 自适应高度（type 为 textarea 时使用） */
  autosize?: boolean | { minRows?: number; maxRows?: number }
  /** 最小值（type 为 number 时使用） */
  min?: number
  /** 最大值（type 为 number 时使用） */
  max?: number
  /** 步长（type 为 number 时使用） */
  step?: number
  /** 精度（type 为 number 时使用） */
  precision?: number
  /** 控制按钮位置（type 为 number 时使用） */
  controlsPosition?: 'right' | ''
  /** 激活时的文本（type 为 boolean 时使用） */
  activeText?: string
  /** 非激活时的文本（type 为 boolean 时使用） */
  inactiveText?: string
  /** 激活时的值（type 为 boolean 时使用） */
  activeValue?: boolean | string | number
  /** 非激活时的值（type 为 boolean 时使用） */
  inactiveValue?: boolean | string | number
  /** 格式化函数（自定义格式化，优先级高于 formatterType） */
  formatter?: (value: any) => string
  /** 格式化类型（后端配置，如：currency, percentage, number, date, datetime 等） */
  formatterType?: string
  /** 格式化配置（配合 formatterType 使用） */
  formatterConfig?: {
    currencySymbol?: string
    decimals?: number
    dateFormat?: string
    datetimeFormat?: string
  }
  /** 自定义组件名称 */
  component?: string
  /** 自定义组件属性 */
  componentProps?: Record<string, any>
  /** 验证规则 */
  rules?: any[]
  /** 占位符 */
  placeholder?: string
  /** 日期格式 */
  dateFormat?: string
  /** 是否显示 */
  show?: boolean
  /** API 选择器配置（type 为 api-select 时使用） */
  apiConfig?: {
    /** API 地址 */
    url: string
    /** 请求方法 */
    method?: 'GET' | 'POST'
    /** 选择器类型：table（表格）、tree（树形） */
    selectorType?: 'table' | 'tree'
    /** 是否多选 */
    multiple?: boolean
    /** 弹框标题 */
    dialogTitle?: string
    /** 弹框宽度 */
    dialogWidth?: string
    /** 表格列配置（selectorType 为 table 时使用） */
    tableColumns?: Array<{ prop: string; label: string; minWidth?: number }>
    /** 搜索字段配置 */
    searchFields?: Array<{
      name: string
      label: string
      type: 'text' | 'select'
      placeholder?: string
      options?: Array<{ label: string; value: any }>
    }>
    /** 是否分页（默认 true） */
    pagination?: boolean
    /** 树形选择器配置（selectorType 为 tree 时使用） */
    treeProps?: {
      children?: string
      label?: string
      value?: string
    }
    /** 树形选择器是否严格模式（父子不关联） */
    checkStrictly?: boolean
    /** 响应数据解析配置 */
    responseParser?: {
      /** 列表数据路径，如 'data.list' 或 'list' */
      listPath?: string
      /** 总数路径，如 'data.total' 或 'total' */
      totalPath?: string
      /** 自定义解析函数 */
      parseFunc?: (response: any) => { list: any[]; total?: number }
    }
    /** 显示字段（用于显示选中的值） */
    displayField?: string
    /** 值字段（用于提交的值） */
    valueField?: string
    /** 请求参数映射（将 formData 中的字段映射到请求参数） */
    paramMapping?: Record<string, string>
  }
  /** 远程搜索配置（type 为 remote-select 时使用） */
  remoteConfig?: {
    /** API 地址 */
    url: string
    /** 请求方法 */
    method?: 'GET' | 'POST'
    /** 搜索参数字段名 */
    searchField?: string
    /** 响应数据解析配置 */
    responseParser?: {
      /** 列表数据路径 */
      listPath?: string
      /** 自定义解析函数 */
      parseFunc?: (response: any) => Array<{ label: string; value: any }>
    }
    /** 显示字段 */
    labelField?: string
    /** 值字段 */
    valueField?: string
  }
}

interface GroupedSchema {
  title?: string
  fields: FieldSchema[]
  columns?: number
}

interface TemplateConfig {
  /** 模板唯一标识 */
  key: string
  /** 模板标题（显示在左侧菜单） */
  title: string
  /** 该模板的 schema 配置（当没有 children 时使用） */
  schema?: FieldSchema[]
  /** 该模板的数据对象（当没有 children 时使用） */
  data?: Record<string, any>
  /** 子模板配置（二级菜单） */
  children?: TemplateConfig[]
}

const props = defineProps({
  /** 模板配置数组（新版本：支持多模板左侧菜单） */
  templates: {
    type: Array as PropType<TemplateConfig[]>,
    default: () => []
  },
  /** Schema 配置（兼容旧版本：单模板模式） */
  schema: {
    type: Array as PropType<FieldSchema[]>,
    default: () => []
  },
  /** 数据对象（兼容旧版本：单模板模式） */
  data: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({})
  },
  /** 是否可编辑（true: 可编辑, false: 只读） */
  editable: propTypes.bool.def(true),
  /** 是否只读（优先级高于 editable，如果为 true，即使 editable 为 true 也是只读） */
  readonly: propTypes.bool.def(false),
  /** 是否显示加载状态 */
  loading: propTypes.bool.def(false),
  /** 是否显示操作按钮 */
  showActions: propTypes.bool.def(true),
  /** 是否显示返回按钮 */
  showBack: propTypes.bool.def(true),
  /** 是否显示保存按钮 */
  showSave: propTypes.bool.def(true)
})

const emit = defineEmits<{
  save: [data: Record<string, any>]
  back: []
}>()

const router = useRouter()
const message = useMessage()

const formRef = ref()
const saving = ref(false)
const formData = reactive<Record<string, any>>({})
const formRules = reactive<Record<string, any>>({})

// 当前激活的模板 key
const activeTemplateKey = ref<string>('')

// 扁平化所有模板（包括子模板）用于查找
const flattenTemplates = computed(() => {
  const result: TemplateConfig[] = []
  const traverse = (templates: TemplateConfig[]) => {
    templates.forEach((template) => {
      if (template.children && template.children.length > 0) {
        // 如果有子菜单，只添加子菜单
        result.push(...template.children)
      } else {
        // 如果没有子菜单，添加自己
        result.push(template)
      }
    })
  }
  traverse(props.templates)
  return result
})

// 当前激活的模板
const currentTemplate = computed(() => {
  if (props.templates.length === 0) {
    return null
  }
  // 从扁平化的模板中查找
  return (
    flattenTemplates.value.find((t) => t.key === activeTemplateKey.value) ||
    flattenTemplates.value[0]
  )
})

// 当前使用的 schema（模板模式或单模式）
const currentSchema = computed(() => {
  if (props.templates.length > 0 && currentTemplate.value) {
    return currentTemplate.value.schema || []
  }
  return props.schema
})

// 当前使用的 data（模板模式或单模式）
const currentData = computed(() => {
  if (props.templates.length > 0 && currentTemplate.value) {
    return currentTemplate.value.data || {}
  }
  return props.data
})

// 分组后的 schema
const groupedSchema = computed<GroupedSchema[]>(() => {
  const groups: Record<string, GroupedSchema> = {}
  const schema = currentSchema.value

  schema.forEach((item) => {
    // 如果字段设置了不显示，则跳过
    if (item.show === false) {
      return
    }

    const groupName = item.group || 'default'

    if (!groups[groupName]) {
      groups[groupName] = {
        title: groupName !== 'default' ? groupName : undefined,
        fields: [],
        columns: 2
      }
    }

    groups[groupName].fields.push(item)
  })

  return Object.values(groups)
})

// 菜单选择处理
const handleMenuSelect = (key: string) => {
  activeTemplateKey.value = key
  initFormData()
}

// 初始化表单数据
const initFormData = () => {
  const schema = currentSchema.value || []
  const data = currentData.value

  // 清空旧数据
  Object.keys(formData).forEach((key) => {
    delete formData[key]
  })
  Object.keys(formRules).forEach((key) => {
    delete formRules[key]
  })

  schema.forEach((item) => {
    const value = data[item.field] !== undefined ? data[item.field] : item.value

    formData[item.field] = value

    // 初始化验证规则
    if (item.required && props.editable) {
      formRules[item.field] = [
        { required: true, message: `请输入${item.label}`, trigger: 'blur' },
        ...(item.rules || [])
      ]
    } else if (item.rules && item.rules.length > 0) {
      formRules[item.field] = item.rules
    }
  })
}

// 获取字段值
const getFieldValue = (item: FieldSchema): any => {
  const data = currentData.value
  return data[item.field] !== undefined ? data[item.field] : item.value
}

// 格式化字段值（用于显示，现在主要用于插槽中）
const formatFieldValue = (item: FieldSchema): string => {
  const value = getFieldValue(item)

  if (value === null || value === undefined || value === '') {
    return '-'
  }

  // 优先级1: 使用自定义格式化函数
  if (item.formatter) {
    return item.formatter(value)
  }

  // 优先级2: 使用 formatterType（后端配置）
  if (item.formatterType) {
    return formatValue(value, item.formatterType, item.formatterConfig)
  }

  // 优先级3: 根据字段类型格式化
  switch (item.type) {
    case 'date':
      return value ? dayjs(value).format(item.dateFormat || 'YYYY-MM-DD') : '-'
    case 'datetime':
      return value ? dayjs(value).format(item.dateFormat || 'YYYY-MM-DD HH:mm:ss') : '-'
    case 'boolean':
      return value ? '是' : '否'
    case 'dict':
      // 字典类型由 DictTag 组件处理
      return value
    case 'tag':
      return value
    default:
      return String(value)
  }
}

// 获取字段组件
const getFieldComponent = (item: FieldSchema) => {
  // 如果指定了自定义组件，优先使用
  if (item.component) {
    return item.component
  }

  // 根据字段类型返回对应的字段组件
  switch (item.type) {
    case 'text':
      return FieldComponents.Text
    case 'number':
      return FieldComponents.Number
    case 'textarea':
      return FieldComponents.Textarea
    case 'date':
      return FieldComponents.Date
    case 'datetime':
      return FieldComponents.DateTime
    case 'select':
      return FieldComponents.Select
    case 'dict':
      return FieldComponents.Dict
    case 'boolean':
      return FieldComponents.Boolean
    case 'image':
      return FieldComponents.Image
    case 'api-select':
      return FieldComponents.ApiSelect
    case 'remote-select':
      return FieldComponents.RemoteSelect
    default:
      return FieldComponents.Text
  }
}

// 获取字段属性
const getFieldProps = (item: FieldSchema) => {
  const baseProps: Record<string, any> = {
    placeholder: item.placeholder || `请输入${item.label}`,
    clearable: true,
    disabled: !props.editable || props.readonly || item.disabled || item.readonly,
    ...(item.componentProps || {})
  }

  switch (item.type) {
    case 'text':
      return {
        ...baseProps,
        placeholder: item.placeholder || `请输入${item.label}`,
        maxlength: item.maxlength,
        showWordLimit: item.showWordLimit
      }
    case 'number':
      return {
        ...baseProps,
        placeholder: item.placeholder || `请输入数字`,
        min: item.min,
        max: item.max,
        step: item.step,
        precision: item.precision,
        controlsPosition: item.controlsPosition || 'right'
      }
    case 'textarea':
      return {
        ...baseProps,
        placeholder: item.placeholder || `请输入${item.label}`,
        rows: item.rows || 3,
        maxlength: item.maxlength,
        showWordLimit: item.showWordLimit,
        autosize: item.autosize
      }
    case 'date':
      return {
        ...baseProps,
        placeholder: item.placeholder || `请选择日期`,
        format: item.dateFormat || 'YYYY-MM-DD',
        valueFormat: item.dateFormat || 'YYYY-MM-DD'
      }
    case 'datetime':
      return {
        ...baseProps,
        placeholder: item.placeholder || `请选择日期时间`,
        format: item.dateFormat || 'YYYY-MM-DD HH:mm:ss',
        valueFormat: item.dateFormat || 'YYYY-MM-DD HH:mm:ss'
      }
    case 'select':
      return {
        ...baseProps,
        placeholder: item.placeholder || `请选择${item.label}`,
        options: item.options || [],
        multiple: item.multiple,
        filterable: item.filterable
      }
    case 'dict':
      return {
        ...baseProps,
        dictType: item.dictType,
        valueType: item.valueType || 'str',
        placeholder: item.placeholder || `请选择${item.label}`,
        multiple: item.multiple,
        filterable: item.filterable
      }
    case 'boolean':
      return {
        ...baseProps,
        activeText: item.activeText,
        inactiveText: item.inactiveText,
        activeValue: item.activeValue !== undefined ? item.activeValue : true,
        inactiveValue: item.inactiveValue !== undefined ? item.inactiveValue : false
      }
    case 'image':
      return {
        // 图片组件不需要额外的 props
      }
    case 'api-select':
      return {
        ...baseProps,
        apiConfig: item.apiConfig,
        placeholder: item.placeholder || `请选择${item.label}`
      }
    case 'remote-select':
      return {
        ...baseProps,
        remoteConfig: item.remoteConfig,
        placeholder: item.placeholder || `请输入${item.label}搜索`,
        filterable: true,
        remote: true
      }
    default:
      return baseProps
  }
}

// 保存
const handleSave = async () => {
  if (!props.editable) {
    return
  }

  try {
    await formRef.value?.validate()
    saving.value = true
    emit('save', { ...formData })
  } catch (error) {
    console.error('表单验证失败:', error)
    message.warning('请完善表单信息')
  } finally {
    saving.value = false
  }
}

// 返回
const handleBack = () => {
  emit('back')
  router.back()
}

// 监听 data 和 templates 变化，更新表单数据
watch(
  () => [props.data, props.templates, currentTemplate.value],
  () => {
    initFormData()
  },
  { deep: true, immediate: true }
)

// 监听模板切换
watch(
  () => activeTemplateKey.value,
  () => {
    initFormData()
  }
)

// 初始化
onMounted(() => {
  // 如果有模板，设置第一个为激活状态
  if (props.templates.length > 0) {
    const firstTemplate = props.templates[0]
    // 如果有子菜单，使用第一个子菜单的 key
    if (firstTemplate.children && firstTemplate.children.length > 0) {
      activeTemplateKey.value = firstTemplate.children[0].key
    } else {
      activeTemplateKey.value = firstTemplate.key
    }
  }
  initFormData()
})
</script>

<style scoped lang="scss">
.detail-form {
  .el-form-item {
    margin-bottom: 20px;
  }
}

.detail-descriptions {
  :deep(.el-descriptions__label) {
    font-weight: 500;
    color: #606266;
  }

  :deep(.el-descriptions__content) {
    color: #303133;
  }
}

// 左侧菜单 + 右侧内容布局
.dynamic-detail-layout {
  display: flex;
  gap: 20px;
  min-height: 500px;
}

.dynamic-detail-menu {
  width: 200px;
  flex-shrink: 0;
  background-color: #fff;
  border-radius: 4px;
  padding: 10px 0;

  .dynamic-detail-menu-list {
    border-right: none;

    :deep(.el-menu-item) {
      height: 48px;
      line-height: 48px;
      padding-left: 20px !important;

      &.is-active {
        background-color: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
        border-right: 2px solid var(--el-color-primary);
      }

      &:hover {
        background-color: var(--el-color-primary-light-9);
      }
    }
  }
}

.dynamic-detail-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
}

.dynamic-detail-scrollbar {
  flex: 1;
  height: 100%;
  min-height: 500px;
  max-height: calc(100vh - 200px); // 根据实际情况调整，留出顶部按钮和边距的空间

  :deep(.el-scrollbar__wrap) {
    overflow-x: hidden;
  }

  :deep(.el-scrollbar__bar) {
    &.is-vertical {
      right: 0;
    }
  }
}

.dynamic-detail-content-inner {
  padding: 20px;
}
</style>
