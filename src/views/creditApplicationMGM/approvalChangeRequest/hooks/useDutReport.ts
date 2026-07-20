import { creditApplyJobApi } from '@/api/creditapplication/creditApplyJob'

/** 尽职报告 */
export const useDutReport = (currentRowSource: MaybeRef) => {

  const currentRow = computed(()=> {
    const raw = unref(currentRowSource)
    return raw
  })
  
  const openIframeDialog = (url: string) => {
    window.open(url, '_blank')
  }

  const writeDutReport = async () => {
    try {
      if (!currentRow.value) return ElMessage.warning('请选择一条数据')
      const res = await creditApplyJobApi.getFormatDocData({
        objectno: currentRow.value.objectNo,
        objecttype: currentRow.value.objectType

      })

      if (res == null) {
        const status = await creditApplyJobApi.genReportCheck({
          objectno: currentRow.value.objectNo,
          objecttype: currentRow.value.objectType
        })
        if (!status.data && status !== true) {
          await ElMessageBox.confirm(status.msg, '提示', {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning'
          })
        }

        const res2 = await creditApplyJobApi.getTemplateList({
          objectno: currentRow.value.objectNo,
          objecttype: currentRow.value.objectType
        })

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
          }
        )
        await createFormatDocData([res])
      }
    } finally {

    }
  }

  const datalist = ref([])
  const visible = ref(false)
  const columns = []
  const createFormatDocData = async (list) => {
    if (list && list?.length > 1) {
      datalist.value = list
      visible.value = true
      return
    }

  
    const res = await creditApplyJobApi.createFormatDocData({
      objectno: currentRow.value.objectNo,
      objecttype: currentRow.value.objectType,
      docid: list[0].docid,
      customerid: currentRow.value.customerID
    })

    if (res) {
      openIframeDialog(res)
    }
  }

  const okPick = (rowData) => {
    createFormatDocData([rowData])
  }

  // 查看尽职报告
  const checkDutReport = async () => {
    // ElMessage.info('功能待实现')
    if (!currentRow.value) return ElMessage.warning('请选择一条数据')

    const res = await creditApplyJobApi.viewFormatDocData({
      objectno:  currentRow.value.objectNo,
      objecttype:  currentRow.value.objectType
    })

    if (res) {
      openIframeDialog(res?.newreportno)
    }
  }

  return {
    openIframeDialog,
    writeDutReport,
    datalist,
    visible,
    columns,
    okPick,
    checkDutReport,
  }
}
