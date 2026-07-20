/**
 * 处理表单动态事件：change、blur等
 * @param {*} props
 */
export default function useFormChange(props, refList) {
  // 选择框change事件
  const formSelectChange = (formInfo) => {
    switch (formInfo['colname']) {
      case 'nraflag':
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
        break
      default:
        break
    }
  }

  /**
   * 自定义字段显隐逻辑
   */
  const customVisible = {
    // 应信贷逻辑，以下字段无条件隐藏
    customerid: () => false,
    cycleflag: () => false,
    vouchtype: () => false,
    vouchtypename: () => false,
    vouchflag: () => false,
    iszsx: () => false,
    entrustflag: () => false,
    loanproductcategory: () => false,
    othercondition: () => false,
    termmonth: () => false,
  }

  return {
    formSelectChange,
    formSelectInputClick,
    popConfirm,
    customVisible
  }
}
