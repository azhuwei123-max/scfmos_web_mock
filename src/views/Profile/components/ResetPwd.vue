<template>
  <el-form ref="formRef" :model="password" :rules="rules" :label-width="200">
    <el-form-item :label="t('profile.password.oldPassword')" prop="oldPassword">
      <InputPassword v-model="password.oldPassword" />
    </el-form-item>
    <el-form-item :label="t('profile.password.newPassword')" prop="newPassword">
      <InputPassword v-model="password.newPassword" strength />
    </el-form-item>
    <el-form-item :label="t('profile.password.confirmPassword')" prop="confirmPassword">
      <InputPassword v-model="password.confirmPassword" strength />
    </el-form-item>
    <el-form-item>
      <XButton :title="t('common.save')" tpye="" @click="submit(formRef)" />
      <XButton :title="t('common.reset')" type="" @click="reset(formRef)" />
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { encrypt } from '@/utils/utils'
import { InputPassword } from '@/components/InputPassword'
import { updateUserPassword } from '@/api/system/user/profile'
defineOptions({ name: 'ResetPwd' })
const { t } = useI18n()
const message = useMessage()
const formRef = ref<FormInstance>()
const password = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
//密码为6位及以上并且大小写字母、数字、特殊字符四项中有三项，才不是弱密码
const strongRegex = new RegExp('^(?=.{8,})(((?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[a-z])(?=.*\\W))|((?=.*[A-Z])(?=.*[0-9])(?=.*\\W))|((?=.*[a-z])(?=.*[0-9])(?=.*\\W))).*$');
// 表单校验
const equalToPassword1 = (_rule, value, callback) => {
  if (!strongRegex.test(password.newPassword)) {
    callback(new Error('密码需要由 8-20 位数字、大小写字母、特殊符号组成'))
  } else {
    callback()
  }
}
const equalToPassword2 = (_rule, value, callback) => {
  if (password.newPassword !== value) {
    callback(new Error(t('profile.password.diffPwd')))
  } else {
    callback()
  }
}
const rules = reactive<FormRules>({
  oldPassword: [
    { required: true, message: t('profile.password.oldPwdMsg'), trigger: 'blur' },
    { min: 8, max: 20, message: t('profile.password.pwdRules'), trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: t('profile.password.newPwdMsg'), trigger: 'blur' },
    { min: 8, max: 20, message: t('profile.password.pwdRules'), trigger: 'blur' },
    { required: true, validator: equalToPassword1, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: t('profile.password.cfPwdMsg'), trigger: 'blur' },
    { required: true, validator: equalToPassword2, trigger: 'blur' }
  ]
})

const submit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      await updateUserPassword(encrypt(password.oldPassword), encrypt(password.newPassword))
      message.success(t('common.updateSuccess'))
    }
  })
}

const reset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
