/**
 * 处理表单动态事件：change、blur等
 * @param {*} props
 */
export default function useFormChange(props, refList) {
  // 选择框change事件
  const formSelectChange = (formInfo) => {
    switch (formInfo['colname']) {
      case 'gylflag':
        // refList.dynamicFormRef.value.setColShow(
        //   'loanproductcategory',
        //   props.formData[formInfo['colname']] !== '03'
        // )
        // refList.dynamicFormRef.value.setColShow(
        //   'gylloanproductcategory',
        //   props.formData[formInfo['colname']] !== '01'
        // )
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
      case 'vouchtypename': // 主要担保方式
        props.formData.vouchtype = item.key
        props.formData.vouchtypename = item.title
        break
      case 'ybjgreenfinancename': // 金监局绿色贷款
        props.formData.ybjgreenfinance = item.key
        props.formData.ybjgreenfinancename = item.title
        break
      case 'greenloansname': // 人行绿色贷款
        props.formData.greenloans = item.key
        props.formData.greenloansname = item.title
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
    loanproductcategory: () => props.formData['gylflag'] !== '03',

    // 供应链产品方案
    gylloanproductcategory: () => props.formData['gylflag'] !== '01',
    tlcode: () => false,
  }

  return {
    formSelectChange,
    formSelectInputClick,
    popConfirm,
    customVisible
  }
}
