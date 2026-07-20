<template>
  <crmsIframe :params="params" />
</template>

<script setup>
import {computed} from 'vue'
import {useRoute} from 'vue-router'
import crmsIframe from '@/components/busiComp/crmsIframe/index.vue'

defineOptions({
  name: 'CrmIramePage'
})

const route = useRoute()

 const params = computed(()=> {
  const routeName = route.name

  return {
    tpopentype: routeName
  }
 })
 

// const params = reactive({
//   tpopentype: 'ProjCoreviewApply' 
// })
</script>