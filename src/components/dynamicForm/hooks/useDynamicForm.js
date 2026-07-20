import { nextTick, watchEffect, defineEmits, computed } from 'vue'
import * as dynamicApi from '@/api/dynamicForm/index.js'
import chunk from 'lodash-es/chunk'
import { getDictOptions } from '@/utils/dict'
import { useOldDictStore } from '@/store/modules/oldDict'


export default function useDynamicForm(props, emit, refs) {
  const activeNames = ref([])

  const formRules = reactive({})

  const formList = reactive([])

  // 是否还在渲染当中
  const formRendering = ref(true)
  // 字典取数loading中
  const dictListLoading = ref(true)

  const { getDictFetch } = useOldDictStore()
  const getDictByCodes = (codes = []) => {
    return new Promise((resolve, rej) => {
      if (!codes?.length) return resolve()
  
      getDictFetch(codes).then((res) => {
        if (!res) return resolve()
  
        Object.assign(props.dictList, res)
        console.log('props.dictList',props.dictList);
        resolve()
      }).catch(rej)
    })
  }

  const getDictBySql = (list = []) => {
    return new Promise((resolve, rej) => {
      if (!list?.length) return resolve()

      dynamicApi.executeBatchSql(list).then((res) => {
        Object.assign(
          props.dictList,
          Object.fromEntries(Object.entries(res).map(([key, value]) => [`${key}source`, value]))
        )
        resolve()
      }).catch(rej)
    })
  }

  /**
   * 判断是否弹窗选择
   */
  const isEditStyleSelectInput = (formInfo) => {
    return formInfo.colunit?.includes('type=button') && formInfo.colunit?.includes('...')
  }

  /**
   * 设置必录
   * @param {*} formInfo
   * @param {*} bool 字段显隐状态
   */
  const setRequired = (formInfo, bool) => {
    const { colname } = formInfo
    if (bool) {
      if (!(colname in formRules)) {
        formRules[colname] = [
          { required: true, message: `${formInfo['colheader']} 必录`, trigger: 'change' }
        ]
      }
    } else {
      delete formRules[colname]
      refs.formRef?.value?.clearValidate(colname)
    }
  }

  /**
   * 重置unit字符串
   * 移除input、select
   * @param {*} unit
   * @returns
   */
  const resetUnit = (unit) => {
    if (!unit) return unit

    let newUnit = ''

    const findIndex = unit.indexOf('<input')
    if (findIndex > -1) {
      const findIndex2 = unit.indexOf('>', findIndex)
      if (findIndex2 > -1) {
        const InputStr = unit.substring(findIndex, findIndex2)
        // InputStr.indexOf('...') > -1 && InputStr.indexOf('type=button'
        newUnit = unit.slice(0, findIndex) + unit.slice(findIndex2 + 1)
      }

      return resetUnit(newUnit)
    }

    const findIndex3 = unit.indexOf('<select')
    if (findIndex3 > -1) {
      const findIndex4 = unit.indexOf('</select>', findIndex3)
      if (findIndex4 > -1) {
        const InputStr = unit.substring(findIndex3, findIndex4)
        newUnit = unit.slice(0, findIndex3) + unit.slice(findIndex4 + 9)
      }

      return resetUnit(newUnit)
    }
    return unit
  }

  /**
   * 通过自定义sql获取字典
   */
  const executeSql = (params) => {
    return dynamicApi.executeSql(params)
  }

  const precisionFormat = {
    整数: 0,
    数字: 2,
    利率: 6
  }

  /**
   * 获取组件类型
   * @param {*} forms
   * @returns
   */
  const getCompType = (forms) => {
    if (forms.compType) return forms.compType
    
    switch (forms['colcheckformat']) {
      case '日期':
        return 'date'
      case '利率':
      case '数字':
      case '整数':
        return 'number'
    }

    if (isEditStyleSelectInput(forms)) {
      return 'selectInput'
    }
    switch (forms['coleditstyle']) {
      case '选择框[多选]':
      case '扁平下拉选择':
      case '选择框':
        return 'select'
      case '高亮文本框':
      case '多行文本框':
      case '备注框':
        return 'textarea'
      case '复选框[优化只读显示]':
      case '复选框':
        return 'checkbox'
      case '横向单选框':
      case '纵向单选框':
      case '图片单选框[横向]':
      case '图片单选框[纵向]':
      case '单选框(横向)':
        return 'radio'
      case '文本框':
        return 'input'
    }
  }

  const checkForm = (v) => {
    // 暂时没有很好的办法解决动态控件显隐的办法
    // 能做到显示时实时push模板，隐藏时splice模板效果最佳。但push到第几位较难控制
    // if (v['colvisible'] !== '1') return

    // 查找dock归属
    const findDock = formList.find((v2) => v2['dockid'] === v['dockid'])
    if (!findDock && props.dockList?.length) return

    // 与后端约定所有key均为小写
    v.colname = v['colname']?.toLocaleLowerCase() || ''

    const forms = {
      ...v,
      colreadonly: ref(v['colreadonly']),
      colSpan: v['colspan'] == 12 ? 24 : 12,
      formItemClass: v['colspan'] == 12 ? '!w-1/2' : '!w-1/1', // 不知道为什么!w-1/2不生效
      formItemStyle: v['formItemStyle'] ? v['formItemStyle'] : v['colspan'] == 12 ? 'calc(50% - 5px)' : '100%',
      precision: precisionFormat[v['colcheckformat']],
      newcolunit: resetUnit(v['colunit']),
      // newcolunit: v['colunit'],
      compType: getCompType(v) // 标记组件类型
    }

    if (forms['colname'] in props.customReadonly) {
      forms['customreadonly'] = props.customReadonly[forms['colname']]
    } else {
      forms['customreadonly'] = () => unref(forms['colreadonly']) === '1'
    }

    if (forms['colname'] in props.customVisible) {
      forms['customvisible'] = props.customVisible[forms['colname']]
    } else {
      forms['customvisible'] = () => forms['colvisible'] === '1'
    }

    if (forms['colname'] in props.customRequired) {
      forms['customrequired'] = props.customRequired[forms['colname']]
    } else {
      forms['customrequired'] = () => forms['colrequired'] === '1'
    }

    // 只读属性
    forms.iscolreadonly = computed(forms['customreadonly'])

    // 显隐
    forms.iscolvisible = computed(forms['customvisible']),

    // 必录计算属性
    forms.iscolrequired = computed(() => {
      const required = forms['iscolvisible'] && forms['customrequired']()
      setRequired(forms, required)
      return required
    })

    // 将处理后的表单配置添加到集合中
    if (props.dockList?.length) {
      if (findDock) {
        findDock.forms.push({ ...forms, slotName: forms['colname'] })
      } else {
        return
      }
    } else {
      formList.push({ ...forms, slotName: forms['colname'] })
    }
  }

  /**
   * 获取动态字典
   */
  const getDynamicDict = (list) => {
    const dictFromSqlList = []
    const dictCodeList = new Set()

    list.forEach((v) => {
      // 与后端约定所有key均为小写
      v.colname = v['colname']?.toLocaleLowerCase() || ''

      // 数据源处理
      switch (v['coleditsourcetype']) {
        case 'Code': // 获取信贷系统中的字典
          if (v['coleditsource']) {
            dictCodeList.add(v['coleditsource'])
            v['coldictkey'] = v['coleditsource']
          }
          break
        case 'NewCode': // 获取作业系统中的字典
          if (v['coleditsource']) {
            props.dictList[`newcode_${v['coleditsource']}`] = getDictOptions(v['coleditsource'])
            v['coldictkey'] = `newcode_${v['coleditsource']}`
          }
          break
        case 'JSON':
          if (v['coleditsource']) {
            props.dictList[`${v['colname']}source`] = JSON.parse(v['coleditsource'])
            v['coldictkey'] = `${v['colname']}source`
          }
          break
        case 'SQL': // 查询信贷系统的sql
          if (v['coleditsource']) {
            dictFromSqlList.push({
              dono: v['dono'],
              colindex: v['colindex'],
              colname: v['colname']
            })
            v['coldictkey'] = `${v['colname']}source`
          }
          break
        default:
          break
      }
    })

    Promise.all([getDictByCodes([...dictCodeList]), getDictBySql(dictFromSqlList)]).then(res => {
      dictListLoading.value = false
    })
  }

  /**
   * 处理表单模板配置
   */
  const setForm = async (list) => {
    const start = Date.now()
    if (props.dockList?.length) {
      formList.push(...props.dockList.map((v) => ({ ...v, forms: [], slotName: v.dockid })))
      // 默认展开所有模块
      activeNames.value = formList.map((v) => v.dockid)
    }

    formRendering.value = true

    // 获取字典
    getDynamicDict(list)

    // 优化渲染-表单切片
    // const listSlice = chunk(list, 3)

    // for (const list of listSlice) {
    //   list.forEach((v) => {
    //     checkForm(v)
    //   })

    //   if (props.optimize) {
    //     await newNextTick()
    //   }
    // }

    if (props.optimize) {
      // 更加精准的渲染策略
      runTask(list, 3)
    } else {
      list.forEach(v => {
        checkForm(v)
      })
    }

    // console.log('耗时', Date.now() - start)
  }

  /**
   * 优化切片渲染的等待机制
   * 纯nextTick依旧会阻塞渲染
   */
  const newNextTick = () => {
    return new Promise((res) => {
      requestAnimationFrame(() => {
        setTimeout(res, 5)
        // res()
      })
    })
  }

  /**
   * 精准渲染优化策略
   * @param {*} list
   * @param {*} chunkSize
   */
  const runTask = (list, chunkSize) => {
    let index = 0
    const start1 = Date.now()

    async function processChunk(startTime) {
      const start = startTime || Date.now()

      const end = Math.min(index + chunkSize, list.length)
      for (let i = index; i < end; i++) {
        checkForm(list[i])
      }

      await nextTick()

      index = end

      const processingTime = Date.now() - start

      if (index < list.length) {
        if (processingTime < 16) {
          processChunk(start)
        } else {
          setTimeout(() => {
            requestAnimationFrame(() => processChunk())
          }, 0)
        }
      } else {
        formRendering.value = false
        emit('renderFinished')
      }
    }

    requestAnimationFrame(() => processChunk())
  }

  const stopEffect = watchEffect(() => {
    if (props.formTempList.length) {
      setForm(props.formTempList)

      nextTick(() => {
        stopEffect()
      })
    }
  })

  return {
    activeNames,
    formRules,
    formList,
    formRendering,
    dictListLoading
  }
}
