<template>
  <IFrame :src="iframeSrc" />
</template>

<script setup lang="tsx">
import { useTagsView } from '@/hooks/web/useTagsView';

defineOptions({
  name: 'IframeView'
})

const route = useRoute()
const { setTitle } = useTagsView()

const iframeSrc = decodeURIComponent(route.query.url as string || '')
console.log('[ iframeSrc ] >', iframeSrc)

onActivated(()=> {
  const pageTitle = route.query.title as string
  if(pageTitle) {
    setTitle(decodeURIComponent(pageTitle),'/iframe/view')
  }
})
</script>