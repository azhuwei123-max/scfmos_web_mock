export const defaultMenuList = [
  {
    key: '01',
    title: '手机渠道进件管理',
    isLeaf: false,
    id: '01',
    children: [
      {
        key: '0101',
        value: './components/workList/index.vue',
        title: '待进件的授信申请管理',
        isLeaf: true,
        id: '0101',
        dealtype: '0'
      },
      {
        key: '0102',
        value: './components/workList/index.vue',
        title: '已进件的授信申请管理',
        isLeaf: true,
        id: '0102',
        dealtype: '1'
      },
      {
        key: '0103',
        value: './components/workList/index.vue',
        title: '失效的授信申请管理',
        isLeaf: true,
        id: '0103',
        dealtype: '2'
      }
    ]
  }
]
