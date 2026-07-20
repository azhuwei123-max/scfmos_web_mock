# dynamicNavMenu 组件文档

### 注意

默认选中的菜单并不会在menuSelect事件中返回，若要展示默认组件，请在父组件中自行赋值。



## 使用示例

```
import dynamicNavmenu from '@/components/dynamicNavmenu/index.vue'


<dynamicNavmenu
  :activeMenu="activeMenu"
  :loading="loading"
  :menuList="menuList"
  @menuSelect="menuSelect"
/>
```

## 参数

| 属性         | 说明                                                           | 默认值   |
| ---------- | ------------------------------------------------------------ | ----- |
| activeMenu | 默认激活的菜单                                                      | null  |
| loading    |                                                              | false |
| menuList   | 菜单列表；格式：[{key,title,children: [{key,title, children: ...}]}] | []    |

## 事件

| 属性         | 说明     | 参数                    |
| ---------- | ------ | --------------------- |
| menuSelect | 菜单点击事件 | (menu: menuList中元素对象) |