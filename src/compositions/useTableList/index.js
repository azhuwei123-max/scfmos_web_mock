import { ref, reactive } from 'vue'
// import { debounce } from 'lodash-es'

/**
 * 表格分页取数通用函数
 * const { list, queryParams, loading, total, search, reSearch } = useTableList(api.getList, { customerId: '123123' })
 *
 * queryParams: 直接供页面取数参数绑定
 * search: 查询事件
 * reSearch: 重置事件
 * @param {*} apiFunc 表格取数api函数
 * @param {*} customPar 默认取数参数
 * @returns 
 */
export default function useTableList(apiFunc, customPar = {}, autoSearch = true) {
  const ApiFunc = apiFunc
  // 系统默认分页参数
  const org_queryParams = {
    pageSize: 20,
    pageNo: 1
  }

  // 自定义默认取数参数，不会随重置按钮而清空
  let customParams = customPar

  // 供外部调用：分页取数参数
  const queryParams = reactive({ ...org_queryParams, ...customParams })

  // 查询按钮事件
  const search = () => {
    queryParams.pageNo = 1
    getList()
  }

  // 重置按钮事件
  const reSearch = () => {
    const currentKeys = Object.keys(queryParams)
    const orgKeys = Object.keys({ ...org_queryParams, customParams })

    currentKeys.forEach((key) => {
      if (!orgKeys.includes(key)) {
        delete queryParams[key]
      }
    })

    Object.assign(queryParams, org_queryParams, customParams)

    search()
  }

  // 设置默认取数参数
  const setDefaultParams = (params) => {
    customParams = params
    Object.assign(queryParams, customParams)
  }

  const loading = ref(false)
  const list = ref([])
  const total = ref(0)
  const fetchList = (params) => {
    loading.value = true

    return ApiFunc({ ...queryParams, ...params }).then(res => {
      list.value = res.list || []
      total.value = res.total || list.value.length

      cback?.(list.value, res)
      return res
    }).finally(_ => loading.value = false)
  }
  
  const getList = fetchList

  const currentRow = ref()

  /**
   * 后期表单去除多选，但项目中表单项全是用数组去取值和赋值，现统一返回对象
   * @param {*} val 
   */
  const tableCurrentChange = (val) => {
    console.log('[ val ] >', val)
    val ? currentRow.value = val : ""
  }

  if (autoSearch) {
    getList()
  }

  let cback
  const fetchCback = (func) => {
    cback = func
  }

  const setCurrentRow = (val) => {
    currentRow.value  = val
  }

  return {
    list,
    total,
    loading,
    queryParams,
    getList,
    search,
    reSearch,
    setDefaultParams,
    currentRow,
    tableCurrentChange,
    fetchCback,
    setCurrentRow
  }
}
