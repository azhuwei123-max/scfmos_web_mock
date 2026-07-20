import type { Router } from 'vue-router'
import { submit as creditflowSubmit } from '@/api/creditflow'
import type { ActionButton } from '@/components/ActionBar'
import { creditApplyJobApi } from '@/api/creditapplication/creditApplyJob'
import { ElLoading } from 'element-plus'
import {addDialog} from "@/components/Dialog";
import {FlowRecord} from "@/components/FlowRecord/index";

export const useBizMethods = (
  currentRowSource: MaybeRef,
  router: Router,
  getList: () => Promise<any>
) => {
  const currentRow = computed(() => {
    const raw = unref(currentRowSource)
    return raw
  })

  // ====== 查看意见 ======
  const viewPhaseOpinion = () => {
    if (!currentRow.value) {
      ElMessage.warning('请选择一条数据')
      return
    }
    router.push({
      path: '/revApprMan/viewApplyPhaseOpinion',
      query: {
        serialNo: currentRow.value.objectNo,
        t: new Date().getTime()
      }
    })
  }

  // ====== 查看流转记录 ======
  const toRecord = () => {
    if (!currentRow.value) {
      ElMessage.warning('请选择一条记录')
      return true
    }
    // router.push({
    //   path: '/revApprMan/creditreviewapprovalrecord',
    //   query: {
    //     serialNo: currentRow.value.objectNo,
    //     objectType: 'CreditApply',
    //     t: new Date().getTime()
    //   }
    // })
    addDialog({
      title: '流转记录',
      width:"1200px",
      hideFooter: true,
      contentRenderer: ()=> (
        <FlowRecord serialNo={currentRow.value.objectNo} objectType={'CreditApply'} />
    )
    })
  }

  // ====== 收回 ======
  const takeBack = async () => {
    if (!currentRow.value) {
      ElMessage.warning('请选择一条记录')
      return true
    }
    await ElMessageBox.confirm('确认收回吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      async beforeClose(action, instance, done) {
        if (action !== 'confirm') {
          done()
          return
        }
        instance.confirmButtonLoading = true
        await creditflowSubmit({
          serialNo: currentRow.value.objectNo,
          phaseNo: currentRow.value.phaseNo,
          objectType: currentRow.value.objectType,
          nextUserRole: '收回',
          nextUserInfo: ''
        }).finally(() => (instance.confirmButtonLoading = false))
        ElMessage.success('收回成功')
        getList()
      }
    })
  }

  // ====== 查看批复通知书 ======
  const viewEdpfReport = async (btn: ActionButton) => {
    if (!currentRow.value) {
      ElMessage.warning('请选择一条记录')
      return true
    }

    btn.loading = true
    creditApplyJobApi
      .viewEdpfReport({
        objectNo: currentRow.value.objectNo
      })
      .then((res) => {
        if (res.checkflag !== 'true') {
          ElMessage.warning(res.msg)
          return
        }
        window.open(res.url)
      })
      .finally(() => {
        btn.loading = false
      })
  }

  /** 申请详情操作 */
  const handleDetail = async () => {
    if (!currentRow.value) return ElMessage.warning('请选择一条数据')

    const row = currentRow.value
    const detailPath = `/creditapplication/creditApplyJob/detail`
    router.push({
      path: detailPath,
      query: {
        serialNo: row.objectNo,
        businessType: row.businessType,
        applyType: row.applyType,
        objectNo: row.objectNo,
        objectType: row.objectType,
        customerID: row.customerID,
        phaseNo: row.phaseNo,
        t: Date.now(), // 解决重复打开相同详情，详情页面不加载的问题
        _tagTitle: '链属批复变更申请', // 对tag页签中的title，重命名
      }
    })
  }

  /** 取消申请 */
  const handleCancel = async () => {
    if (!currentRow.value) return ElMessage.warning('请选择一条数据')
    const row = currentRow.value
    await ElMessageBox.confirm('确定要取消该申请吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const loadingInstance = ElLoading.service({
      text: '处理中...'
    })
    try {
      await creditApplyJobApi.cancelContract({ objectType: 'CreditApply', serialNo: row.objectNo })
      ElMessage.success('取消成功')
      getList()
    } finally {
      loadingInstance.close()
    }
  }

  return {
    handleDetail,
    viewPhaseOpinion,
    toRecord,
    takeBack,
    viewEdpfReport,
    handleCancel
  }
}
