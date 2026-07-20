<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

defineOptions({ name: 'demo' })

const props = defineProps({
  height: propTypes.string.def(''),
  width: propTypes.string.def(''),
  color: propTypes.string.def('#FFFFFF'),
  prefix:propTypes.string.def('icon'),
  name: propTypes.string.def(''),
})
const { height, width, color,prefix,name} = props
const symbolId=computed(()=>`#${prefix}-${name}`).value
</script>
<template>
  <svg aria-hidden="true" class="svg-icon" :style="{height:height,width:width}">
    <use :xlink:href="symbolId" :fill="color" ></use>
  </svg>
</template>
