/**
 * 处理表单动态事件：change、blur等
 * @param {*} props
 */
export default function useFormChange(props, refList) {
  // 选择框change事件
  const formSelectChange = (formInfo) => {
    switch (formInfo['colname']) {
      case 'loanratetermid':
        // 控制指定控件显隐
        if (['RAT0021', 'RAT002'].includes(props.formData[formInfo['colname']])) {
          props.formData['repricetype'] = '7'
        }
        break
      default:
        break
    }
  }

  // 点击打开弹窗事件
  const formSelectInputClick = (formInfo) => {
    refList.mapRefs.value[`select${formInfo.colname}InputRef`].open(formInfo)
  }

  // 弹窗确认回调事件
  const popConfirm = (colname, item) => {
    switch (colname) {
      case 'putoutorgname': // 入账机构
        props.formData.putoutorgid = item.itemNo
        props.formData.putoutorgname = item.itemName
        break

      default:
        break
    }
  }

  /**
   * 自定义字段显隐逻辑
   */
  const customVisible = {
    // 信贷产品方案
    // loanproductcategory: () => props.formData['gylflag'] !== '03',
  }

  /**
     * 自定义字段只读逻辑
     */
  const customReadonly = {
    repricetype: () => ['RAT0021', 'RAT002'].includes(props.formData['loanratetermid'])
  }

  /**
   * 自定义字段必录逻辑
   */
  const customRequired = {
    entrustflag: () => ['010', '030'].includes(props.formData['lendback'])
  }
  
  return {
    formSelectChange,
    formSelectInputClick,
    popConfirm,
    customVisible,
    customReadonly,
    customRequired
  }
}
