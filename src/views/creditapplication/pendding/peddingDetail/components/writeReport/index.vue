<template>
  <!-- <h1>xiongxiong</h1> -->
  <IFrame v-if="!isError && iframeUrl" :auto-height="false" :src="iframeUrl" :onload="onIframeLoad" />
  <div> </div>
</template>

<script setup>
import { creditApplyJobApi } from '@/api/creditapplication/creditApplyJob'

const route = useRoute()

// 填写尽职报告
const writeDutReport = async () => {
  // ElMessage.info('功能待实现')
  // creditApplyJobApi.aa({}).then(res => {
  // })

  const res = await creditApplyJobApi.getFormatDocData({
    objectno: route.query.serialNo,
    objecttype: route.query.objectType
  })

  if (res == null) {
    const status = await creditApplyJobApi.genReportCheck({
      objectno: route.query.serialNo,
      objecttype: route.query.objectType
    })

    if (!status.data && status !== true) {
      await ElMessageBox.confirm(status.msg, '提示', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning'
      })
    }

    const res2 = await creditApplyJobApi.getTemplateList({
      objectno: route.query.serialNo,
      objecttype: route.query.objectType
    })

    console.log('resresresres1111', res2)
    // datalist.value = [...res2,...res2]
    // getDataList()

    await createFormatDocData(res2)
  }

  if (res) {
    await ElMessageBox.confirm(
      '重新填写调查报告后，需要重新查看生成调查报告，您要确定重新填写吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        // beforeClose: async (action, instance, done) => {
        //   if(action === 'confirm') {
        //     try {
        //       instance.confirmButtonLoading = true
        //       instance.cancelButtonLoading = true
        //       await  createFormatDocData([res])
        //       done()
        //     } finally {
        //       instance.confirmButtonLoading = false
        //       instance.cancelButtonLoading = false
        //     }

        //   }else {
        //     done()
        //   }
        // }
      }
    )
    await createFormatDocData([res])
  }

  // console.log('resresresres',[...res,...res]);
}
// writeDutReport()

const createFormatDocData = async (list) => {
  if (list && list?.length > 1) {
    datalist.value = list
    visible.value = true
    // const res = await creditApplyJobApi.createFormatDocData({
    // objectno:selectedRows.value[0].objectNo,
    //  objecttype:selectedRows.value[0].objectType,
    // })
    // console.log('最后一步',res2);
    return
  }
  console.log('selectedRows', route.query.objectType)

  try {
    const res = await creditApplyJobApi.createFormatDocData({
      objectno: route.query.serialNo,
      objecttype: route.query.objectType,
      docid: list[0].docid,
      customerid: route.query.customerID
    })
    console.log('最后一步', res)

    if (res) {
      openIframeDialog(res)
    }
  } finally {
  }
}

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

const onIframeLoad = () => {
  console.log('加载了之后')
}

onActivated(() => {
  iframeUrl.value = ''
  writeDutReport()
})
</script>
