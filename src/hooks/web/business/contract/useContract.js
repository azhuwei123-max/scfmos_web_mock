import * as Api from './api.js'
export default function useContract(params) {

  const check = (params) =>{
    return new Promise((resolve,rejects)=>{
      ElMessageBox.confirm(
        params.title,
        '确定',
        {
          distinguishCancelAndClose:true,
          confirmButtonText:'确定',
          cancelButtonText:'取消'
        }
      ).then(() => {
        resolve('confirm')
      }).catch((action) => {
         action === 'cancel'? resolve('cancel'):resolve('close')
      })
    })

  }
  /**判断保存时页签是否需要触发覆盖弹窗 */
const checkTab = (params) =>{
  //确认后不需要再提示弹窗，信贷自动会保存多合一的签署意见
  // if ('CreditContractFlow' == params.flowNo && '签署额度合同意见' == params.tabValue) {
  //   return true
  // }
  // if ('BusinessContract' == params.flowNo && '签署业务合同意见' == params.tabValue) {
  //   return true
  // }
  return false
}

  const queryDataAndMakeSaveParam = async(params) =>{

 // const saveParams = {
  //   ...tabData,
  //   businessId,
  //   objectType,
  //   "ftSerialNo": taskVo?.serialNo
  // }
  // if ('CreditContractFlow' == flowNo) {
    //额度合同获取业务合同，业务合同获取出账 公用此接口
    const busiCon =  await Api.getBusiConByCreditCon(
      {"objectNo":params.businessId,
       "phaseNo":params.phaseNo,
       "flowNo" :params.flowNo
      })
   
      if (busiCon != null && busiCon.length > 0 && checkTab(params)) {
         //判断是多合一
         const checkResult = await check(params)
   
         if (checkResult === 'confirm') { //用户点击确定按钮
          params.override = '1'
         }else if(checkResult === 'close'){ //用户点击右上角xx
             return;
         }else if(checkResult === 'cancel'){ //用户点击取消，调用接口走不覆盖逻辑
   
         }
        
      }
   // }
   return params
  }
 

  return {
    queryDataAndMakeSaveParam
  }
}


