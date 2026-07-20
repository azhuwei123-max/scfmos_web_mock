<template>
  <el-form-item
    class="form-unit"
    :class="formInfo['formItemClass']"
    :style="{ width: `${formInfo['formItemStyle']}` }"
    :label="formInfo['colheader']"
    :prop="formInfo['colname']"
  >
    <component class="component" :is="getComponent(formInfo['compType'])"/>

    <el-tag class="ml-10px" style="height: 100%" v-if="formInfo['newcolunit']">
      <div class="tag" v-html="formInfo['newcolunit']"> </div>
    </el-tag>
  </el-form-item>
</template>

<script setup>
import useDynamicComp from './hooks/useDynamicComp'
const props = defineProps({
  // 处理好的码值字典对象
  dictList: {
    type: Object,
    default: () => reactive({})
  },

  // 表单数据，用reactive形式传递
  formData: {
    type: Object,
    default: () => reactive({})
  },

  formInfo: {
    type: Object,
    default: () => {}
  }
})

const selectInputClick = (formInfo) => {
  emit('selectInputClick', formInfo)
}

const selectChange = (formInfo) => {
  emit('selectChange', formInfo)
}

const emit = defineEmits(['selectInputClick', 'selectChange'])

const {
  inputComp,
  textareaComp,
  numberComp,
  radioComp,
  checkboxComp,
  selectComp,
  dateComp,
  selectInput,
  plusInput
} = useDynamicComp(props, emit)

const compFormat = {
  input: inputComp,
  textarea: textareaComp,
  number: numberComp,
  radio: radioComp,
  checkbox: checkboxComp,
  select: selectComp,
  date: dateComp,
  selectInput: selectInput,
  plusInput: plusInput
}

const getComponent = (type = 'input') => {
  return compFormat[type]
}
</script>

<style lang="scss" scoped>
.form-unit {
  :deep(.el-form-item__content) {
    flex-wrap: nowrap;
  }

  .component {
    flex: 1;
  }

  .tag {
    white-space: wrap;
    max-width: 250px;
    line-height: 16px;
  }

  :deep(.el-textarea__inner::-webkit-scrollbar) {
    height: 6px;
    width: 6px;
  }

  :deep(.el-textarea__inner::-webkit-scrollbar-thumb) {
    border-radius: 3px;
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
    background-color: #c3c3c3;
  }
}
</style>
