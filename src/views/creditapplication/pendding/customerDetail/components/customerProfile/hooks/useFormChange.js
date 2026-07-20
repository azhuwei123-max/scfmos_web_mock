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
      case 'orgtypename': // 控股类型
        props.formData.orgtype = item.key
        props.formData.orgtypename = item.title
        break
      case 'surplusindustryname': // 是否两高一剩行业
        props.formData.surplusindustry = item.key
        props.formData.surplusindustryname = item.title
        break
      case 'supercorpname': // 上级公司名称
        props.formData.supercorp = item.customerID
        props.formData.supercorpname = item.customerName
        break
      case 'countrycodename': // 所在国家
        props.formData.countrycode = item.key
        props.formData.countrycodename = item.title
        break
      case 'regioncodename': // 注册省市区
        props.formData.regioncode = item.key
        props.formData.regioncodename = item.title
        break
      case 'officeaddcodename': // 办公省市区
        props.formData.officeaddcode = item.key
        props.formData.officeaddcodename = item.title
        break
      case 'ybjgreenfinancename': // 金监局绿色贷款
        props.formData.ybjgreenfinance = item.key
        props.formData.ybjgreenfinancename = item.title
        break
      case 'rhgreenloanname': // 人行绿色贷款
        props.formData.rhgreenloan = item.key
        props.formData.rhgreenloanname = item.title
        break
       case 'vouchtypename': // 人行绿色贷款
        props.formData.vouchtype = item.key
        props.formData.vouchtypename = item.title
        break
        case 'farmingtypename': // 支农分类
        props.formData.farmingtype = item.key
        props.formData.farmingtypename = item.title
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

  return {
    formSelectChange,
    formSelectInputClick,
    popConfirm,
    customVisible
  }
}
