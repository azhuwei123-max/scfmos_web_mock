<template>
  <div v-loading="loading" class="project-credit-detail">
    <div class="detail-tabs">
      <el-button
        v-for="tab in detail?.tabs || []"
        :key="tab.key"
        :type="activeTab === tab.key ? 'primary' : 'default'"
        plain
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </el-button>
    </div>

    <template v-if="detail">
      <section v-if="activeTab === 'detail'" class="detail-workspace">
        <aside class="detail-sidebar">
          <div class="customer-heading">
            <span class="customer-avatar">项</span>
            <div>
              <p>{{ detail.customerName }}</p>
              <span>{{ detail.customerId }}</span>
            </div>
          </div>

          <el-collapse v-model="openedGroup" accordion class="detail-menu">
            <el-collapse-item
              v-for="group in detail.menuGroups"
              :key="group.key"
              :name="group.key"
            >
              <template #title>
                <Icon icon="ep:folder-opened" class="menu-folder" />
                <span>{{ group.title }}</span>
              </template>
              <button
                v-for="item in group.items"
                :key="item.key"
                type="button"
                class="detail-menu-item"
                :class="{ 'is-active': activeSection === item.key }"
                @click="selectSection(group.key, item.key)"
              >
                <span class="menu-dot" />
                {{ item.label }}
              </button>
            </el-collapse-item>
          </el-collapse>
        </aside>

        <main class="detail-content">
          <div class="detail-toolbar">
            <div>
              <h1>{{ detail.title }}</h1>
              <p>申请编号：{{ detail.applicationNo }}</p>
            </div>
            <div class="toolbar-actions">
              <el-tag type="warning" effect="light">{{ detail.status }}</el-tag>
              <el-button :loading="saving" @click="handleSave">
                <Icon icon="ep:document" class="mr-5px" />保存
              </el-button>
            </div>
          </div>

          <div class="section-card">
            <div class="section-title">
              <span>{{ activeSectionData.title }}</span>
              <small v-if="activeSectionData.description">{{ activeSectionData.description }}</small>
            </div>

            <div v-if="activeSectionData.fields?.length" class="field-grid">
              <div
                v-for="field in activeSectionData.fields"
                :key="field.label"
                class="field-row"
                :class="{ 'field-row--full': field.span === 2 }"
              >
                <span class="field-label">{{ field.label }}</span>
                <span class="field-value">{{ field.value }}</span>
              </div>
            </div>

            <el-table
              v-if="activeSectionData.rows?.length"
              :data="activeSectionData.rows"
              border
              stripe
              class="detail-table"
            >
              <el-table-column
                v-for="column in activeSectionData.columns"
                :key="column.prop"
                :prop="column.prop"
                :label="column.label"
                min-width="140"
              />
            </el-table>
          </div>
        </main>
      </section>

      <section v-else-if="activeTab === 'customer'" class="customer-detail-tab">
        <div class="detail-toolbar">
          <div>
            <h1>客户详情</h1>
            <p>客户基础资料（本地 Mock）</p>
          </div>
          <el-tag type="success" effect="light">已核验</el-tag>
        </div>
        <div class="section-card">
          <div class="section-title"><span>客户基本信息</span></div>
          <div class="field-grid">
            <div
              v-for="field in detail.customer.fields"
              :key="field.label"
              class="field-row"
              :class="{ 'field-row--full': field.span === 2 }"
            >
              <span class="field-label">{{ field.label }}</span>
              <span class="field-value">{{ field.value }}</span>
            </div>
          </div>
        </div>
      </section>

      <section v-else class="attachments-tab">
        <div class="detail-toolbar">
          <div>
            <h1>影像系统资料</h1>
            <p>以下为本地演示使用的影像资料清单</p>
          </div>
          <el-tag type="info" effect="light">Mock 数据</el-tag>
        </div>
        <div class="attachment-list">
          <el-card v-for="file in detail.attachments" :key="file.name" shadow="never" class="attachment-card">
            <div class="attachment-icon"><Icon icon="ep:document" /></div>
            <div class="attachment-main">
              <strong>{{ file.name }}</strong>
              <span>{{ file.type }} · {{ file.date }}</span>
            </div>
            <el-tag :type="file.status === '已归档' ? 'success' : 'warning'" effect="plain">
              {{ file.status }}
            </el-tag>
          </el-card>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import {
  getProjectCreditDetail,
  saveProjectCreditDetail
} from '@/api/creditapplication/creditApplyJob/projectCreditDetail'

interface DetailField {
  label: string
  value: string
  span?: number
}

interface DetailSection {
  title: string
  description?: string
  fields?: DetailField[]
  columns?: Array<{ prop: string; label: string }>
  rows?: Array<Record<string, string>>
}

interface DetailData {
  title: string
  applicationNo: string
  customerName: string
  customerId: string
  status: string
  tabs: Array<{ key: string; label: string }>
  menuGroups: Array<{ key: string; title: string; items: Array<{ key: string; label: string }> }>
  sections: Record<string, DetailSection>
  customer: { fields: DetailField[] }
  attachments: Array<{ name: string; type: string; date: string; status: string }>
}

