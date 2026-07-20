import request from '@/config/axios'

// 信贷角色信息 VO
export interface RoleVO {
  id: number // 角色ID
  name: string // 角色名称
  code: string // 角色权限字符串
  sort: number // 显示顺序
  status: number // 角色状态（0正常 1停用）
  type: number // 角色类型
  remark: string // 备注
}

// 信贷角色信息 API
export const RoleApi = {
  // 查询信贷角色信息分页
  getRolePage: async (params: any) => {
    return await request.get({ url: `/credit/role/page`, params })
  },

  // 查询信贷角色信息详情
  getRole: async (id: number) => {
    return await request.get({ url: `/credit/role/get?id=` + id })
  },

  // 新增信贷角色信息
  createRole: async (data: RoleVO) => {
    return await request.post({ url: `/credit/role/create`, data })
  },

  // 修改信贷角色信息
  updateRole: async (data: RoleVO) => {
    return await request.put({ url: `/credit/role/update`, data })
  },

  // 删除信贷角色信息
  deleteRole: async (id: number) => {
    return await request.delete({ url: `/credit/role/delete?id=` + id })
  },

  // 导出信贷角色信息 Excel
  exportRole: async (params) => {
    return await request.download({ url: `/credit/role/export-excel`, params })
  }
}