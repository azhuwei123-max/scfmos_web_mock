<template>
  <div class="dynamic-detail-image-field">
    <div v-if="modelValue && Array.isArray(modelValue) && modelValue.length > 0" class="image-list">
      <el-image
        v-for="(url, index) in imageUrlList"
        :key="index"
        :src="url"
        :preview-src-list="imageUrlList"
        :initial-index="index"
        fit="cover"
        style="width: 200px; height: 200px; margin-right: 10px; margin-bottom: 10px"
        preview-teleported
      />
    </div>
    <div v-else-if="modelValue && typeof modelValue === 'string'" class="single-image">
      <el-image
        :src="modelValue"
        :preview-src-list="[modelValue]"
        fit="cover"
        style="width: 200px; height: 200px"
        preview-teleported
      />
    </div>
    <el-empty v-else description="暂无图片" :image-size="100" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

defineOptions({ name: 'DynamicDetailImage' })

interface Props {
  modelValue?: string | string[] | Array<{ url?: string; src?: string; bizReferdne?: string }>
}

const props = defineProps<Props>()

// 将 modelValue 转换为 ImageViewer 需要的 url-list 格式
const imageUrlList = computed(() => {
  if (!props.modelValue) {
    return []
  }

  // 如果是字符串数组，直接返回
  if (Array.isArray(props.modelValue)) {
    return props.modelValue
      .map((item) => {
        if (typeof item === 'string') {
          return item
        }
        // 如果是对象，尝试获取 url、src 或 bizReferdne
        return item.url || item.src || item.bizReferdne || ''
      })
      .filter(Boolean)
  }

  // 如果是单个字符串，转换为数组
  if (typeof props.modelValue === 'string') {
    return [props.modelValue]
  }

  return []
})
</script>

<style scoped lang="scss">
.dynamic-detail-image-field {
  .single-image {
    display: inline-block;
  }
}
</style>
