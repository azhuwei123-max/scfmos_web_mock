<template>
  <div>
    <el-tooltip :disabled="!titleOverflow" :content="customerName" placement="top">
      <p ref="titleRef" class="customerName" >{{customerName}}</p>
    </el-tooltip>
    <el-menu v-if="defaultOpeneds.length"  :default-active="_activeMenu" @select="select" :default-openeds="defaultOpeneds">
    <el-skeleton :loading="loading" animated>
      <el-scrollbar height="calc(100vh - 135px)">
        <menuItem v-for="menu in dynamicMenuList" :key="menu.key" :item="menu" />
      </el-scrollbar>
    </el-skeleton>
  </el-menu>
  </div>
  
</template>

<script setup>
import { ElMenuItem, ElSubMenu } from "element-plus"


const props = defineProps({
  activeMenu: String,

  loading: {
    type: Boolean,
    default: false
  },

  menuList: {
    type: Array,
    default: () => ref([])
  },
  customerOpeneds: {
    type: Array,
    default: () => ([])
  },
  customerName: String
})

const titleRef = ref()
const titleOverflow = ref(false)
const descOverflow = ref(false)
const _activeMenu = ref()
const defaultOpeneds = reactive([])



// 检查头部是否超出184pk
const checkOverflow = () => {
  nextTick(()=> {
    if(titleRef.value) {
    const titleWidth = titleRef.value.scrollWidth
    titleOverflow.value  = titleWidth > 184
   }
  })
}

onMounted(()=> {
  checkOverflow()
})


const dynamicMenuList = ref([])
const setMenuList = async (list) => {
  if(props.customerOpeneds.length) {
    defaultOpeneds.push(...props.customerOpeneds)
  }else {
    defaultOpeneds.push(...list.map(v => v.key))
  }
  dynamicMenuList.value = []
  
  runTask(list, 1)
}

/**
 * 优化切片渲染的等待机制
 * 纯nextTick依旧会阻塞渲染
 */
const newNextTick = () => {
  return new Promise(async (res) => {
    await nextTick()
    requestAnimationFrame(() => { 
      setTimeout(res, 10)
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
        dynamicMenuList.value.push(list[i])
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
        // emit('renderFinished')
        setTimeout(() => {
          _activeMenu.value = props.activeMenu
        });
      }
    }

    requestAnimationFrame(() => processChunk())
  }

const stopEffect = watchEffect(() => {
  if (props.menuList.length) {
    setMenuList(props.menuList)

    nextTick(() => {
      stopEffect()
    })
  }
})

const emit = defineEmits(['menuSelect'])

/**
 * 获取menu对象
 */
const getMenuByKeyList = (list, key) => {
  if (!list?.length) return
  
  const findMenu = list.find((v) => v.key === key)
  if (findMenu) return findMenu

  for (let i = 0, item; (item = list[i++]); ) {
    if (!item.children?.length) continue

    const findObj = getMenuByKeyList(item.children, key)
    if (findObj) return findObj
  }

  return
}

const select = (index) => {
  emit('menuSelect', getMenuByKeyList(props.menuList, index))
}

defineExpose({
  setMenuList,
  getMenuByKeyList
})
</script>

<style lang="scss">
.dynamic-navmenu {
  padding: 8px !important;
  background: var(--el-bg-color-overlay) !important;
  border: none !important;
  box-shadow: -5px 0px 5px -2px #cecdcd inset;

  .el-menu {
    border: none !important;
    background: transparent !important;
  }

  .el-menu-item,
  .el-sub-menu__title {
    height: 36px !important;
    line-height: 36px !important;
    // padding: 0 12px !important;
    border-radius: 6px !important;
    transition: all 0.2s ease !important;

    &:hover {
      background: none;
      color: #333;
    }

    &.is-active {
      background: #fff!important;
      color: #333 !important;
      font-weight: bold;
    }
  }

  .el-menu-item {
    margin: 4px 0 !important;
  }
}
.customerName {
  cursor: pointer;
 font-size: 17px;
 font-weight: 700;
 max-width: 198px;
 overflow: hidden;
 text-overflow: ellipsis;
 white-space: nowrap;
}
</style>