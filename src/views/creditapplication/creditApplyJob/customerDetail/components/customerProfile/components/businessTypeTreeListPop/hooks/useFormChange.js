import { useRoute } from 'vue-router'
import * as Api
  from "@/views/creditapplication/pendding/peddingDetail/components/customerProfile/api";

/**
 * 处理表单动态事件：change、blur等
 * @param {*} props
 */
export default function useFormChange(props, refList) {
  const route = useRoute()

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
      case 'businesstypename': // 控股类型
        props.formData.businesstype = item.key
        props.formData.businesstypename = item.title
        break
      default:
        break
    }
  }




  /**
   * 自定义字段显隐逻辑
   */
  const customVisible = {


  }
  

  const customRequired = {
  
  }
 

  

  return {
    formSelectChange,
    formSelectInputClick,
    popConfirm,
    customVisible,
    customRequired
  }
}
