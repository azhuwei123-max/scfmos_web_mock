<template>
  <Dialog v-model="dialogVisible" title="人员选择" width="800">
    <div v-loading="formLoading" class="user-select-container">
      <!-- 搜索框 -->
      <el-input
        v-model="searchKeyword"
        placeholder="搜索人员"
        clearable
        class="mb-3"
        @input="handleSearch"
      >
        <template #prefix>
          <Icon icon="ep:search" />
        </template>
      </el-input>

      <!-- 人员列表 -->
      <div class="user-list-container">
        <el-checkbox-group v-model="selectedUserIdList" class="user-checkbox-group">
          <div v-for="user in filteredUserList" :key="user.id" class="user-item">
            <el-checkbox :label="user.id" class="user-checkbox">
              <div class="flex items-center gap-2">
                <el-avatar :size="32" v-if="user.avatar" :src="user.avatar" />
                <el-avatar :size="32" v-else>
                  {{ user.nickname?.substring(0, 1) || 'U' }}
                </el-avatar>
                <div class="flex flex-col">
                  <span class="font-medium">{{ user.nickname }} （{{user.username}}）</span>
                  <span class="text-xs text-gray-500" v-if="user.deptName">
                    {{ user.deptName }}
                  </span>
                </div>
              </div>
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </div>
    </div>
    <template #footer>
      <el-button
        :disabled="formLoading || !selectedUserIdList?.length"
        tpye=""
        @click="submitForm"
      >
        确 定
      </el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as DefinitionApi from '@/api/bpm/definition'
import * as ProcessInstanceApi from '@/api/bpm/processInstance'

defineOptions({ name: 'UserSelectFormNew' })
const emit = defineEmits<{
  confirm: [id: any, userList: any[]]
}>()
const { t } = useI18n() // 国际
const message = useMessage() // 消息弹窗
const userList = ref<any[]>([]) // 所有用户列表
const filteredUserList = ref<any[]>([]) // 过滤后的用户列表
const selectedUserIdList: any = ref([]) // 选中的用户ID列表
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中
const activityId = ref()
const searchKeyword = ref('') // 搜索关键词

const yuserList  = ref([])








/** 打开弹窗 */
const open = async (id: number, selectedList?: any[],parmas) => {
  activityId.value = id
  resetForm()

  // 请求接口获取人员数据
  formLoading.value = true
  try {
 
    const userList = await ProcessInstanceApi.getUserByCondition(parmas)
      // 审批流最后一步
      // console.log('processDefinitionDetail',processDefinitionDetail);
    
      
     userList.value = userList
     yuserList.value = userList

     
     
    filteredUserList.value = [...userList]

    // 设置已选中的用户
    if (selectedList && selectedList.length > 0) {
      selectedUserIdList.value = selectedList.map((item: any) => item.id) || []
    }

    dialogVisible.value = true
  } catch (error) {
    console.error('获取人员列表失败:', error)
    message.error('获取人员列表失败')
  } finally {
    formLoading.value = false
  }
}

/** 搜索处理 */
const handleSearch = () => {
  if (!searchKeyword.value) {
    filteredUserList.value = [...userList.value]
    return
  }

  const keyword = searchKeyword.value.toLowerCase()
  filteredUserList.value = userList.value.filter((user) => {
    return (
      user.nickname?.toLowerCase().includes(keyword) ||
      user.deptName?.toLowerCase().includes(keyword)
    )
  })
}

/** 提交选择 */
const submitForm = async () => {
  try {
    // 从所有用户列表中筛选出已选择的用户

  
    
    const emitUserList = yuserList.value.filter((user: any) =>
      selectedUserIdList.value.includes(user.id)
    )

    message.success(t('common.updateSuccess'))
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('confirm', activityId.value, emitUserList)
  } catch (error) {
    // console.error('提交失败:', error)
  }
}

/** 重置表单 */
const resetForm = () => {
  userList.value = []
  filteredUserList.value = []
  selectedUserIdList.value = []
  searchKeyword.value = ''
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
.user-select-container {
  min-height: 400px;
}

.user-list-container {
  max-height: 500px;
  padding: 10px;
  overflow-y: auto;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.user-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.user-item {
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f7fa;
  }
}

.user-checkbox {
  width: 100%;

  :deep(.el-checkbox__label) {
    width: 100%;
    padding-left: 8px;
  }
}
</style>
