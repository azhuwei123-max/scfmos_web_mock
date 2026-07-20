import { nextTick } from 'vue'

/**
 * 动态表单辅助器
 *  该辅助函数会等待表单渲染完成后开始执行函数，返回promise
 * @param {*} props
 * @returns
 */
export default function useDynamicHelper(dynamicFormRef) {
  const formRefComputed = () => {
    return new Promise((res) => {
      if (dynamicFormRef.value) {
        res(dynamicFormRef)
        return
      }

      const stopEffect = watchEffect(() => {
        if (dynamicFormRef.value) {
          res(dynamicFormRef)
          nextTick(() => {
            stopEffect()
          })
        }
      })
    })
  }

  /**
   * 等待dictList取数完成，并返回dictList对象
   * @returns 
   */
  const dictListComputed = async (back) => {
    return new Promise(async (res) => {
      const formRef = await formRefComputed()

      if (!formRef.value.dictListLoading) {
        res(formRef.value.dictList, formRef.value.setDictByName)
        back?.(formRef.value.dictList, formRef.value.setDictByName)
        return
      }

      const stopEffect = watchEffect(() => {
        if (!formRef.value.dictListLoading) {
          res(formRef.value.dictList, formRef.value.setDictByName)
          back?.(formRef.value.dictList, formRef.value.setDictByName)
          nextTick(() => {
            stopEffect()
          })
        }
      })
    })
  }

  /**
   * 查模板（可在任何时机调用）
   * @param {*} colname
   * @returns
   */
  const findColComputed = (colname) => {
    return new Promise(async (res) => {
      const formRef = await formRefComputed()

      const findTemp = await formRef.value.findColComputed(colname)
      res(findTemp)
    })
  }

  /**
   * 目标字段是否可见（可在任何时机调用）
   *  返回promise
   * @param {*} colname
   * @returns
   */
  const isColVisibleComputed = (colname) => {
    return new Promise(async (res) => {
      const findTemp = await findColComputed(colname)

      if (!findTemp) return res(false)

      res(findTemp['iscolvisible'])
    })
  }

  /**
   * 设置字段只读（可在任何时机调用）
   * @param {*} colname
   * @param {*} isRead
   * @returns
   */
  const setColReadonly = async (colname, isRead) => {
    const formRef = await formRefComputed()

    formRef.value.setColReadonly(colname, isRead)
  }

  return {
    findColComputed,
    isColVisibleComputed,
    setColReadonly,
    dictListComputed
  }
}
