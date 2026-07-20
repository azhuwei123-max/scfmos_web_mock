<template>
 <!-- <h1>xiongxiong</h1> -->
 <IFrame v-if="!isError" :auto-height="false" :src="iframeUrl" :onload="onIframeLoad" />
 <div>

 </div>
</template>

<script setup>
import { creditApplyJobApi } from '@/api/creditapplication/creditApplyJob'

const route = useRoute()



// 查看尽填写报告
const checkDutReport =  async () => {
  // await ElMessageBox.confirm('是否删除尽职调查报告', '提示', {
  //     confirmButtonText: '确定',
  //     cancelButtonText: '取消',
  //     type: 'warning'
  //   })

    const res = await creditApplyJobApi.viewFormatDocData({
    objectno:route.query.serialNo,
     objecttype:route.query.objectType,
  })


  console.log('resres',res);
if(res) {
  openIframeDialog(res?.newreportno)
}
}

checkDutReport()

/** 打开 IFrame Dialog */
const iframeDialogVisible = ref(false)
const iframeUrl = ref('')
const iframeTitle = ref('')

const openIframeDialog = (url, title = '详情预览') => {
  // iframeUrl.value = url
  // iframeTitle.value = title
  // iframeDialogVisible.value = true
  // window.open(url,'_blank')
  iframeUrl.value = url
}

const onIframeLoad = ()=>{
   console.log('加载了之后')
   
}
</script>