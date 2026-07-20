# dynamicForm组件文档

## 注意

与后端约定，表单字段及表单模板column均为小写，已在组件中实现

实际业务逻辑较复杂，遇到无法实现统一商讨调整

## 使用实例

```
import dynamicForm from '@/components/dynamicForm/index.vue'

<dynamicForm
  ref="dynamicFormRef"
  v-if="formTempList.length"
  :formData="formData"
  :dockList="dockList"
  :formTempList="formTempList"
  :dictList="dictList"
  @selectInputClick="formSelectInputClick"
/>
```

## 参数

| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| formData | 表单数据 | 必传 |
| formTempList | 表单配置模板列表；直接接口返回格式即可 | 必传 |
| dockList | 表单模块列表（基本信息、操作信息等）。formTempList中dockid会对应该属性的dockid。若不传则会展示formTempList中所有dock | 建议传 |
| dictList | 表单中所有字典集合（目前仅用于选择框、checkbox）。目前统一接口：参考/system/codeLibrary/list 。不传组件内会自动获取 |  |
| optimize | 大幅提升表单渲染体验 | true |

## 事件

| 事件名           | 说明                       | 参数                                   |
| ---------------- | -------------------------- | -------------------------------------- |
| selectInputClick | 表单中弹窗选择控件点击事件 | (formTemp: formTempList中的模板对象)。 |
| renderFinished   | 表单渲染完毕事件           |                                        |

#### 弹窗选择示例

```
<dynamicForm
  ...
  @selectInputClick="formSelectInputClick"
/>

<!-- 自定义弹窗控件。因为字段column均为小写，注意ref命名 -->
<selectSuperCorpPop
  :ref="(el) => setMapRef(el, `supercorpname`)"
  @confirm="selectSuperCorpPopConfirm"
/>

// 所有弹窗选择ref
const mapRefs = ref({})
const setMapRef = (el, key) => {
  mapRefs.value[`select${key}InputRef`] = el
}

// 注意控件引用名称的匹配
const formSelectInputClick= (formInfo) => {
  mapRefs.value[`select${formInfo.colname}InputRef`].open(formData)
}

const selectSuperCorpPopConfirm = (item) => {
  formData.supercorp = item.customerID
  formData.supercorpname = item.customerName
}
```

## 自定义插槽

若模块中内容较复杂，使用自定义插槽

#### 示例

```
<dynamicForm
  ref="dynamicFormRef"
  v-if="formTempList.length"
  :formData="formData"
  :dockList="dockList"
  :formTempList="formTempList"
  :dictList="dictList"
  @selectInputClick="formSelectInputClick"
>
    <template #customSlot1 v-slot="{ form }">
        <!-- 自定义模块内容 -->
        模块名称为：{{ form.dockname }}
        模板下所有的配置对象长度：{{ form.forms.length }}
    </template>
    <template #customSlot2>
        <!-- 自定义模块内容 -->
    </template>
</dynamicForm>


const dockList = ref([
    { dockid, dockname, slotName: 'customSlot1' },
    { dockid, dockname, slotName: 'customSlot2' },
    .....
])
```
