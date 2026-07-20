/**
 * 表单辅助器
 */
export default function useFormHelper(form) {
  /**
   * 对批量字段进行校验
   *  当对同一字段进行重复校验时，优化观感，方便定位
   *    validateField(['customerName', 'otherField'])
   * @param {*} fields 
   * @returns promise->true校验通过->false校验不通过
   */
  const validateField = async (fields) => {
    if (typeof fields === 'string') {
      return doValidate(fields, checkIsError(fields))
    } else {
      const errorFields = []
      const successFields = []
      fields.forEach((v) => {
        if (checkIsError(v)) {
          errorFields.push(v)
        } else {
          successFields.push(v)
        }
      })

      if (errorFields.length) {
        doValidate(successFields)
        return doValidate(errorFields, true)
      } else {
        return doValidate(successFields)
      }
    }
  }

  const doValidate = async (fields, delay) => {
    if (!fields?.length) return

    if (delay) {
      form.value.clearValidate(fields)
      await new Promise((res) => nextTick(() => setTimeout(res, 50)))
    }
    return await form.value.validateField(fields)
  }

  const checkIsError = (field) => {
    return form.value.getField(field).validateState === 'error'
  }

  return {
    validateField
  }
}
