<template>
  <el-form
    ref="formRef"
    class="dynamic-form"
    inline
    :model="formData"
    :rules="formRules"
    label-width="170px"
    v-bind="$attrs"
    :validate-on-rule-change="false"
  >
    <!-- 配置化表单 -->
    <el-row :gutter="10">
      <template v-for="formInfo in formList" :key="formInfo['colname']">
        <el-col :span="formInfo['colSpan']" v-if="formInfo['iscolvisible']">
          <!-- 表单单元 -->
          <formUnit
            :dictList="dictList"
            :formInfo="formInfo"
            :formData="formData"
            @pop-confirm="popConfirm"
            @input-change="inputChange(formInfo)"
            @select-input-click="selectInputClick(formInfo)"
            @select-change="selectChange(formInfo)"
          />
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>

<script setup>
import formUnit from '../formUnit.vue'
import useDynamicForm from '../hooks/useDynamicForm'
import useFormOperator from '../hooks/useFormOperator'

const props = defineProps({
  // 预设定表单模块，防止出现意料之外的模块
  dockList: Array,

  // 接口返回的所有表单配置字段
  formTempList: {
    type: Array,
    default: () => []
  },

  // 处理好的码值字典对象
  dictList: {
    type: Object,
    default: () => reactive({})
  },

  // 表单数据，用reactive形式传递
  formData: Object,

  // 是否优化渲染。-- 大幅提升渲染效果。
  optimize: {
    type: Boolean,
    default: true
  },

  customVisible: {
    type: Object,
    default: () => ({})
  },
  customRequired: {
    type: Object,
    default: () => ({})
  },
  customReadonly: {
    type: Object,
    default: () => ({})
  }
})

const formRef = ref()

const emit = defineEmits(['inputChange', 'selectInputClick', 'selectChange', 'renderFinished', 'popConfirm'])

const { activeNames, formRules, formList, formRendering } = useDynamicForm(props, emit, { formRef })
const formOperator = useFormOperator({
  formList,
  formData: props.formData,
  formRules,
  formRendering
})

/**
 * input框change事件，业务组件自行处理逻辑
 */
const inputChange = (formInfo) => {
  emit('inputChange', formInfo)
}

/**
 * 弹窗清空
 */
const popConfirm = (colname, item) => {
  emit('popConfirm', colname, item)
}

/**
 * 弹窗选择点击事件，业务组件自行处理逻辑
 */
const selectInputClick = (formInfo) => {
  emit('selectInputClick', formInfo)
}

/**
 * 选择框change事件
 */
const selectChange = (formInfo) => {
  emit('selectChange', formInfo)
}

/**
 * 更新表单数据；供外部调用
 * 弹窗选择、额外赋值时可用
 */
const setFormData = (updateForm = {}) => {
  Object.assign(formData, updateForm)
}

const validate = () => {
  return formRef.value.validate((valid, obj) => {
    if (obj) {
      ElMessage.warning('必录项 未录')
      // formRef.value.scrollToField(Object.keys(obj)[0]) // 会导致页头消失的bug
    }

    return valid
  })
}

const resetFields = async () => {
  return await formRef.value.resetFields()
}

defineExpose({
  setFormData,
  validate,
  resetFields,
  ...formOperator
})
</script>

<style lang="scss" scoped>
.dynamic-form {
  :deep(.el-collapse-item__title) {
    font-weight: bolder;
    font-size: larger;
  }

  :deep(.el-form-item--default .el-form-item__label) {
    line-height: 18px;
    display: flex;
    align-items: center;
  }
}
</style>