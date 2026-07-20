<template>
  <Dialog v-model="visible" title="详情" width="800px">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="150px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="核心企业客户号" prop="customerID">
            <el-input v-model="formData.customerID" readonly placeholder="请输入核心企业客户号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户名称" prop="customerName">
            <el-input v-model="formData.customerName" readonly placeholder="请输入客户名称" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="合作项目编号" prop="projectID">
            <el-input
              type="textarea"
              :maxlength="100"
              :rows="2"
              readonly
              v-model="formData.projectID"
              placeholder="请输入合作项目编号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合作项目名称" prop="projectName">
            <el-input v-model="formData.projectName" readonly placeholder="合作项目名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合作类型" prop="teamWorkType">
            <el-input v-model="formData.teamWorkType" readonly placeholder="合作类型" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="第三方合作机构类型" prop="thirdOrgType">
            <el-input v-model="formData.thirdOrgType" readonly placeholder="第三方合作机构类型" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="协审状态" prop="projectAuditStatus">
            <el-input v-model="formData.projectAuditStatus" readonly placeholder="协审状态" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注(限100汉字)" prop="remark">
            <el-input v-model="formData.remark" type="textarea" :rows="5" disabled placeholder="备注(限100汉字)" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- </div> -->
    <template #footer>
      <el-button @click="visible = false">关 闭</el-button>
    </template>
  </Dialog>
</template>
<script setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { CommonStatusEnum } from '@/utils/constants'
import * as Api from '../api.js'

defineOptions({ name: 'SystemRoleForm' })

const message = useMessage() // 消息弹窗

const visible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = reactive({})
const formRules = reactive({
  projectName: [{ required: true, message: '合作项目名称不能为空', trigger: 'change' }],
  remark: [{ required: true, message: '备注不能为空', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (row) => {
  visible.value = true
  formRef.value?.resetFields

  formLoading.value = true
  const data = await Api.getRelativeTeamWorkInfo({ ProjectID: row.projectID }).finally(
    (_) => (formLoading.value = false)
  )

  Object.assign(formData, data)

  nextTick(() => {
    setTimeout(() => {
      formRef.value?.clearValidate()
    }, 10)
  })
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = () => {
  formRef.value.resetFields()
}
</script>
