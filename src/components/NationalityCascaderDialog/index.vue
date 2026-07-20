<template>
  <Dialog
    :model-value="dialogVisible"
    @update:model-value="handleDialogVisibleChange"
    :title="title"
    :width="width"
    :fullscreen="false"
    :append-to-body="true"
  >
    <el-cascader
      v-model="selectedValue"
      :options="options"
      :props="cascaderConfig"
      :placeholder="placeholder"
      style="width: 100%"
      :clearable="clearable"
      :filterable="filterable"
      :show-all-levels="showAllLevels"
      :loading="nationalityOptionsLoading"
    />
    <template #footer>
      <el-button tpye="" @click="handleConfirm">确 定</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Dialog } from '@/components/Dialog'
import { useMessage } from '@/hooks/web/useMessage'
// TODO: 接口对接后，取消下面的注释，启用接口请求
 import { NationalityApi } from '@/components/NationalityCascaderDialog/api'

// 当前使用写死数据作为默认值


const message = useMessage()

defineOptions({ name: 'NationalityCascaderDialog' })



interface Props {
  modelValue: boolean
  title?: string
  width?: string
  /** 级联选择器选项数据 */
  options?: any[]
  /** 级联选择器配置 */
  cascaderProps?: any
  /** 占位符 */
  placeholder?: string
  /** 是否可清空 */
  clearable?: boolean
  /** 是否可搜索 */
  filterable?: boolean
  /** 输入框中是否显示选中值的完整路径 */
  showAllLevels?: boolean
  /** 初始值（用于回显） */
  initialValue?: string | string[]
  beforeConfirm?: Function
}


const  defaultNationalityCascaderProps = {
  value:'value',
  label:'label',
  children:'children',
  emitPath:true
}



const props = withDefaults(defineProps<Props>(), {
  title: '选择国籍',
  width: '800px',
  options:()=> [],
  cascaderProps:()=> ({
    value:'value',
  label:'title',
  children:'children',
  emitPath:true
  }),
  placeholder: '请选择洲/国家/地区',
  clearable: true,
  filterable: true,
  showAllLevels: false,
  // 确定前校验
  beforeConfirm: () => true
})

// 国籍选项数据（支持从接口获取或使用默认值）
const nationalityOptionsList = ref([])
const nationalityOptionsLoading = ref(false)

// 级联选择器配置
const cascaderConfig = computed(() => props.cascaderProps || defaultNationalityCascaderProps)

// 实际使用的选项数据（如果传入了 options prop，则使用传入的，否则使用从接口获取的）
const options = computed(() => {
  // 如果外部传入了 options，优先使用外部的
  if (props.options && props.options.length > 0) {
    return props.options
  }
  // 否则使用从接口获取的或默认的
  return nationalityOptionsList.value
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [value: string] // 返回最后一级的值（国家或地区）
  cancel: []
}>()

// 弹框显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 选中的值（级联路径数组）
const selectedValue = ref<string[]>([])


const processNationalityData=(data:any[]):any[] => {
  if(!data || !Array.isArray(data)){
    return []
  }

  return data.map((item)=> {
    const processedItem:any = {
      value:item.value,
      title:item.title || item.label,
      children:item.children ? processNationalityData(item.children) : undefined
    }


    return processedItem
  })
}

/**
 * 获取国籍选项（从接口获取）
 * 当前未启用，接口对接后可以取消注释并启用
 *
 * 注意：此函数当前未使用，会在接口对接后启用，lint 警告可忽略
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchNationalityOptions = async () => {
  try {
    nationalityOptionsLoading.value = true

    // TODO: 接口对接后，取消下面的注释，启用接口请求
    // 注意：需要先在文件顶部取消注释 import { NationalityApi } from '@/api/customer/nationality'
    const apiOptions = await NationalityApi.getNationalityOptions()
    console.log('apiOptions',apiOptions);
    
    if (apiOptions && apiOptions.length > 0) {
      nationalityOptionsList.value = processNationalityData(apiOptions) 
      return
    }

    // 接口未对接或请求失败时，使用默认的写死数据
    // nationalityOptionsList.value = defaultNationalityOptions
  } catch (error) {
    console.error('获取国籍选项失败，使用默认数据:', error)
    // 失败时使用默认数据
    // nationalityOptionsList.value = defaultNationalityOptions
  } finally {
    nationalityOptionsLoading.value = false
  }
}

// 监听弹框显示，初始化选中值
watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      // 如果有初始值，设置选中值
      if (props.initialValue) {
        if (Array.isArray(props.initialValue)) {
          selectedValue.value = props.initialValue
        } else {
          // 如果是字符串，需要根据值找到对应的路径
          // 这里简化处理，如果无法匹配则使用空数组
          selectedValue.value = []
        }
      } else {
        selectedValue.value = []
      }
    }
  }
)

// 组件挂载时获取国籍选项
// TODO: 接口对接后，取消下面的注释，启用接口请求
onMounted(() => {
   fetchNationalityOptions()
  // 当前使用默认的写死数据，无需调用接口
  // 接口对接后，取消上面的注释，启用 fetchNationalityOptions() 调用
})

const finfdTitlePathByvalue = (vals,data) => {
  if(!vals || vals.length ===0 || !data ||data.length ===0) {
    return []
  }

  const result = []
  let currentData = data

  for(let i=0;i<vals.length;i++) {
    const value = vals[i]
    const item = currentData.find((d) => d.value === value)

    if(item) {
      result.push(item.title || item.label || item.value) 
      if(item.children && item.children.length > 0 && i<vals.length -1) {
        currentData = item.children
      }else {
        break
      }
    }else {
      break
    }
  
  }

  return result
}




// 确认选择
const handleConfirm = () => {
  if (!selectedValue.value || selectedValue.value.length === 0) {
    message.warning('请选择国籍')
    return
  }

  const titlePath = finfdTitlePathByvalue(selectedValue.value,options.value)

  console.log('selectedValue.value',selectedValue.value);
  

  // 获取最后一级（国家或地区）作为返回值
  const nationalityValue = selectedValue.value[selectedValue.value.length - 1]

  const lastTitle = titlePath[titlePath.length -1]
  
  if (!(props.beforeConfirm?.(nationalityValue) ?? true)) return

  emit('confirm', {
    nationalityValue,
    lastTitle
  })
  dialogVisible.value = false
}

// 取消选择
const handleCancel = () => {
  dialogVisible.value = false
  emit('cancel')
}

// 处理弹框显示状态变化
const handleDialogVisibleChange = (visible: boolean) => {
  dialogVisible.value = visible
  if (!visible) {
    // 关闭时重置选中值
    selectedValue.value = []
  }
}
</script>

<style scoped lang="scss">
// 可以添加自定义样式
</style>
