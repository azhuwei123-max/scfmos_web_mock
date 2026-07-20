<template>
  <el-cascader
    v-model="selectedValue"
    :options="regionOptions"
    :props="cascaderProps"
    :placeholder="placeholder"
    :clearable="clearable"
    :filterable="filterable"
    :disabled="disabled"
    :show-all-levels="showAllLevels"
    class="w-1/1"
    v-bind="$attrs"
  />
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { getAreaTree } from '@/api/system/area'

defineOptions({ name: 'RegionSelect' })

interface Props {
  modelValue?: string | number | (string | number)[]
  placeholder?: string
  clearable?: boolean
  filterable?: boolean
  disabled?: boolean
  showAllLevels?: boolean
  // 是否使用接口数据，false 时使用 mock 数据
  useApi?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择省/市/区',
  clearable: true,
  filterable: true,
  disabled: false,
  showAllLevels: false,
  useApi: true
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | (string | number)[] | undefined]
  'change': [value: string | number | (string | number)[] | undefined]
}>()

const selectedValue = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  }
})

const regionOptions = ref<any[]>([])
const loading = ref(false)

// Cascader 配置
const cascaderProps = {
  value: 'value',
  label: 'label',
  children: 'children',
  checkStrictly: false, // 是否严格的遵守父子节点不关联
  emitPath: true // 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组
}

/**
 * 转换后端数据格式为 cascader 需要的格式
 * 后端格式: {key, value, title, isLeaf, id, parentId, departName, disabled, children}
 * Cascader 格式: {value, label, children}
 */
const transformData = (data: any[]): any[] => {
  if (!data || !Array.isArray(data)) {
    return []
  }
  
  return data.map((item) => {
    const transformed: any = {
      value: item.value || item.key,
      label: item.title || item.departName || item.name,
      // disabled: item.isLeaf || false
    }
    
    // 递归处理子节点
    if (item.children && Array.isArray(item.children) && item.children.length > 0) {
      transformed.children = transformData(item.children)
    }
    
    return transformed
  })
}

/**
 * 获取地区数据
 */
const getRegionData = async () => {
  if (!props.useApi) {
    // 使用 mock 数据
    regionOptions.value = getMockRegionData()
    return
  }

  try {
    loading.value = true
    const res = await getAreaTree()
   
    
    // 转换数据格式
    regionOptions.value = transformData(Array.isArray(res) ? res : [])
  } catch (error) {
    console.error('获取地区数据失败111:', error)
    // 接口失败时使用 mock 数据作为 fallback
    regionOptions.value = getMockRegionData()
  } finally {
    loading.value = false
  }
}

/**
 * Mock 地区数据（作为 fallback）
 */
