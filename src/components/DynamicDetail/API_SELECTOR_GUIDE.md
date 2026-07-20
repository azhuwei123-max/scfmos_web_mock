# DynamicDetail API 选择器配置指南

## 概述

`DynamicDetail` 组件支持多种需要请求接口的选择器类型，包括：

- **弹框表格选择器**（分页表格选择）
- **弹框树形选择器**（树形结构选择）
- **远程搜索下拉框**（下拉分页远程搜索）

## 配置方式

### 1. 弹框表格选择器（api-select）

适用于需要从分页表格中选择数据的场景。

```javascript
{
  field: 'enterpriseId',
  label: '企业',
  type: 'api-select',
  required: true,
  apiConfig: {
    // API 配置
    url: '/system/enterprise/page',
    method: 'GET', // 或 'POST'
    selectorType: 'table', // 表格选择器
    multiple: false, // 是否多选

    // 弹框配置
    dialogTitle: '选择企业',
    dialogWidth: '60%',

    // 表格列配置
    tableColumns: [
      { prop: 'name', label: '企业名称', minWidth: 150 },
      { prop: 'code', label: '企业编号', minWidth: 220 },
      { prop: 'address', label: '地址', minWidth: 200 }
    ],

    // 搜索条件配置
    searchFields: [
      {
        name: 'name',
        label: '企业名称',
        type: 'text',
        placeholder: '请输入企业名称'
      },
      {
        name: 'status',
        label: '状态',
        type: 'select',
        options: [
          { label: '启用', value: '1' },
          { label: '禁用', value: '0' }
        ]
      }
    ],

    // 分页配置（默认 true）
    pagination: true,

    // 响应数据解析配置
    responseParser: {
      listPath: 'data.list', // 列表数据路径
      totalPath: 'data.total', // 总数路径
      // 或者使用自定义解析函数
      // parseFunc: (response) => {
      //   return {
      //     list: response.data.records,
      //     total: response.data.total
      //   }
      // }
    },

    // 显示字段（用于显示选中的值）
    displayField: 'name',
    // 值字段（用于提交的值）
    valueField: 'id'
  }
}
```

### 2. 弹框树形选择器（api-select）

适用于需要从树形结构中选择数据的场景。

```javascript
{
  field: 'departmentId',
  label: '部门',
  type: 'api-select',
  required: true,
  apiConfig: {
    url: '/system/dept/tree',
    method: 'GET',
    selectorType: 'tree', // 树形选择器
    multiple: false,

    dialogTitle: '选择部门',
    dialogWidth: '400px',

    // 树形选择器配置
    treeProps: {
      children: 'children',
      label: 'name',
      value: 'id'
    },
    checkStrictly: false, // 是否严格模式（父子不关联）

    // 响应数据解析
    responseParser: {
      listPath: 'data', // 树形数据通常是数组
      // 或自定义解析
      // parseFunc: (response) => {
      //   return {
      //     list: response.data
      //   }
      // }
    },

    displayField: 'name',
    valueField: 'id'
  }
}
```

### 3. 远程搜索下拉框（remote-select）

适用于需要在下拉框中输入关键词进行远程搜索的场景。

```javascript
{
  field: 'customerId',
  label: '客户',
  type: 'remote-select',
  required: true,
  remoteConfig: {
    url: '/system/customer/search',
    method: 'GET', // 或 'POST'

    // 搜索参数字段名
    searchField: 'keyword',

    // 响应数据解析
    responseParser: {
      listPath: 'data.list',
      // 或自定义解析
      // parseFunc: (response) => {
      //   return response.data.map(item => ({
      //     label: item.name,
      //     value: item.id
      //   }))
      // }
    },

    // 显示字段
    labelField: 'name',
    // 值字段
    valueField: 'id'
  }
}
```

## 完整示例

```javascript
const schema = [
  // 普通文本字段
  {
    field: 'name',
    label: '姓名',
    type: 'text',
    required: true
  },

  // 弹框表格选择器（单选）
  {
    field: 'enterpriseId',
    label: '企业',
    type: 'api-select',
    required: true,
    apiConfig: {
      url: '/system/enterprise/page',
      method: 'GET',
      selectorType: 'table',
      multiple: false,
      dialogTitle: '选择企业',
      tableColumns: [
        { prop: 'name', label: '企业名称', minWidth: 150 },
        { prop: 'code', label: '企业编号', minWidth: 220 }
      ],
      searchFields: [
        {
          name: 'name',
          label: '企业名称',
          type: 'text'
        }
      ],
      displayField: 'name',
      valueField: 'id'
    }
  },

  // 弹框表格选择器（多选）
  {
    field: 'projectIds',
    label: '项目',
    type: 'api-select',
    apiConfig: {
      url: '/system/project/page',
      method: 'GET',
      selectorType: 'table',
      multiple: true, // 多选
      dialogTitle: '选择项目',
      tableColumns: [{ prop: 'name', label: '项目名称', minWidth: 150 }],
      displayField: 'name',
      valueField: 'id'
    }
  },

  // 弹框树形选择器
  {
    field: 'departmentId',
    label: '部门',
    type: 'api-select',
    apiConfig: {
      url: '/system/dept/tree',
      method: 'GET',
      selectorType: 'tree',
      dialogTitle: '选择部门',
      treeProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      },
      displayField: 'name',
      valueField: 'id'
    }
  },

  // 远程搜索下拉框
  {
    field: 'customerId',
    label: '客户',
    type: 'remote-select',
    remoteConfig: {
      url: '/system/customer/search',
      method: 'GET',
      searchField: 'keyword',
      labelField: 'name',
      valueField: 'id'
    }
  }
]
```

## 响应数据格式

### 标准格式（推荐）

```json
{
  "code": 0,
  "data": {
    "list": [...],
    "total": 100
  }
}
```

### 自定义格式

如果后端返回的数据格式不同，可以使用 `responseParser.parseFunc` 自定义解析：

```javascript
responseParser: {
  parseFunc: (response) => {
    // 自定义解析逻辑
    return {
      list: response.records || response.data || [],
      total: response.totalCount || response.total || 0
    }
  }
}
```

## 注意事项

1. **单选模式**：在表格选择器中，点击行即可完成选择并关闭弹框
2. **多选模式**：需要点击"确定"按钮完成选择
3. **树形选择器**：单选模式下点击节点即可完成选择
4. **远程搜索**：输入关键词后自动触发搜索，支持防抖
5. **参数映射**：可以通过 `paramMapping` 将表单其他字段的值映射到请求参数中（待实现）

## 扩展

如果需要更复杂的选择器（如级联选择、日期范围选择等），可以通过 `component` 字段指定自定义组件：

```javascript
{
  field: 'customField',
  label: '自定义字段',
  type: 'custom',
  component: 'CustomSelector',
  componentProps: {
    // 自定义组件属性
  }
}
```
