// 证件类型选项
export const idTypeOptions = [
  { label: '身份证', value: '身份证' },
  { label: '护照', value: '护照' },
  { label: '港澳居民来往内地通行证', value: '港澳居民来往内地通行证' },
  { label: '台湾居民来往大陆通行证', value: '台湾居民来往大陆通行证' }
]

// 性别选项
export const genderOptions = [
  { label: '男性', value: '男性' },
  { label: '女性', value: '女性' }
]

// 学历选项
export const educationOptions = [
  { label: '大学专科', value: '大学专科' },
  { label: '大学本科', value: '大学本科' },
  { label: '研究生', value: '研究生' },
  { label: '其他', value: '其他' }
]

// 婚姻状况选项
export const maritalStatusOptions = [
  { label: '未婚', value: '未婚' },
  { label: '已婚', value: '已婚' },
  { label: '离异', value: '离异' },
  { label: '其他', value: '其他' }
]

// 最高学位选项
export const highestDegreeOptions = [
  { label: '其他', value: '其他' },
  { label: '学士', value: '学士' },
  { label: '硕士', value: '硕士' },
  { label: '博士', value: '博士' }
]

// 民族选项（中国56个民族 + 其他 + 外国血统中国籍人士）
export const ethnicityOptions = [
  { label: '汉族', value: '汉族' },
  { label: '蒙古族', value: '蒙古族' },
  { label: '回族', value: '回族' },
  { label: '藏族', value: '藏族' },
  { label: '维吾尔族', value: '维吾尔族' },
  { label: '苗族', value: '苗族' },
  { label: '彝族', value: '彝族' },
  { label: '壮族', value: '壮族' },
  { label: '布依族', value: '布依族' },
  { label: '朝鲜族', value: '朝鲜族' },
  { label: '满族', value: '满族' },
  { label: '侗族', value: '侗族' },
  { label: '瑶族', value: '瑶族' },
  { label: '白族', value: '白族' },
  { label: '土家族', value: '土家族' },
  { label: '哈尼族', value: '哈尼族' },
  { label: '哈萨克族', value: '哈萨克族' },
  { label: '傣族', value: '傣族' },
  { label: '黎族', value: '黎族' },
  { label: '傈僳族', value: '傈僳族' },
  { label: '佤族', value: '佤族' },
  { label: '畲族', value: '畲族' },
  { label: '高山族', value: '高山族' },
  { label: '拉祜族', value: '拉祜族' },
  { label: '水族', value: '水族' },
  { label: '东乡族', value: '东乡族' },
  { label: '纳西族', value: '纳西族' },
  { label: '景颇族', value: '景颇族' },
  { label: '柯尔克孜族', value: '柯尔克孜族' },
  { label: '土族', value: '土族' },
  { label: '达斡尔族', value: '达斡尔族' },
  { label: '仫佬族', value: '仫佬族' },
  { label: '羌族', value: '羌族' },
  { label: '布朗族', value: '布朗族' },
  { label: '撒拉族', value: '撒拉族' },
  { label: '毛南族', value: '毛南族' },
  { label: '仡佬族', value: '仡佬族' },
  { label: '锡伯族', value: '锡伯族' },
  { label: '阿昌族', value: '阿昌族' },
  { label: '普米族', value: '普米族' },
  { label: '塔吉克族', value: '塔吉克族' },
  { label: '怒族', value: '怒族' },
  { label: '乌孜别克族', value: '乌孜别克族' },
  { label: '俄罗斯族', value: '俄罗斯族' },
  { label: '鄂温克族', value: '鄂温克族' },
  { label: '德昂族', value: '德昂族' },
  { label: '保安族', value: '保安族' },
  { label: '裕固族', value: '裕固族' },
  { label: '京族', value: '京族' },
  { label: '塔塔尔族', value: '塔塔尔族' },
  { label: '独龙族', value: '独龙族' },
  { label: '鄂伦春族', value: '鄂伦春族' },
  { label: '赫哲族', value: '赫哲族' },
  { label: '门巴族', value: '门巴族' },
  { label: '珞巴族', value: '珞巴族' },
  { label: '基诺族', value: '基诺族' },
  { label: '其他', value: '其他' },
  { label: '外国血统中国籍人士', value: '外国血统中国籍人士' }
]

