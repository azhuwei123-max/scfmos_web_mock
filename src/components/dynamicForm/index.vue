<template>
  <el-form
    ref="formRef"
    class="dynamic-form"
    inline
    :model="formData"
    :rules="formRules"
    label-width="170px"
    size="small"
    label-position="left"
    v-bind="$attrs"
    :validate-on-rule-change="false"
  >
    <!-- 目前统一模块样式折叠面板；需要可调整 -->
    <el-collapse v-model="activeNames">
      <template v-for="form in formList" :key="form.dockid">
        <div v-show="!form.isHidden">
          <el-collapse-item
            v-show="collapseShow(form)"
            :title="form.dockname"
            :name="form.dockid"
          >
            <!-- 自定义模块内容 -->
            <slot :name="form.slotName" :form="form">
              <!-- 配置化表单 -->
              <el-row :gutter="10">
                <template v-for="formInfo in form.forms" :key="formInfo['colname']">
                  <el-col :span="formInfo['colSpan']" v-if="formInfo['iscolvisible']">
                    <DefineTemplate v-slot="{ formInfo }">
                      <formUnit
                        :dictList="dictList"
                        :formInfo="formInfo"
                        :formData="formData"
                        @pop-confirm="popConfirm"
                        @input-change="inputChange(formInfo)"
                        @select-input-click="selectInputClick(formInfo)"
                        @select-change="selectChange(formInfo)"
                      />
                    </DefineTemplate>
                    <!-- 表单单元 -->
                    <slot :name="formInfo.slotName" :formInfo="formInfo" :tempEl="ReuseTemplate">
                      <ReuseTemplate :formInfo="formInfo" />
                    </slot>
                  </el-col>
                </template>
              </el-row>
            </slot>
          </el-collapse-item>
        </div>
        
      </template>
    </el-collapse>
  </el-form>
</template>

<script setup>
import * as dynamicApi from '@/api/dynamicForm/index.js'
import formUnit from './formUnit.vue'
import useDynamicForm from './hooks/useDynamicForm'
import useFormOperator from './hooks/useFormOperator'
import { createReusableTemplate } from '@vueuse/core'

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
  },
})

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()

const formRef = ref()

const emit = defineEmits(['inputChange', 'selectInputClick', 'selectChange', 'renderFinished', 'popConfirm'])

const { activeNames, formRules, formList, formRendering, dictListLoading } = useDynamicForm(props, emit, { formRef })
console.log('[ formList ] >', formList)
const formOperator = useFormOperator({
  formList,
  formData: props.formData,
  dictList: props.dictList,
  formRules,
  formRendering,
  dictListLoading
})

// dock是否显示
const slots = useSlots()
const collapseShow = (form) => (form.slotName in slots) || form.forms?.some(v => v.iscolvisible)

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
  dictList: props.dictList,
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

  :deep(.el-form-item .el-form-item__label) {
    line-height: 14px !important;
    height: 25px;
    display: flex;
    align-items: center;
  }
  :deep(.el-form-item){
    // margin-bottom: 16px !important;
    padding-right: 40px;
    margin-bottom: 9px;
    margin-left: 16px;
  }

  .is-error {
    margin-bottom: 18px;
  }
  
}
</style>