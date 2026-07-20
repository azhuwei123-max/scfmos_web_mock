import request from '@/config/axios'

// 信贷接口 VO
export interface InterfaceVO {
  id: number // 接口ID
  name: string // 接口名称
  interfaceNo: string // 接口编号
  permission: string // 权限标识
  type: number // 接口分类类型
  sort: number // 显示顺序
  status: number // 接口状态
}

// 信贷接口 API
export const InterfaceApi = {
  // 查询信贷接口分页
  getInterfacePage: async (params: any) => {
    return await request.get({ url: `/credit/interface/page`, params })
  },

  // 查询信贷接口详情
  getInterface: async (id: number) => {
    return await request.get({ url: `/credit/interface/get?id=` + id })
  },

  // 新增信贷接口
  createInterface: async (data: InterfaceVO) => {
    return await request.post({ url: `/credit/interface/create`, data })
  },

  // 修改信贷接口
  updateInterface: async (data: InterfaceVO) => {
    return await request.put({ url: `/credit/interface/update`, data })
  },

  // 删除信贷接口
  deleteInterface: async (id: number) => {
    return await request.delete({ url: `/credit/interface/delete?id=` + id })
  },

  // 导出信贷接口 Excel
  exportInterface: async (params) => {
    return await request.download({ url: `/credit/interface/export-excel`, params })
  }
}