import request from '@/config/axios'

// 信贷用户 VO
export interface UserVO {
  id: number // 编号
  appId: string // appId
  appSecret: string // appSecret
  mobile: string // 联系人手机号
  status: number // 状态
  entName: string // 企业名称
  mark: string // 备注
}

// 信贷用户 API
export const UserApi = {
  // 查询信贷用户分页
  getUserPage: async (params: any) => {
    return await request.get({ url: `/credit/user/page`, params })
  },

  // 查询信贷用户详情
  getUser: async (id: number) => {
    return await request.get({ url: `/credit/user/get?id=` + id })
  },

  // 新增信贷用户
  createUser: async (data: UserVO) => {
    return await request.post({ url: `/credit/user/create`, data })
  },

  // 修改信贷用户
  updateUser: async (data: UserVO) => {
    return await request.put({ url: `/credit/user/update`, data })
  },

  // 删除信贷用户
  deleteUser: async (id: number) => {
    return await request.delete({ url: `/credit/user/delete?id=` + id })
  },

  // 导出信贷用户 Excel
  exportUser: async (params) => {
    return await request.download({ url: `/credit/user/export-excel`, params })
  }
}