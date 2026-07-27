<template>
  <div class="order-contract-ledger-layout">
    <aside class="ledger-plan-aside">
      <div class="ledger-plan-title">
        <Icon icon="ep:folder-opened" />
        <span>产品方案</span>
      </div>
      <el-collapse v-model="activePlan" accordion class="ledger-plan-collapse" @change="handlePlanChange">
        <el-collapse-item name="prepayment">
          <template #title>
            <div class="ledger-plan-heading">
              <Icon icon="ep:folder" />
              <span>先票/款后货</span>
            </div>
          </template>
          <button class="ledger-plan-leaf" :class="{ active: activePlan === 'prepayment' }" @click="selectPlan('prepayment')">
            <span class="plan-dot"></span>订单/合同台账查询
          </button>
        </el-collapse-item>
        <el-collapse-item name="pledge">
          <template #title>
            <div class="ledger-plan-heading">
              <Icon icon="ep:folder" />
              <span>货押融资</span>
            </div>
          </template>
          <button class="ledger-plan-leaf" :class="{ active: activePlan === 'pledge' }" @click="selectPlan('pledge')">
            <span class="plan-dot"></span>订单/合同台账查询
          </button>
        </el-collapse-item>
      </el-collapse>
    </aside>
    <main class="ledger-plan-content">
      <div class="ledger-plan-content-header">
        <div>
          <h2>{{ productPlan }}</h2>
          <p>订单/合同台账查询</p>
        </div>
        <el-tag effect="plain" type="info">{{ productPlan }}</el-tag>
      </div>
      <OrderContractLedgerWorkList :params="{ productPlan }" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import OrderContractLedgerWorkList from './components/workList/index.vue'

defineOptions({ name: 'OrderContractLedgerQuery' })

type ProductPlanKey = 'prepayment' | 'pledge'

const route = useRoute()
const activePlan = ref<ProductPlanKey>(String(route.path || '').includes('/pledge') ? 'pledge' : 'prepayment')
const productPlan = computed(() => activePlan.value === 'pledge' ? '货押融资' : '先票/款后货')

const selectPlan = (plan: ProductPlanKey) => {
  activePlan.value = plan
}

const handlePlanChange = (plan: string | string[]) => {
  const selectedPlan = Array.isArray(plan) ? plan[0] : plan
  if (selectedPlan === 'prepayment' || selectedPlan === 'pledge') activePlan.value = selectedPlan
}
</script>

<style scoped lang="scss">
.order-contract-ledger-layout {
  display: flex;
  min-height: calc(100vh - 150px);
  margin: -20px;
  background: var(--el-bg-color-page);
}

.ledger-plan-aside {
  width: 250px;
  flex: 0 0 250px;
  padding: 14px 8px;
  border-right: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);
}

.ledger-plan-title,
.ledger-plan-heading {
  display: flex;
  align-items: center;
  gap: 9px;
}

.ledger-plan-title {
  height: 42px;
  padding: 0 14px;
  color: var(--el-text-color-primary);
  font-size: 16px;
  font-weight: 600;
}

.ledger-plan-title :deep(.iconify) {
  color: #556b82;
  font-size: 19px;
}

.ledger-plan-collapse {
  border: 0;
}

.ledger-plan-collapse :deep(.el-collapse-item__header) {
  height: 48px;
  padding: 0 14px;
  border-bottom: 0;
  color: var(--el-text-color-primary);
  font-size: 15px;
}

.ledger-plan-collapse :deep(.el-collapse-item__wrap) {
  border-bottom: 0;
}

.ledger-plan-collapse :deep(.el-collapse-item__content) {
  padding-bottom: 6px;
}

.ledger-plan-heading :deep(.iconify) {
  color: #6a7c90;
  font-size: 17px;
}

.ledger-plan-leaf {
  display: flex;
  align-items: center;
  width: calc(100% - 16px);
  height: 42px;
  margin: 0 8px;
  padding: 0 14px 0 24px;
  border: 0;
  border-radius: 5px;
  color: var(--el-text-color-regular);
  background: transparent;
  cursor: pointer;
  font: inherit;
  text-align: left;
}

.ledger-plan-leaf:hover {
  background: #f4f7fb;
}

.ledger-plan-leaf.active {
  color: var(--el-color-primary);
  background: #eef5ff;
  font-weight: 600;
}

.plan-dot {
  width: 7px;
  height: 7px;
  margin-right: 10px;
  border-radius: 50%;
  background: #67c23a;
}

.ledger-plan-content {
  min-width: 0;
  flex: 1;
  padding: 18px 20px;
}

.ledger-plan-content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 46px;
  margin-bottom: 12px;
}

.ledger-plan-content-header h2 {
  margin: 0;
  color: var(--el-text-color-primary);
  font-size: 20px;
  font-weight: 600;
}

.ledger-plan-content-header p {
  margin: 5px 0 0;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

@media (max-width: 900px) {
  .order-contract-ledger-layout { margin: -12px; }
  .ledger-plan-aside { width: 210px; flex-basis: 210px; }
  .ledger-plan-content { padding: 14px 12px; }
}
</style>