// 洲、国家、地区选项（模拟数据）
export const nationalityOptions = [
  {
    value: '亚洲',
    label: '亚洲',
    children: [
      {
        value: '中国',
        label: '中国',
        children: [
          { value: '中国大陆', label: '中国大陆' },
          { value: '香港', label: '香港' },
          { value: '澳门', label: '澳门' },
          { value: '台湾', label: '台湾' }
        ]
      },
      {
        value: '日本',
        label: '日本'
      },
      {
        value: '韩国',
        label: '韩国'
      },
      {
        value: '新加坡',
        label: '新加坡'
      },
      {
        value: '马来西亚',
        label: '马来西亚'
      },
      {
        value: '泰国',
        label: '泰国'
      },
      {
        value: '印度',
        label: '印度'
      },
      {
        value: '印度尼西亚',
        label: '印度尼西亚'
      },
      {
        value: '菲律宾',
        label: '菲律宾'
      },
      {
        value: '越南',
        label: '越南'
      }
    ]
  },
  {
    value: '欧洲',
    label: '欧洲',
    children: [
      {
        value: '英国',
        label: '英国'
      },
      {
        value: '法国',
        label: '法国'
      },
      {
        value: '德国',
        label: '德国'
      },
      {
        value: '意大利',
        label: '意大利'
      },
      {
        value: '西班牙',
        label: '西班牙'
      },
      {
        value: '俄罗斯',
        label: '俄罗斯'
      },
      {
        value: '荷兰',
        label: '荷兰'
      },
      {
        value: '瑞士',
        label: '瑞士'
      }
    ]
  },
  {
    value: '北美洲',
    label: '北美洲',
    children: [
      {
        value: '美国',
        label: '美国'
      },
      {
        value: '加拿大',
        label: '加拿大'
      },
      {
        value: '墨西哥',
        label: '墨西哥'
      }
    ]
  },
  {
    value: '南美洲',
    label: '南美洲',
    children: [
      {
        value: '巴西',
        label: '巴西'
      },
      {
        value: '阿根廷',
        label: '阿根廷'
      },
      {
        value: '智利',
        label: '智利'
      }
    ]
  },
  {
    value: '大洋洲',
    label: '大洋洲',
    children: [
      {
        value: '澳大利亚',
        label: '澳大利亚'
      },
      {
        value: '新西兰',
        label: '新西兰'
      }
    ]
  },
  {
    value: '非洲',
    label: '非洲',
    children: [
      {
        value: '南非',
        label: '南非'
      },
      {
        value: '埃及',
        label: '埃及'
      },
      {
        value: '肯尼亚',
        label: '肯尼亚'
      }
    ]
  }
]

// 国籍级联选择器配置
export const nationalityCascaderProps = {
  value: 'value',
  label: 'label',
  children: 'children',
  emitPath: true // 返回完整路径
}

// 区域选项（级联选择器数据，这里使用模拟数据）
export const regionOptions = [
  {
    value: '湖南省',
    label: '湖南省',
    children: [
      {
        value: '岳阳市',
        label: '岳阳市',
        children: [
          { value: '华容县', label: '华容县' }
        ]
      }
    ]
  },
  {
    value: '河北省',
    label: '河北省',
    children: [
      {
        value: '保定市',
        label: '保定市',
        children: [
          { value: '蠡县', label: '蠡县' }
        ]
      }
    ]
  },
  {
    value: '澳门特别行政区',
    label: '澳门特别行政区'
  }
]

// 居住状况选项
export const residentialStatusOptions = [
  { label: '未知', value: '未知' },
  { label: '自有', value: '自有' },
  { label: '租赁', value: '租赁' },
  { label: '其他', value: '其他' }
]

// 职业选项
export const occupationOptions = [
  { label: '未知', value: '未知' },
  { label: '其他', value: '其他' }
]

// 是否内部人选项
export const isInsiderOptions = [
  { label: '否', value: '否' },
  { label: '是', value: '是' }
]

// 单位所属行业选项
export const industryOptions = [
  { label: 'P-教育', value: 'P-教育' },
  { label: '其他', value: '其他' }
]

