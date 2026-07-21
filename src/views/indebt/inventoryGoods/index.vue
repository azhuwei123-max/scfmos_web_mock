<template>
  <ContentWrap>
    <Search
      :schema="allSchemas.searchSchema"
      :model="tableObject.params"
      @search="handleSearch"
      @reset="handleSearch"
    />

    <ActionBar :buttons="buttons" />

    <Table
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="{ total: tableObject.total }"
      highlight-current-row
      :onRowClick="handleRowClick"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      @register="register"
    >
      <template #status="{ row }">
        <el-tag :type="row.status === '启用' ? 'success' : 'info'" effect="light">
          {{ row.status }}
        </el-tag>
      </template>
    </Table>
  </ContentWrap>

  <el-dialog
    v-model="formVisible"
    title="新增新品类"
    width="780px"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="112px">
      <div class="form-grid">
        <el-form-item label="商品大类编码" prop="largeCategoryCode">
          <el-input v-model="formData.largeCategoryCode" placeholder="例如：08" />
        </el-form-item>
        <el-form-item label="商品大类名称" prop="largeCategoryName">
          <el-input v-model="formData.largeCategoryName" placeholder="请输入商品大类名称" />
        </el-form-item>
        <el-form-item label="商品中类编码" prop="middleCategoryCode">
          <el-input v-model="formData.middleCategoryCode" placeholder="例如：0801" />
        </el-form-item>
        <el-form-item label="商品中类名称" prop="middleCategoryName">
          <el-input v-model="formData.middleCategoryName" placeholder="请输入商品中类名称" />
        </el-form-item>
        <el-form-item label="商品小类编码" prop="smallCategoryCode">
          <el-input v-model="formData.smallCategoryCode" placeholder="例如：080101" />
        </el-form-item>
        <el-form-item label="商品小类名称" prop="smallCategoryName">
          <el-input v-model="formData.smallCategoryName" placeholder="请输入商品小类名称" />
        </el-form-item>
      </div>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          :rows="3"
          maxlength="200"
          show-word-limit
          placeholder="请输入该商品品类的适用说明"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="formVisible = false">取 消</el-button>
      <el-button type="primary" :loading="saveLoading" @click="handleCreate">保 存</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="categoryViewVisible" title="有效商品品类视图" width="90%" destroy-on-close>
    <div v-loading="categoryViewLoading" class="category-mind-map">
      <div v-if="categoryMindMap.length" class="mind-map-content">
        <div class="mind-map-root">
          <span class="mind-map-root-title">有效商品分类</span>
          <span class="mind-map-root-count">{{ activeCategoryCount }} 个商品小类</span>
        </div>

        <div class="mind-map-branches">
          <section
            v-for="largeCategory in categoryMindMap"
            :key="largeCategory.id"
            class="mind-map-large-branch"
          >
            <div class="mind-map-large-node">
              <span class="mind-map-code">{{ largeCategory.code }}</span>
              <span>{{ largeCategory.name }}</span>
            </div>

            <div class="mind-map-middle-list">
              <div
                v-for="middleCategory in largeCategory.children"
                :key="middleCategory.id"
                class="mind-map-middle-branch"
              >
                <div class="mind-map-middle-node">
                  <span class="mind-map-code">{{ middleCategory.code }}</span>
                  <span>{{ middleCategory.name }}</span>
                </div>
                <div class="mind-map-small-list">
                  <div
                    v-for="smallCategory in middleCategory.children"
                    :key="smallCategory.id"
                    class="mind-map-small-node"
                  >
                    <span class="mind-map-code">{{ smallCategory.code }}</span>
                    <span>{{ smallCategory.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <el-empty v-else-if="!categoryViewLoading" description="暂无有效商品分类" />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import { useCrudSchemas, type CrudSchema } from '@/hooks/web/useCrudSchemas'
import * as InventoryGoodsApi from '@/api/indebt/inventoryGoods'

defineOptions({ name: 'InventoryGoodsManagement' })

type CategoryMindMapNode = {
  id: string
  code: string
  name: string
  children: CategoryMindMapNode[]
}

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '商品大类编码',
    field: 'largeCategoryCode',
    fixed: 'left',
    minWidth: 145,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入大类编码' } }
  },
  {
    label: '商品大类名称',
    field: 'largeCategoryName',
    minWidth: 165,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入大类名称' } }
  },
  { label: '商品中类编码', field: 'middleCategoryCode', minWidth: 145 },
  { label: '商品中类名称', field: 'middleCategoryName', minWidth: 165 },
  { label: '商品小类编码', field: 'smallCategoryCode', minWidth: 145 },
  { label: '商品小类名称', field: 'smallCategoryName', minWidth: 165 },
  { label: '备注', field: 'remark', minWidth: 220 },
  {
    label: '状态',
    field: 'status',
    minWidth: 100,
    isSearch: true,
    search: {
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '全部', value: '' },
          { label: '启用', value: '启用' },
          { label: '历史', value: '历史' }
        ]
      }
    }
  },
  { label: '维护时间', field: 'maintainTime', minWidth: 170 },
  { label: '维护人', field: 'maintainer', minWidth: 110 }
])

