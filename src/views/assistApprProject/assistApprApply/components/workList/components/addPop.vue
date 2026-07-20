<template>
  <Dialog v-model="visible" title="新增" width="850px" top="5vh">
    <!-- <ContentWrap> -->
      <el-form inline :model="formData" :rules="formRules" label-width="100">
        <el-form-item label="协审方式" prop="a">
          <el-radio-group class="!w-240px" v-model="formData.a">
            <el-radio-button label="0">新增</el-radio-button>
            <el-radio-button label="1">续作</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="协审类型" prop="a">
          <el-radio-group v-model="formData.b">
            <el-radio-button label="0">项目协审</el-radio-button>
            <el-radio-button label="1">单笔协审</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="客户编号">
          <el-input
            class="!w-240px"
            v-model="formData.serialno"
            placeholder="搜索合同流水号"
            clearable
          />
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input
            class="!w-240px"
            v-model="formData.customername"
            placeholder="搜索客户名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="协审编号" prop="serialno">
          <el-input
            class="!w-240px"
            v-model="formData.serialno"
            placeholder="请输入协审编号"
            clearable
          />
        </el-form-item>
        <el-form-item label="发生日期">
          <el-date-picker
            class="!w-240px"
            v-model="formData.MaturityDate"
            type="date"
            placeholder="请选择发生日期"
            value-format="YYYY/MM/DD"
            format="YYYY/MM/DD"
          />
        </el-form-item>
      </el-form>
    <!-- </ContentWrap> -->
    <template #footer>
      <el-button tpye="" :loading="saving" @click="confirm">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import * as Api from './api.js'

const visible = ref(false)

const formData = reactive({})
const formRules = reactive({
  a: [{ required: true, message: '请选择协审方式', trigger: 'change' }],
  b: [{ required: true, message: '请选择协审类型', trigger: 'change' }],
  serialno: [{ required: true, message: '请输入协审编号', trigger: 'change' }],
})

let rowItem = {}
const open = (row) => {
  rowItem = row
  visible.value = true
}

const emit = defineEmits(['confirm'])

const saving = ref(false)
const confirm = () => {
  if (!currentRow.value) {
    ElMessage.warning('请选择 1 条')
    return
  }

  saving.value = true
  Api.newApply({ contractserialno: currentRow.value.serialno })
    .then((res) => {
      ElMessage.success('新增成功')
      visible.value = false
      emit('confirm')
    })
    .finally((_) => (saving.value = false))
}

defineExpose({
  open
})
</script>