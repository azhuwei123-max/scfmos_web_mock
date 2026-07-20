import { defineStore } from 'pinia'
import { useCache } from '@/hooks/web/useCache'
import pick from 'lodash-es/pick'
import cloneDeep from 'lodash-es/cloneDeep'
import * as dynamicApi from '@/api/dynamicForm/index.js'

/**
 * 获取信贷系统字典
 */
export const useOldDictStore = defineStore('old-dict', () => {
  const { wsCache } = useCache('localStorage')
  const dictMap = reactive({ ...wsCache.get('oldDict') } || {})

  const getDictOptions = (key) => {
    return dictMap[key]
  }

  const setDict = (dicts = {}) => {
    Object.assign(dictMap, dicts)
    wsCache.set('oldDict', dictMap)
  }

  const getNotExistDict = (dictKeys = []) => {
    return dictKeys.filter((v) => !(v in dictMap))
  }

  const getDictFetch = (dictKeys = []) => {
    return new Promise(async (resolve, rej) => {
      let copyKey = typeof dictKeys === 'string' ? dictKeys.split(',') : dictKeys

      const keys = getNotExistDict(copyKey)

      const copyDictMap = cloneDeep(pick(dictMap, copyKey))

      if (!keys.length) return resolve(copyDictMap)

      const fetchDictMap = await fetchDictByCodes(keys)

      setDict(fetchDictMap)

      resolve(Object.assign({}, copyDictMap, fetchDictMap))
    })
  }

  const fetchDictByCodes = (codes = []) => {
    if (!codes.length) return Promise.resolve({})

    return dynamicApi.getCodeLibraryList({ codeNos: codes.join(',') })
  }

  /**
   * 
   * @param {*} dictCode code
   * @param {*} value '01'
   * @returns '新增'
   */
  const getDictLabel = (dictCode, value) => {
    const list = getDictOptions(dictCode)
    console.log('[ list ] >', list)
    const findDict = list?.find(v => v.itemNo === value) ?? {}

    return findDict?.itemName ?? ''
  }

  /**
   * 
   * @param {*} dictCode code
   * @param {*} values '01,02,03'
   * @returns '新增,续作,停用'
   */
  const getDictLabels = (dictCode, values) => {
    if (!values) return ''

    return values.split(',').map(v => getDictLabel(dictCode, v)).join(',')
  }

  return {
    getDictOptions,
    setDict,
    getNotExistDict,
    getDictFetch,
    getDictLabel,
    getDictLabels
  }
})
