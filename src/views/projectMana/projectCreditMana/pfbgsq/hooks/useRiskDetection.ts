/** 自动风险探测相关 */
export const useRiskDetection = (currentRowSource: MaybeRef) => {
  const riskMonitorVisible = ref(false)
  const riskData = ref()
  const submitFlag = ref(false)
  const serialNo = ref('')
  const phaseNo = ref('')
  const creditFlowApprovalVisible = ref(false)
  
  const currentRow = computed(()=> {
    const raw = unref(currentRowSource)
    return raw
  })
  const doRiskDetection = async (action?: Function, rskTp = 1) => {
    if (getSelect()) return
    if(action) {
      action?.()
    } else {
      riskData.value = {
        scenarioId: '001',
        rskTp,
        params: {
          OccurType: currentRow.value.occurType,
          ObjectType: currentRow.value.objectType,
          ObjectNo: currentRow.value.objectNo,
          FlowNo: currentRow.value.flowNo,
          PhaseNo: currentRow.value.phaseNo,
          ApplyType1: currentRow.value.applyType
        }
      }
    }

    riskMonitorVisible.value = true
    submitFlag.value = false
    riskData.value.rskTp = rskTp
  }

  const submit = async (action?: Function) => {
    await doRiskDetection(action, 2)
    submitFlag.value = true
  }

  const handleRiskMonitorConfirm = async (hasFailure) => {
    console.log('hasFailure', hasFailure)
    if (!submitFlag.value) {
      await handleRiskMonitorCancel()
      return
    }
    riskMonitorVisible.value = false

    serialNo.value = currentRow.value.objectNo
    phaseNo.value = currentRow.value.phaseNo
    creditFlowApprovalVisible.value = true
  }

  const getSelect = () => {
    if (!currentRow.value) {
      ElMessage.warning('请选择一条记录')
      return true
    }
    return false
  }

  const handleRiskMonitorCancel = async () => {
    riskMonitorVisible.value = false
  }
  const handleCreditFlowApprovalCancel = () => {
    creditFlowApprovalVisible.value = false
  }

  return {
    riskData,
    serialNo,
    phaseNo,
    doRiskDetection,
    riskMonitorVisible,
    creditFlowApprovalVisible,
    submit,
    handleRiskMonitorConfirm,
    handleCreditFlowApprovalCancel,
    handleRiskMonitorCancel
  }
}
