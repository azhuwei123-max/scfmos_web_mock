<template>
  <div class="dynamic-container">
    <dynamicNavmenu
      ref="dynamicNavmenuRef"
      class="!mr-20px dynamic-navmenu"
      :activeMenu="_activeMenu"
      :loading="_loading"
      :menuList="_menuList"
      @menuSelect="menuSelect"
    />

    <div class="component">
      <keep-alive :max="20">
        <component
          ref="dynamicCompRef"
          :is="componentId"
          :key="curMenu.key"
          :params="curMenu"
          @reLoad="emit('reLoad')"
        ></component>
      </keep-alive>
    </div>
  </div>
</template>

<script setup>
import dynamicNavmenu from '@/components/dynamicNavmenu/index.vue'
import crmsIframe from '@/components/busiComp/crmsIframe/index.vue'

/**
 * 组件依靠监听menuListY、menuListN是否为null开始执行渲染操作，取数完毕前请不要赋值
 */
defineOptions({
  name: 'dynamicContainer2'
})

const props = defineProps({
  // 从接口获取的菜单列表
  // menuList: Array | null,
  menuListY: Array | null,
  menuListN: Array | null,

  // 菜单获取loading
  loading: Boolean,

  // 菜单选择后需要传入的额外的参数
  menuSelect: Function,

  component: Object
})

const emit = defineEmits(['reLoad'])

const _loading = computed(() => props.loading)

const _menuList = ref()

const _activeMenu = ref()

const curMenu = ref({})
const dynamicCompRef = ref()
const menuSelect = (menu) => {

  if (['01', '02'].includes(menu.key)) return

  curMenu.value = {
    ...menu
  }
  if (props.menuSelect) {
    Object.assign(curMenu.value, props.menuSelect(menu))
  }
  if (!componentId.value) {
    componentId.value = props.component
  }

  console.log(1111111, dynamicCompRef);

  nextTick(() => {
    dynamicCompRef.value?.activeComp?.()
  })
}
const dynamicNavmenuRef = ref()
const componentId = ref()
const resetMenuList = (menuMap, reload) => {
  const menulist = []

  const menuN = {
    key: '01',
    title: '当前工作',
    children:
      menuMap['N']?.map((v, i) => ({
        ...v,
        key: `01_${v.phaseNo}`,
        type: 'N',
        title: `${v.phaseName} ${v.workCount} 件`,
        component: props.component
      })) ?? []
  }
  const menuY = {
    key: '02',
    title: '已完成工作',
    children:
      menuMap['Y']?.map((v, i) => ({
        ...v,
        key: `02_${v.phaseNo}`,
        type: 'Y',
        title: `${v.phaseName} ${v.workCount} 件`
      })) ?? []
  }

  _menuList.value = [menuN, menuY]
  if (reload) {
    dynamicNavmenuRef.value.setMenuList(_menuList.value)
    // const menuInfo = dynamicNavmenuRef.value.getMenuByKeyList(_menuList.value, _activeMenu.value)
    // if (menuInfo) {
    //   setTimeout(() => {
    //     nextTick(() => {
    //       menuSelect(menuInfo)
    //     })
    //   }, 100);
    // }
  } else {
  
    const firstMenuChild = _menuList.value[0].children
    if (firstMenuChild.length) {
      _activeMenu.value = firstMenuChild[0].key
      menuSelect(firstMenuChild[0])
    }
  }
}

const menuCache = {}

const stopEffect = watchEffect(() => {
  if (props.loading === false && props.menuListY && props.menuListN) {
    if (menuCache['Y'] || menuCache['N']) return

    menuCache['Y'] = props.menuListY
    menuCache['N'] = props.menuListN

    resetMenuList(menuCache)

    nextTick(() => {
      stopEffect()
    })
  }
})

const setMenuList = (list) => {
  menuCache['Y'] = props.menuListY
  menuCache['N'] = props.menuListN

  resetMenuList(menuCache, true)
}

defineExpose({
  setMenuList
})
</script>

<style lang="scss" scoped>
.dynamic-container {
  display: flex;

  .dynamic-navmenu {
    min-width: 198px;
  }
  .component {
    // width: calc(100% - 198px - 20px - 5px);
    flex: 1;
    overflow: auto;
  }
}
</style>