const getMockRegionData = (): any[] => {
  return [
    {
      value: '11',
      label: '北京市',
      children: [
        {
          value: '1101',
          label: '北京市市辖区',
          children: [
            { value: '110101', label: '东城区' },
            { value: '110102', label: '西城区' },
            { value: '110105', label: '朝阳区' },
            { value: '110106', label: '丰台区' },
            { value: '110107', label: '石景山区' },
            { value: '110108', label: '海淀区' },
            { value: '110109', label: '门头沟区' },
            { value: '110111', label: '房山区' },
            { value: '110112', label: '通州区' },
            { value: '110113', label: '顺义区' },
            { value: '110114', label: '昌平区' },
            { value: '110115', label: '大兴区' },
            { value: '110116', label: '怀柔区' },
            { value: '110117', label: '平谷区' },
            { value: '110118', label: '密云区' },
            { value: '110119', label: '延庆区' }
          ]
        }
      ]
    },
    {
      value: '12',
      label: '天津市',
      children: [
        {
          value: '1201',
          label: '天津市市辖区',
          children: [
            { value: '120101', label: '和平区' },
            { value: '120102', label: '河东区' },
            { value: '120103', label: '河西区' },
            { value: '120104', label: '南开区' },
            { value: '120105', label: '河北区' },
            { value: '120106', label: '红桥区' },
            { value: '120110', label: '东丽区' },
            { value: '120111', label: '西青区' },
            { value: '120112', label: '津南区' },
            { value: '120113', label: '北辰区' },
            { value: '120114', label: '武清区' },
            { value: '120115', label: '宝坻区' },
            { value: '120116', label: '滨海新区' },
            { value: '120117', label: '宁河区' },
            { value: '120118', label: '静海区' },
            { value: '120119', label: '蓟州区' }
          ]
        }
      ]
    },
    {
      value: '13',
      label: '河北省',
      children: [
        {
          value: '1301',
          label: '石家庄市',
          children: [
            { value: '130102', label: '长安区' },
            { value: '130104', label: '桥西区' },
            { value: '130105', label: '新华区' },
            { value: '130107', label: '井陉矿区' },
            { value: '130108', label: '裕华区' },
            { value: '130109', label: '藁城区' },
            { value: '130110', label: '鹿泉区' },
            { value: '130111', label: '栾城区' },
            { value: '130121', label: '井陉县' },
            { value: '130123', label: '正定县' },
            { value: '130125', label: '行唐县' },
            { value: '130126', label: '灵寿县' },
            { value: '130127', label: '高邑县' },
            { value: '130128', label: '深泽县' },
            { value: '130129', label: '赞皇县' },
            { value: '130130', label: '无极县' },
            { value: '130131', label: '平山县' },
            { value: '130132', label: '元氏县' },
            { value: '130133', label: '赵县' },
            { value: '130181', label: '辛集市' },
            { value: '130183', label: '晋州市' },
            { value: '130184', label: '新乐市' }
          ]
        },
        {
          value: '1302',
          label: '唐山市',
          children: [
            { value: '130202', label: '路南区' },
            { value: '130203', label: '路北区' },
            { value: '130204', label: '古冶区' },
            { value: '130205', label: '开平区' },
            { value: '130207', label: '丰南区' },
            { value: '130208', label: '丰润区' },
            { value: '130209', label: '曹妃甸区' },
            { value: '130224', label: '滦南县' },
            { value: '130225', label: '乐亭县' },
            { value: '130227', label: '迁西县' },
            { value: '130229', label: '玉田县' },
            { value: '130281', label: '遵化市' },
            { value: '130283', label: '迁安市' },
            { value: '130284', label: '滦州市' }
          ]
        }
      ]
    },
    {
      value: '31',
      label: '上海市',
      children: [
        {
          value: '3101',
          label: '上海市市辖区',
          children: [
            { value: '310101', label: '黄浦区' },
            { value: '310104', label: '徐汇区' },
            { value: '310105', label: '长宁区' },
            { value: '310106', label: '静安区' },
            { value: '310107', label: '普陀区' },
            { value: '310109', label: '虹口区' },
            { value: '310110', label: '杨浦区' },
            { value: '310112', label: '闵行区' },
            { value: '310113', label: '宝山区' },
            { value: '310114', label: '嘉定区' },
            { value: '310115', label: '浦东新区' },
            { value: '310116', label: '金山区' },
            { value: '310117', label: '松江区' },
            { value: '310118', label: '青浦区' },
            { value: '310120', label: '奉贤区' },
            { value: '310151', label: '崇明区' }
          ]
        }
      ]
    },
    {
      value: '33',
      label: '浙江省',
      children: [
        {
          value: '3301',
          label: '杭州市',
          children: [
            { value: '330102', label: '上城区' },
            { value: '330105', label: '拱墅区' },
            { value: '330106', label: '西湖区' },
            { value: '330108', label: '滨江区' },
            { value: '330109', label: '萧山区' },
            { value: '330110', label: '余杭区' },
            { value: '330111', label: '富阳区' },
            { value: '330112', label: '临安区' },
            { value: '330113', label: '临平区' },
            { value: '330114', label: '钱塘区' },
            { value: '330122', label: '桐庐县' },
            { value: '330127', label: '淳安县' },
            { value: '330182', label: '建德市' }
          ]
        },
        {
          value: '3302',
          label: '宁波市',
          children: [
            { value: '330203', label: '海曙区' },
            { value: '330205', label: '江北区' },
            { value: '330206', label: '北仑区' },
            { value: '330211', label: '镇海区' },
            { value: '330212', label: '鄞州区' },
            { value: '330213', label: '奉化区' },
            { value: '330225', label: '象山县' },
            { value: '330226', label: '宁海县' },
            { value: '330281', label: '余姚市' },
            { value: '330282', label: '慈溪市' }
          ]
        }
      ]
    },
    {
      value: '43',
      label: '湖南省',
      children: [
        {
          value: '4301',
          label: '长沙市',
          children: [
            { value: '430102', label: '芙蓉区' },
            { value: '430103', label: '天心区' },
            { value: '430104', label: '岳麓区' },
            { value: '430105', label: '开福区' },
            { value: '430111', label: '雨花区' },
            { value: '430112', label: '望城区' },
            { value: '430121', label: '长沙县' },
            { value: '430181', label: '浏阳市' },
            { value: '430182', label: '宁乡市' }
          ]
        },
        {
          value: '4306',
          label: '岳阳市',
          children: [
            { value: '430602', label: '岳阳楼区' },
            { value: '430603', label: '云溪区' },
            { value: '430611', label: '君山区' },
            { value: '430621', label: '岳阳县' },
            { value: '430623', label: '华容县' },
            { value: '430624', label: '湘阴县' },
            { value: '430626', label: '平江县' },
            { value: '430681', label: '汨罗市' },
            { value: '430682', label: '临湘市' }
          ]
        }
      ]
    },
    {
      value: '44',
      label: '广东省',
      children: [
        {
          value: '4401',
          label: '广州市',
          children: [
            { value: '440103', label: '荔湾区' },
            { value: '440104', label: '越秀区' },
            { value: '440105', label: '海珠区' },
            { value: '440106', label: '天河区' },
            { value: '440111', label: '白云区' },
            { value: '440112', label: '黄埔区' },
            { value: '440113', label: '番禺区' },
            { value: '440114', label: '花都区' },
            { value: '440115', label: '南沙区' },
            { value: '440117', label: '从化区' },
            { value: '440118', label: '增城区' }
          ]
        },
        {
          value: '4403',
          label: '深圳市',
          children: [
            { value: '440303', label: '罗湖区' },
            { value: '440304', label: '福田区' },
            { value: '440305', label: '南山区' },
            { value: '440306', label: '宝安区' },
            { value: '440307', label: '龙岗区' },
            { value: '440308', label: '盐田区' },
            { value: '440309', label: '龙华区' },
            { value: '440310', label: '坪山区' },
            { value: '440311', label: '光明区' }
          ]
        }
      ]
    }
  ]
}

// 初始化
onMounted(() => {
  getRegionData()
})
</script>

