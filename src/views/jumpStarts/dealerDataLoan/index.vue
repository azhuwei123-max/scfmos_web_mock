<template>
  <model1 ref="model1Ref" @click1="click1" @click2="click2" />
  <model2 ref="model2Ref" @back="model2Back" @toModel3="toModel3" @toModel1="toModel1" />
  <model3 ref="model3Ref" @toModel4="toModel4" @back="model3Back" @toModel1="toModel1" />
  <model4 ref="model4Ref" @addCustomer="addCustomer" @addPerson="addPerson" @toModel1="toModel1" />
  <model5
    ref="model5Ref"
    v-model="visible5"
    :initial-data="model5Params"
    @closeModel5="closeModel5"
    @toModel5="toModel5"
    @toModel1="toModel1"
  />
  <model6
    ref="model6Ref"
    v-model="visible6"
    :initial-data="model6Params"
    @closeModel6="closeModel6"
    @toModel6="toModel6"
    @toModel1="toModel1"
  />
  <model7 ref="model7Ref" @back="model7Back" @toModel8="toModel8" @toModel1="toModel1" @toModel7_1="toModel7_1" />
  <!-- 关联 -->
  <model7_1 ref="model7_1Ref" @back="model7_1back" @toModel1="toModel1" />
  <model8 ref="model8Ref" @back="model8Back" @toModel1="toModel1" />
</template>

<script setup>
/**
 * 经销商数据贷控制中心
 */
import model1 from './components/model1.vue'
import model2 from './components/model2.vue'
import model3 from './components/model3.vue'
import model4 from './components/model4.vue'
import model5 from './components/model5.vue'
import model6 from './components/model6.vue'
import model7 from './components/model7.vue'
import model7_1 from './components/model7-1.vue'
import model8 from './components/model8.vue'

const model1Ref = ref()
const model2Ref = ref()
const model3Ref = ref()
const model4Ref = ref()
const model7Ref = ref()
const model7_1Ref = ref()
const model8Ref = ref()

const open = () => {
  model1Ref.value.open()
}

const click1 = () => {
  model2Ref.value.open()
}

const click2 = () => {
  model7Ref.value.open()
}

const model2Back = () => {
  open()
}

const model3Back = () => {
  model2Ref.value.open()
}

const model7Back = () => {
  open()
}

const model8Back = () => {
  model7Ref.value.open()
}

let model3Params
const toModel3 = (row) => {
  model3Params = row
  model3Ref.value.open(row)
}

let model3Row = {}
const toModel4 = (row) => {
  model3Row = row
  model4Ref.value.open(row)
}

const model5Ref = ref()
const visible5 = ref()
const model5Params = reactive({})
const model6Params = reactive({})
const addCustomer = () => {
  model5Params.projectNo = model3Row.projectid
  model5Params.CustomerType = '0110'
  visible5.value = true
}

const visible6 = ref()
const addPerson = () => {
  model6Params.projectNo = model3Row.projectid
  model6Params.CustomerType = '0320'
  visible6.value = true
}
const closeModal5 = () => {
  visible5.value = false
}

const closeModel5 = () => {
  toModel3(model3Params)
}

const toModel1 = () => {
  visible5.value = false
  visible6.value = false
  open()
}

const toModel5 = () => {
  visible5.value = false
  nextTick(() => {
    addCustomer()
  })
}

const toModel6 = () => {
  visible6.value = false
  nextTick(() => {
    addPerson()
  })
}

const closeModel6 = () => {
  toModel3(model3Params)
}

const model7_1back = () => {
  model7Ref.value.open()
}

const toModel7_1 = (row) => {
  model7_1Ref.value.open(row)
}

const toModel8 = (row) => {
  model8Ref.value.open(row)
}

defineExpose({
  open
})
</script>
