<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import ThemeToggle from './ThemeToggle.vue'

defineOptions({ name: 'ThemeToggleButton' })

defineProps({
  color: propTypes.string.def('')
})
</script>

<template>
  
    <ThemeToggle />
  
</template>

<style lang="scss" scoped>
.theme-toggle-button-wrapper {
  // display: inline-block;
}
</style>

