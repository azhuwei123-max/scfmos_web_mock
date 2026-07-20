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
      case 'loanproductcategory':
        console.log('props',props.formData.tlcode,props.formData.loanproductcategory,props.formData);
        if (props.formData[formInfo['colname']] !== '19') {
          props.formData.tlcode = ''
        }
        break
      case 'gylflag':
        if (props.formData[formInfo['colname']] == '03') {
          props.formData.loanproductcategory = ''
        }
        break
      default:
        break
    }
  }

  // 点击打开弹窗事件
  const formSelectInputClick = (formInfo) => {

    if(formInfo.colname === 'artificialno') {

      if(!props.formData.cycleflag) {
        message.warning('‘是否循环’字段未输入，不能生成文本合同编号！')
        return
      }
      Api.artificialNo({
        serialno: props.formData.serialno,
        businesstype: props.formData.businesstype,
        cycleflag: props.formData.cycleflag
      }).then((res) => {
        props.formData.artificialno = res
      })
      return
    }

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
 //显隐金监局绿色贷款 &&人行绿色贷款 
 const showYbjgreenfinancename  = (formData) => {
  if(!['1110010','1110020','1110130','1110135','1110180'].includes(route.query.businessType)){
    if(props.params.greenTypes.value?.indexOf(","+(route.query.businessType || route.query.businesstype)+",") != -1){
      if(!props.formData.isgreenfinance || ['2', ' '].includes(props.formData.isgreenfinance)){
         return false;
      }
    }
  }
  return true;
}

//显隐 所属绿色产业 &&所属产业二级目录 &&  所属产业三级目录
// const showGreenPropertyBelong  = (formData) => {
//   if(!['1110010','1110020','1110130','1110135','1110180'].includes(route.query.businessType)){
//     if(props.params.greenTypes.value?.indexOf(","+route.query.businessType+",") == -1){
//       if(!props.formData.isgreenfinance || ['2', ' '].includes(props.formData.isgreenfinance)){
//          return false;
//       }
//     }
//   }
//   return true;
// }

  /**
   * 自定义字段显隐逻辑
   */
  const customVisible = {
     // 信贷产品方案
     loanproductcategory: () => props.formData['gylflag'] !== '03',
     
    // 供应链产品方案显隐控制
    gylloanproductcategory:() => props.formData['gylflag'] !== '01',
    // 信贷产品方案显隐控制
    // loanproductcategory:() => props.formData['gylflag'] == '01',
    // 金监局绿色贷款
    ybjgreenfinancename:() => showYbjgreenfinancename(props.formData),
    // 人行绿色贷款
    rhgreenloanname:() => showYbjgreenfinancename(props.formData),
     // 所属绿色产业 海哥说直接不展示
    greenpropertybelong:() => false,
     // 所属产业二级目录 海哥说直接不展示
    greenbelongsecondleavel:() => false,
    // 所属产业三级目录 海哥说直接不展示
    greenbelongthirdlevel:() => false,
    // 通路代码 海哥说直接不展示
    tlcode:() => props.formData['loanproductcategory'] == '19',
    
    //操作模式 供应链间接额度 展示
    vouchtype:() =>  {
      const visible = '3030030' == route.query.businessType
      // refList.dynamicFormRef.value.setRequired('vouchtype',visible)
      return visible
    },
    
  }

  /**
   * 自定义字段只读逻辑
   */
  const customReadonly = {
    // 供应链标识
    gylflag: () => ['3030030', '3030070'].includes(props.formData['businesstype']),
    boursename:() => props.formData['listingcorpornot'] == '2'
  }
  

  const customRequired = {
    vouchtype: () => '3030030' == route.query.businessType,
    loanratetermid: () => ['1010010','1110170'].includes(route.query.businessType),
    rpttermid: () => ['1010010','1110170'].includes(route.query.businessType),
    tlcode:() => props.formData['loanproductcategory'] == '19',
    boursename:() => props.formData['listingcorpornot'] != '2'
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
