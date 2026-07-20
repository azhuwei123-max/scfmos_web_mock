/** 签署意见 */
export const useSignOpinion = (currentRowSource: MaybeRef) => {
  const currentRow = computed(()=> {
    const raw = unref(currentRowSource)
    return raw
  })

  const signOpinionVisible = ref(false)
  const currentProcessInstanceForOpinion = ref<any[]>([])

  const handleSignOpinion = () => {
    if (!currentRow.value) return ElMessage.warning('请选择一条数据')
    const selectedRows = currentRow.value
    currentProcessInstanceForOpinion.value = [{
      ...selectedRows
    }]
    signOpinionVisible.value = true
  }

  return {
    signOpinionVisible,
    currentProcessInstanceForOpinion,
    handleSignOpinion
  }

}