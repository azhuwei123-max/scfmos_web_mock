/**
 * 处理表单动态事件：change、blur等
 * @param {*} props
 */
export default function useFormChange(props, refList) {
  // 选择框change事件
  const formSelectChange = (formInfo) => {
    switch (formInfo['colname']) {
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
   * 自定义字段必录逻辑
   */
  const customRequired = {}

  /**
   * 自定义字段只读逻辑
   */
  const customReadonly = {
    rootbillissudt: () => true,
    rootbillnum: () => true,
    busstypename: () => true,
    subbillamt: () => true,
    certid: () => true,
    rootbillpaydt: () => true,
    subbillentnm: () => true,
    serialno: () => true,
    baserialno: () => true,
    corecustname: () => true,
    subbillnum: () => true,
    accountno: () => true,
    interestate: () => true,
    customerid: () => true,
    accountbankname: () => true,
    customername: () => true,
    rootbillissuamt: () => true,
    inputdate: () => true,
    channelid: () => true,
    status: () => true,
    factoringhandlingfeepayer: () => true,
    prepayinterestpayer: () => true,
  }

  return {
    formSelectChange,
    formSelectInputClick,
    popConfirm,
    customVisible,
    customRequired,
    customReadonly
  }
}