const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, tableMethods } = useTable<InventoryGoodsApi.InventoryGoodsRecord>({
  getListApi: InventoryGoodsApi.getInventoryGoodsPage
})
const { getList, setSearchParams } = tableMethods

const currentRow = ref<InventoryGoodsApi.InventoryGoodsRecord>()
const formVisible = ref(false)
const categoryViewVisible = ref(false)
const categoryViewLoading = ref(false)
const saveLoading = ref(false)
const formRef = ref<FormInstance>()
const categoryMindMap = ref<CategoryMindMapNode[]>([])
const activeCategoryCount = ref(0)

const initialFormData = (): InventoryGoodsApi.InventoryGoodsForm => ({
  largeCategoryCode: '',
  largeCategoryName: '',
  middleCategoryCode: '',
  middleCategoryName: '',
  smallCategoryCode: '',
  smallCategoryName: '',
  remark: ''
})

const formData = reactive<InventoryGoodsApi.InventoryGoodsForm>(initialFormData())
const formRules: FormRules<InventoryGoodsApi.InventoryGoodsForm> = {
  largeCategoryCode: [{ required: true, message: '请输入商品大类编码', trigger: 'blur' }],
  largeCategoryName: [{ required: true, message: '请输入商品大类名称', trigger: 'blur' }],
  middleCategoryCode: [{ required: true, message: '请输入商品中类编码', trigger: 'blur' }],
  middleCategoryName: [{ required: true, message: '请输入商品中类名称', trigger: 'blur' }],
  smallCategoryCode: [{ required: true, message: '请输入商品小类编码', trigger: 'blur' }],
  smallCategoryName: [{ required: true, message: '请输入商品小类名称', trigger: 'blur' }]
}

const buildCategoryMindMap = (
  records: InventoryGoodsApi.InventoryGoodsRecord[]
): CategoryMindMapNode[] => {
  const largeCategories = new Map<string, CategoryMindMapNode>()

  records.forEach((record) => {
    const largeId = `large-${record.largeCategoryCode}`
    let largeCategory = largeCategories.get(largeId)
    if (!largeCategory) {
      largeCategory = {
        id: largeId,
        code: record.largeCategoryCode,
        name: record.largeCategoryName,
        children: []
      }
      largeCategories.set(largeId, largeCategory)
    }

    const middleId = `${largeId}-middle-${record.middleCategoryCode}`
    let middleCategory = largeCategory.children.find((item) => item.id === middleId)
    if (!middleCategory) {
      middleCategory = {
        id: middleId,
        code: record.middleCategoryCode,
        name: record.middleCategoryName,
        children: []
      }
      largeCategory.children.push(middleCategory)
    }

    middleCategory.children.push({
      id: `small-${record.id}`,
      code: record.smallCategoryCode,
      name: record.smallCategoryName,
      children: []
    })
  })

  return Array.from(largeCategories.values())
}

const buttons = ref<ActionButton[]>([
  {
    key: 'create',
    label: '新增新品类',
    icon: 'ep:plus',
    plain: true,
    onClick: () => openCreate()
  },
  {
    key: 'history',
    label: '置为历史',
    icon: 'ep:folder-delete',
    plain: true,
    onClick: (button) => handleSetHistory(button)
  },
  {
    key: 'category-view',
    label: '品类视图',
    icon: 'ep:share',
    plain: true,
    onClick: () => openCategoryView()
  }
])

const handleRowClick = (row: InventoryGoodsApi.InventoryGoodsRecord) => {
  currentRow.value = row
  tableObject.currentRow = row
}

const clearCurrentRow = () => {
  currentRow.value = undefined
  tableObject.currentRow = null
}

