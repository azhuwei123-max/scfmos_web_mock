import { useRoute } from 'vue-router'

/**
 * 处理表单动态事件：change、blur等
 * @param {*} props
 */
export default function useFormChange(props, refList) {
  // input change事件
  const formInputChange = (formInfo) => {
    const val = props.formData[formInfo['colname']]
    switch (formInfo['colname']) {
      default:
        break
    }
  }

  // 选择框change事件
  const formSelectChange = (formInfo) => {
    const val = props.formData[formInfo['colname']]
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

  const route = useRoute()

  /**
   * 自定义字段显隐逻辑
   */
  const customVisible = {
    // 合作商列表。美团不展示
    partenterlist: () => !route.query.fromPage?.startsWith('60')
  }

  /**
   * 自定义字段显隐逻辑
   */
  const customReadonly = {
  }

  return {
    formInputChange,
    formSelectChange,
    formSelectInputClick,
    popConfirm,
    customVisible,
    customReadonly
  }
}
