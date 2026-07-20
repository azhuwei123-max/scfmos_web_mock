<template>
  <el-input class="readonly-clear-wrapper" v-bind="$attrs" readonly @click="openClick">
    <template #suffix>
      <ElIcon v-show="$attrs.modelValue" style="cursor: pointer" class="clear-icon" @click.stop="clearClick">
        <CircleClose />
      </ElIcon>
    </template>
    <template #append>
      <el-button @click="openClick">
        <Icon icon="ep:more" />
      </el-button>
    </template>
  </el-input>
</template>

<script setup>
import { Icon } from '@/components/Icon'
import { ElIcon } from 'element-plus'
import { CircleClose } from '@element-plus/icons-vue'

const emit = defineEmits(['openClick', 'update:modelValue', 'clear'])

const openClick = () => {
  emit('openClick')
}

const clearClick = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<style lang="scss" scoped>
.readonly-clear-wrapper {
  & .clear-icon {
    opacity: 0;
    transition: opacity 0.2s;
    font-size: '14px';
  }
  &:hover .clear-icon {
    opacity: 1;
  }

  & .clear-icon:hover {
    color: var(--el-color-primary);
  }
}
</style>