const refreshList = async () => {
  clearCurrentRow()
  await getList()
}

const handleSearch = (params: Recordable) => {
  clearCurrentRow()
  setSearchParams(params)
}

const openCategoryView = async () => {
  categoryViewVisible.value = true
  categoryViewLoading.value = true
  try {
    const activeRecords = await InventoryGoodsApi.getActiveInventoryGoods()
    categoryMindMap.value = buildCategoryMindMap(activeRecords)
    activeCategoryCount.value = activeRecords.length
  } finally {
    categoryViewLoading.value = false
  }
}

const openCreate = () => {
  Object.assign(formData, initialFormData())
  formRef.value?.clearValidate()
  formVisible.value = true
}

const handleCreate = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  saveLoading.value = true
  try {
    await InventoryGoodsApi.createInventoryGoods({ ...formData })
    ElMessage.success('新品类已新增')
    formVisible.value = false
    await refreshList()
  } finally {
    saveLoading.value = false
  }
}

const handleSetHistory = async (button: ActionButton) => {
  if (!currentRow.value) {
    ElMessage.warning('请先点击选择一条商品品类数据')
    return
  }
  if (currentRow.value.status === '历史') {
    ElMessage.warning('当前品类已经是历史状态')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确认将“${currentRow.value.smallCategoryName}”置为历史吗？`,
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
  } catch {
    return
  }

  button.loading = true
  try {
    await InventoryGoodsApi.setInventoryGoodsHistory([currentRow.value.id])
    ElMessage.success('已置为历史')
    await refreshList()
  } finally {
    button.loading = false
  }
}

watch(
  () => [tableObject.currentPage, tableObject.pageSize],
  () => clearCurrentRow()
)

onMounted(refreshList)
</script>

<style scoped lang="scss">
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 12px;
}

.category-mind-map {
  min-height: 420px;
  overflow: auto;
  padding: 8px 4px 20px;
}

.mind-map-content {
  min-width: 920px;
  padding: 8px 20px;
}

.mind-map-root {
  position: relative;
  display: flex;
  width: fit-content;
  min-width: 190px;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin: 0 auto 42px;
  padding: 14px 24px;
  color: #fff;
  background: linear-gradient(135deg, #1d74d8, #4c9cf5);
  border-radius: 12px;
  box-shadow: 0 8px 18px rgb(43 119 209 / 22%);
}

.mind-map-root::after {
  position: absolute;
  bottom: -26px;
  width: 2px;
  height: 26px;
  content: '';
  background: #9fc3ef;
}

.mind-map-root-title {
  font-size: 17px;
  font-weight: 600;
}

.mind-map-root-count {
  font-size: 12px;
  opacity: 0.9;
}

.mind-map-branches {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 30px 24px;
}

.mind-map-branches::before {
  position: absolute;
  top: -17px;
  right: 9%;
  left: 9%;
  height: 1px;
  content: '';
  background: #9fc3ef;
}

.mind-map-large-branch {
  position: relative;
}

.mind-map-large-branch::before {
  position: absolute;
  top: -17px;
  left: 50%;
  width: 1px;
  height: 17px;
  content: '';
  background: #9fc3ef;
}

.mind-map-large-node,
.mind-map-middle-node,
.mind-map-small-node {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
}

.mind-map-large-node {
  justify-content: center;
  padding: 10px 14px;
  color: #175ca8;
  font-weight: 600;
  background: #eaf4ff;
  border: 1px solid #acd0f8;
}

.mind-map-middle-list {
  display: grid;
  gap: 14px;
  margin-top: 14px;
}

.mind-map-middle-branch {
  position: relative;
  padding-left: 22px;
  border-left: 1px solid #b9d5f4;
}

.mind-map-middle-branch::before {
  position: absolute;
  top: 17px;
  left: 0;
  width: 20px;
  height: 1px;
  content: '';
  background: #b9d5f4;
}

.mind-map-middle-node {
  padding: 8px 10px;
  color: #256c4e;
  background: #effaf5;
  border: 1px solid #bce5d2;
}

.mind-map-small-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.mind-map-small-node {
  padding: 6px 8px;
  color: #5a6778;
  font-size: 12px;
  background: #f7f9fc;
  border: 1px solid #dce5ef;
}

.mind-map-code {
  color: #3976b3;
  font-family: var(--el-font-family-monospace);
  font-size: 12px;
  white-space: nowrap;
}

@media screen and (max-width: 720px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
