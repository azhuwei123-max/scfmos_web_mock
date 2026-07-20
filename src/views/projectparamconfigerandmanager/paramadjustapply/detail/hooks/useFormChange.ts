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
      case 'jcmodelno':
        // 控制指定控件显隐
        if (props.formData[formInfo['colname']] == 'XPP001') {
          props.formData.decisionpersontype = 'Person'
        }
        break
      case 'dzhtmodelno':
         props.formData.dzhtsubdescribe = ''
        break
      default:
        break
    }
  }

  // 点击打开弹窗事件
  const formSelectInputClick = (formInfo) => {
    refList.mapRefs.value[`select${formInfo.colname}InputRef`].open(formInfo)
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
    //电子合同模板（DZHTModelNo）为Azt0010（个人最高额贷款合同），展示电子合同补充条款（DZHTSubDescribe）
    dzhtsubdescribe: () => props.formData['dzhtmodelno'] === 'Azt0010',
  }

  /**
   * 自定义字段必录逻辑
   */
  const customRequired = {
    jcmodelno: () => props.formData['isautojudge'] == '1',
    decisionpersontype: () => props.formData['isautojudge'] == '1',
    putoutjcmodelno: () => props.formData['isopenputoutmodel'] == '1',
    guarantycountrule: () => props.formData['guarantycountrange'] == '1' || props.formData['guarantycountrange'] == '3',
    guarantycountruleforbp: () => props.formData['guarantycountrange'] == '2' || props.formData['guarantycountrange'] == '3',
    guarantyaccountno: () => props.formData['guarantycountrange'] == '2',
    contractjcmodelno: () => props.formData['iscontractautojudge'] == '1',
    iszxentquery:()=> props.formData['iscontractautojudge'] == 'JXSFK001'||props.formData['iscontractautojudge'] == 'MFXDFK001'||props.formData['iscontractautojudge'] == 'JXSFK001' ||
      props.formData['iscontractautojudge'] == 'MFXDFK001' || props.formData['contractjcmodelno'],
    rzdbcustomername:()=> props.formData['hascreditlineguarantee'] == '1',
    jgfcustomername:()=> props.formData['isconnregulator'] == '1',
  }
  
  return {
    formSelectChange,
    formSelectInputClick,
    customVisible,
    customRequired
  }
}
