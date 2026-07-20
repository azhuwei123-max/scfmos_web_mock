/**
 * 处理表单动态事件：change、blur等
 * @param {*} props
 */
export default function useFormChange(props, refList) {
  // 选择框change事件
  const formSelectChange = (formInfo) => {
    switch (formInfo['colname']) {
      case 'nraflag':
        // 控制指定控件显隐
        if (props.formData[formInfo['colname']] == '1') {
          refList.dynamicFormRef.value.showColumnByColName('brizefname')
        } else {
          refList.dynamicFormRef.value.hideColumnByColName('brizefname')
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
      case 'directionname': // 贷款投向
        props.formData.direction = item.key
        props.formData.directionname = item.title
        break
      case 'farmingtypename': // 支农分类
        props.formData.farmingtype = item.key
        props.formData.farmingtypename = item.title
        break
      case 'ybjgreenfinancename': // 金监局绿色贷款
        props.formData.ybjgreenfinance = item.key
        props.formData.ybjgreenfinancename = item.title
        break
      case 'rhgreenloanname': // 人行绿色贷款
        props.formData.rhgreenloan = item.key
        props.formData.rhgreenloanname = item.title
        break
      case 'vouchtypename': // 主要担保方式
        props.formData.vouchtype = item.key
        props.formData.vouchtypename = item.title
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
    // 通路代码
    tlcode: () => props.formData['loanproductcategory'] === '19',
    // 供应链产品方案
    gylloanproductcategory: () => props.formData['gylflag'] !== '01',
  }

  return {
    formSelectChange,
    formSelectInputClick,
    popConfirm,
    customVisible
  }
}
