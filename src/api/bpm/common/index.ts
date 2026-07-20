import request from "@/config/axios";


export type CommonSubmitVo = {
  serialNo: string
  key: string
  paramsMap?:Record<string,unknown>
  startUserSelectAssignees?:Record<string,number[]>
}

// 创建工作流的表单定义
export const submit = async (data: CommonSubmitVo) => {
  return await request.post({
    url: '/bpm/common/submit',
    data: data
  })
}
