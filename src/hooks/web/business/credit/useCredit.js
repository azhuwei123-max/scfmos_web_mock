import * as Api from './api.js'
export default function useCredit(params) {

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


  const queryDataAndMakeSaveParam = async(params) =>{
    const res =  await Api.getPreLoanAssetRiskClass(
      {"objectNo":params.objectNo,
       "customerId":params.customerID,
      })
      params.title = `该业务${res}您是否一并同意?`
      const returnParam = {}
      if (res) {
         const checkResult = await check(params)
   
         if (checkResult === 'confirm') { //用户点击确定按钮
          returnParam.isConfirm = '1'
         }else if(checkResult === 'close'){ //用户点击右上角xx
          returnParam.isConfirm = '0'
         }else if(checkResult === 'cancel'){ //用户点击取消，调用接口走不覆盖逻辑
          returnParam.isConfirm = '2'
         }
        
      }else{
        return {}
      }
   // }
   return returnParam
  }
 

  return {
    queryDataAndMakeSaveParam
  }
}


