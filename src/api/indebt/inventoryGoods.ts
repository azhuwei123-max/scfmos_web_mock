import request from '@/config/axios'

export interface InventoryGoodsQuery {
  pageNo?: number
  pageSize?: number
  largeCategoryCode?: string
  largeCategoryName?: string
  status?: string
}

export interface InventoryGoodsForm {
  largeCategoryCode: string
  largeCategoryName: string
  middleCategoryCode: string
  middleCategoryName: string
  smallCategoryCode: string
  smallCategoryName: string
  remark?: string
}

export interface InventoryGoodsRecord extends InventoryGoodsForm {
  id: number
  status: '启用' | '历史'
  maintainTime: string
  maintainer: string
}

export interface InventoryGoodsPageResult {
  total: number
  list: InventoryGoodsRecord[]
  records: InventoryGoodsRecord[]
  pageNo: number
  pageSize: number
}

export const getInventoryGoodsPage = (params: InventoryGoodsQuery) =>
  request.get<InventoryGoodsPageResult>({ url: '/system/indebt/inventory-goods/page', params })

/** 获取所有启用状态的商品分类，供品类思维导图使用，不受列表分页和筛选影响。 */
export const getActiveInventoryGoods = () =>
  request.get<InventoryGoodsRecord[]>({ url: '/system/indebt/inventory-goods/active-list' })

export const createInventoryGoods = (data: InventoryGoodsForm) =>
  request.post<InventoryGoodsRecord>({ url: '/system/indebt/inventory-goods/create', data })

export const setInventoryGoodsHistory = (ids: number[]) =>
  request.put<{ updated: number }>({ url: '/system/indebt/inventory-goods/history', data: { ids } })
