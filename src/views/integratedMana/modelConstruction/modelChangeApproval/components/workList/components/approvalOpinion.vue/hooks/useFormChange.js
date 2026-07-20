import { useRoute } from 'vue-router'

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
  }

  const route = useRoute()

  /**
   * 自定义字段显隐逻辑
   */
  const customReadonly = {
    // 如否，请简述原因
    projectname: () => true,
    channelsource: () => true,
    industrytype: () => true,
    // gylflag: () => true,
    loanproductcategory: () => true,
    branchaccess: () => true,
    // coreviewtype: () => true,
    // coreviewmethod: () => true,
    branchname: () => true,
    inputorgid: () => true,
    businesssum: () => true,
    exposuresum: () => true,
    remark: () => true,
    scenename: () => true,
    recommendwill: () => true,
    noreason: () => true,
    recommendnum: () => true,
    searchnum: () => true,
    spcsentname: () => true,
    spcsentremark: () => true,
    spcsentrecommend: () => true,
  }

  return {
    formSelectChange,
    formSelectInputClick,
    popConfirm,
    customVisible,
    customReadonly
  }
}
