/**
 * 表单模板操作函数
 * @param {*} props
 * @returns
 */
export default function useFormOpereator(props) {
  /**
   * 控制显示某个模块
   * @param string dockid
   * @param bool hidden
   */
  const hiddenDock = (dockid,hidden) => {
    const dock = props.formList.find(f => f.dockid === dockid)
    if(dock) {
      dock.isHidden = hidden
    }
  }
  /**
   * 显示控件
   * @param {*} colname
   * @returns
   */
  const showColumnByColName = (colname) => {
    const findCol = findTempByColname(colname)
    if (!findCol) {
      console.error('未找到该字段')
      return
    }

    findCol['colvisible'] = '1'
    // findCol['iscolvisible'] = true
  }

  const hideColumnByColName = (colname) => {
    const findCol = findTempByColname(colname)
    if (!findCol) {
      console.error('未找到该字段')
      return
    }

    findCol['colvisible'] = '0'
    // findCol['iscolvisible'] = false
  }

  /**
   * 获取字段模板
   * @param {*} colname
   * @returns
   */
  const findTempByColname = (colname) => {
    return findTempByCustom((v) => v.colname === colname)
  }

  /**
   * 自定义找模板函数
   * @param {*} func
   * @returns
   */
  const findTempByCustom = (func) => {
    if (!props.formList?.length) return

    // 通过判断一维数组是否含有dockid来判断是否为复杂模板
    if (props.formList[0].dockid) {
      for (const map of props.formList) {
        const findMap = map.forms.find(func)
        if (findMap) {
          return findMap
        }
      }
    } else {
      return props.formList.find(func)
    }
  }

  /**
   * 自定义获取批量模板
   * @param {*} func
   * @returns
   */
  const filterTempListByCustom = (func) => {
    if (!props.formList?.length) return []

    const returnList = []
    // 通过判断一维数组是否含有dockid来判断是否为复杂模板
    if (props.formList[0].dockid) {
      const filterList = props.formList.flatMap((v) => v.forms).filter(func)

      if (filterList.length) returnList.push(...filterList)
    } else {
      const filterList = props.formList.filter(func)
      if (filterList.length) returnList.push(...filterList)
    }

    return returnList
  }

  /**
   * 查找目标字段
   *  在渲染中也可以调用，返回promise
   * @param {*} colname
   * @returns
   */
  const findColComputed = (colname) => {
    return new Promise((res) => {
      const findTemp = findTempByColname(colname)

      if (findTemp) return res(findTemp)

      // 已经渲染完毕
      if (!props.formRendering.value) return res()

      // 没渲染完也没找到，就开始监听
      const stopEffect = watchEffect(() => {
        const findTemp = findTempByColname(colname)

        if (findTemp) {
          res(findTemp)
          stopEffect()
          return
        }

        nextTick(() => {
          // 渲染完毕无需监听
          if (!props.formRendering.value) {
            res()
            stopEffect()
          }
        })
      })
    })
  }

  /**
   * 修改显隐
   *  formRef.value.setColShow('customerid', false)
   * @param {*} colname
   * @param {*} bool
   * @returns
   */
  const setColShow = (colname, bool = true) => {
    const findCol = findTempByColname(colname)
    if (!findCol) {
      console.error('未找到该字段')
      return
    }

    findCol['colvisible'] = bool ? '1' : '0'
    // findCol['iscolvisible'] = bool

    // 隐藏后清空值
    if (findCol['compType'] === 'checkbox') {
      props.formData[colname] = []
    } else {
      props.formData[colname] = ''
    }

    // 显隐后要刷新必录
    if (findCol['colrequired'] === '1') {
      setColRequired(colname, bool)
    }
  }

  /**
   * 修改必录
   *  formRef.value.setColRequired('customerid', false)
   * @param {*} colname
   * @param {*} bool
   * @returns
   */
  const setColRequired = (colname, bool = true) => {
    const findCol = findTempByColname(colname)
    if (!findCol) {
      console.error('未找到该字段')
      return
    }

    if (bool && findCol['iscolvisible']) {
      if (!(colname in props.formRules)) {
        props.formRules[colname] = [
          { required: true, message: `${v['colheader']} 必录`, trigger: 'change' }
        ]
      }
    } else {
      delete props.formRules[colname]
    }
  }

  /**
   * 设置字段是否只读
   * @param {*} colname 
   * @param {*} isRead 
   * @returns 
   */
  const setColReadonly = async (colname, isRead) => {
    const findTemp = await findColComputed(colname)
    if (!findTemp) return

    findTemp['colreadonly'] = isRead ? '1' : '0'
  }

  /**
   * 修改某个属性值（通用）
   *  formRef.value.setColAttr('customer', 'collimit', 15)
   * @param {*} colname customerid
   * @param {*} attr 'collimit'
   * @param {*} val 15
   * @returns
   */
  const setColAttr = (colname, attr, val) => {
    const findCol = findTempByColname(colname)
    if (!findCol) {
      console.error('未找到该字段')
      return
    }

    findCol[attr] = val
  }

  /**
   * 修复formData数据到能保存的格式
   *  包含逻辑如下：
   *     复选框转字符串
   * @returns
   */
  const formDataFixToSave = () => {
    const params = { ...props.formData }

    const filterList = filterTempListByCustom((v) => v?.compType === 'checkbox')

    filterList.forEach((v) => {
      if (typeof params[v['colname']] === 'string') return

      params[v['colname']] = params[v['colname']]?.filter((v) => v).join(',') ?? ''
    })

    return params
  }

  /**
   * 修复formData数据到能展示的格式；一般在取数函数回调中使用
   *  包含逻辑如下：
   *     复选框转字符串
   * @returns
   */
  const formDataFixToShow = (data, immediate) => {
    const params = { ...(data || props.formData) }

    const filterList = filterTempListByCustom((v) => v?.compType === 'checkbox')

    filterList.forEach((v) => {
      if (params[v['colname']] && typeof params[v['colname']] === 'object') return

      if (immediate) {
        props.formData[v['colname']] = props.formData[v['colname']]?.split(',') ?? []
      } else {
        params[v['colname']] = params[v['colname']]?.split(',') ?? []
      }
    })

    return params
  }

  const setCustomVisible = (colname, comput) => {}

  /**
   * 判断字段显隐状态
   * @param {*} colname
   * @returns
   */
  const checkVisibleByCol = (colname) => {
    return new Promise((resolve) => {
      const findCol = findTempByColname(colname)
      if (findCol) {
        resolve(findCol['iscolvisible'])
        return
      }
    })
  }

  /**
   * 监听配置表单变化，作数据操作
   */
  const stop = watch(props.formList, () => {
    formDataFixToShow(props.formData, true)

    // 若表单已经渲染完毕，则不在监听
    nextTick(() => {
      if (!props.formRendering.value) {
        stop()
      }
    })
  })

  const getDictList = () => {
    return props.dictList
  }

  const setDictByName = (name, value) => {
    props.dictList[name] = value
  }

  return {
    dictListLoading: props.dictListLoading,

    showColumnByColName,
    hideColumnByColName,
    setColShow,
    setColAttr,
    setColRequired,
    formDataFixToSave,
    formDataFixToShow,
    checkVisibleByCol,
    findColComputed,
    setColReadonly,
    hiddenDock,
    getDictList,
    setDictByName,
  }
}
