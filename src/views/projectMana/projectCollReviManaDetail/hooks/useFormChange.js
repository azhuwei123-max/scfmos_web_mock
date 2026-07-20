import { useRoute } from 'vue-router'
import useDynamicHelper from '@/components/dynamicForm/hooks/useDynamicHelper.js'

/**
 * 处理表单动态事件：change、blur等
 * @param {*} props
 */
export default function useFormChange(props, refList) {
  const { dictListComputed } = useDynamicHelper(refList.dynamicFormRef)

  // input change事件
  const formInputChange = (formInfo) => {
    const val = props.formData[formInfo['colname']]
    switch (formInfo['colname']) {
      case 'recommendnum': // 链属企业推荐户数
      case 'searchnum': // 调查联系户数
        // 只能输入数字及/
        props.formData[formInfo['colname']] = val.replace(/[^\d/]/g, '')
        break
      default:
        break
    }
  }

  // 选择框change事件
  const formSelectChange = (formInfo) => {
    const val = props.formData[formInfo['colname']]
    switch (formInfo['colname']) {
      case 'recommendwill':
        if (val === '1') {
          props.formData['noreason'] = ''
        }
        break
      case 'loanproductcategory': // 产品方案
        dictListComputed((dictList, setDictByName) => {
          dictList['GYLLoanProductCategory'].forEach(v => {
            if (v['itemNo'] === 'GYL13') {
              v.disabled = val?.includes('GYL04') ?? false
            } else if (v['itemNo'] === 'GYL04') {
              v.disabled = val?.includes('GYL13') ?? false
            }
          })
        })
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
    // 如否，请简述原因
    noreason: () => props.formData['recommendwill'] === '2'
  }

  const route = useRoute()

  /**
   * 自定义字段显隐逻辑
   */
  const customReadonly = {
    // 如否，请简述原因
    projectname: () => route.query.readonly === '1' || props.formData['coreviewmethod'] == '02',
    channelsource: () => route.query.readonly === '1',
    industrytype: () => route.query.readonly === '1',
    // gylflag: () => route.query.readonly === '1',
    loanproductcategory: () => route.query.readonly === '1',
    branchaccess: () => route.query.readonly === '1',
    // coreviewtype: () => route.query.readonly === '1',
    // coreviewmethod: () => route.query.readonly === '1',
    // branchname: () => route.query.readonly === '1',
    // inputorgid: () => route.query.readonly === '1',
    businesssum: () => route.query.readonly === '1',
    exposuresum: () => route.query.readonly === '1',
    remark: () => route.query.readonly === '1',
    scenename: () => route.query.readonly === '1',
    recommendwill: () => route.query.readonly === '1',
    noreason: () => route.query.readonly === '1',
    recommendnum: () => route.query.readonly === '1',
    searchnum: () => route.query.readonly === '1',
    spcsentname: () => route.query.readonly === '1',
    spcsentremark: () => route.query.readonly === '1',
    spcsentrecommend: () => route.query.readonly === '1',
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