defineOptions({ name: 'ProjectCreditDetail' })

const route = useRoute()
const detail = ref<DetailData>()
const loading = ref(false)
const saving = ref(false)
const activeTab = ref('detail')
const activeSection = ref('basic')
const openedGroup = ref('application')

const activeSectionData = computed<DetailSection>(() =>
  detail.value?.sections[activeSection.value] || { title: '详情信息' }
)

const loadDetail = async () => {
  loading.value = true
  try {
    detail.value = await getProjectCreditDetail({
      serialNo: route.query.serialNo || route.query.objectNo
    })
  } finally {
    loading.value = false
  }
}

const selectSection = (groupKey: string, sectionKey: string) => {
  openedGroup.value = groupKey
  activeSection.value = sectionKey
}

const handleSave = async () => {
  saving.value = true
  try {
    await saveProjectCreditDetail({
      serialNo: detail.value?.applicationNo,
      activeSection: activeSection.value
    })
    ElMessage.success('本地 Mock 演示数据已保存')
  } finally {
    saving.value = false
  }
}

watch(
  () => [route.query.serialNo, route.query.objectNo],
  () => loadDetail(),
  { immediate: true }
)
</script>

<style scoped lang="scss">
.project-credit-detail {
  min-height: calc(100vh - 130px);
  padding: 8px;
  background: var(--el-bg-color-page);
}

.detail-tabs {
  display: flex;
  gap: 0;
  padding: 0 4px 8px;

  .el-button {
    margin: 0;
    border-radius: 0;
  }
}

.detail-workspace {
  display: grid;
  grid-template-columns: 248px minmax(0, 1fr);
  min-height: calc(100vh - 178px);
  overflow: hidden;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
}

.detail-sidebar {
  overflow: auto;
  padding: 14px 10px;
  background: #f6f8fb;
  border-right: 1px solid var(--el-border-color-lighter);
}

.customer-heading {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 2px 8px 16px;

  p {
    margin: 0 0 3px;
    overflow: hidden;
    font-size: 15px;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span:not(.customer-avatar) {
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }
}

.customer-avatar {
  display: grid;
  flex: 0 0 34px;
  width: 34px;
  height: 34px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(135deg, #367cf6, #154fb7);
  border-radius: 50%;
  place-items: center;
}

.detail-menu {
  border-top: 0;
  border-bottom: 0;
}

.menu-folder {
  margin-right: 7px;
  color: #7789a4;
}

.detail-menu-item {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 34px;
  padding: 0 12px 0 24px;
  color: var(--el-text-color-regular);
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 4px;

  &:hover,
  &.is-active {
    color: var(--el-color-primary);
    background: #eaf2ff;
  }

  &.is-active {
    font-weight: 600;
  }
}

.menu-dot {
  width: 5px;
  height: 5px;
  margin-right: 9px;
  background: #63b36d;
  border-radius: 50%;
}

.detail-content,
.customer-detail-tab,
.attachments-tab {
  min-width: 0;
  padding: 24px 28px;
  background: var(--el-bg-color);
}

.detail-toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 18px;

  h1 {
    margin: 0 0 8px;
    color: var(--el-text-color-primary);
    font-size: 20px;
    line-height: 1.25;
  }

  p {
    margin: 0;
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }
}

.toolbar-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.section-card {
  padding: 20px 22px;
  background: #fff;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
}

.section-title {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);

  span {
    color: var(--el-text-color-primary);
    font-size: 17px;
    font-weight: 700;
  }

  small {
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 28px;
}

.field-row {
  display: grid;
  grid-template-columns: 138px minmax(0, 1fr);
  align-items: start;
  min-height: 42px;
  border-bottom: 1px solid #f0f2f5;

  &--full {
    grid-column: 1 / -1;
  }
}

.field-label {
  padding: 11px 10px 10px 0;
  color: var(--el-text-color-secondary);
  font-size: 13px;
  line-height: 20px;
}

.field-value {
  padding: 11px 0 10px;
  color: var(--el-text-color-primary);
  font-size: 14px;
  line-height: 20px;
  word-break: break-word;
}

.detail-table {
  margin-top: 4px;
}

.attachment-list {
  display: grid;
  gap: 12px;
}

.attachment-card :deep(.el-card__body) {
  display: flex;
  gap: 14px;
  align-items: center;
}

.attachment-icon {
  display: grid;
  width: 38px;
  height: 38px;
  color: var(--el-color-primary);
  font-size: 21px;
  background: #edf4ff;
  border-radius: 6px;
  place-items: center;
}

.attachment-main {
  display: grid;
  flex: 1;
  gap: 4px;

  strong {
    color: var(--el-text-color-primary);
    font-size: 14px;
  }

  span {
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }
}

@media (max-width: 900px) {
  .detail-workspace {
    grid-template-columns: 1fr;
  }

  .detail-sidebar {
    border-right: 0;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  .field-grid {
    grid-template-columns: 1fr;
  }

  .field-row--full {
    grid-column: auto;
  }
}
</style>
