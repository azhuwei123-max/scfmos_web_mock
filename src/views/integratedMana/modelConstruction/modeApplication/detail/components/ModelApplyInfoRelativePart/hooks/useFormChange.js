/**
 * 处理表单动态事件：change、blur等
 * @param {*} props
 */
export default function useFormChange(props, refList) {
  // 选择框change事件


  const formSelectChange = (formInfo) => {

    console.log('formInfo',formInfo);
    switch (formInfo['colname']) {
      case 'ProductName':
        // 控制指定控件显隐
        console.log(' props.formData.pelativeno ',props.formData)
        props.formData.pelativeno = props.formData.productname
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
      case 'greenloansname': // 人行绿色贷款
        props.formData.greenloans = item.key
        props.formData.greenloansname = item.title
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
    gylloanproductcategory: () => props.formData['gylflag'] !== '01',
    tlcode: () => false,
    discountrate: () => props.formData['issoftloan'] === 'Y',
    // 每笔出账业务不超过xx月字段   批复该字段为空，合同该字段不展示
  }

  return {
    formSelectChange,
    formSelectInputClick,
    popConfirm,
    customVisible
  }
}
