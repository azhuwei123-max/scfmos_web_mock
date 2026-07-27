<template>
  <div class="order-contract-ledger-layout">
    <aside class="ledger-plan-aside">
      <div v-for="plan in plans" :key="plan.key" class="menu-group">
        <button class="side-item group-header" @click="selectPlan(plan.key)">
          <Icon icon="ep:folder-opened" />
          <span class="side-item-text">{{ plan.label }}</span>
          <Icon size="12" :icon="activePlan === plan.key ? 'ep:arrow-up' : 'ep:arrow-down'" class="group-icon" />
        </button>
        <div v-show="activePlan === plan.key" class="group-children">
          <button class="side-item side-item-child side-item-select" @click="selectPlan(plan.key)">
            <span class="plan-dot"></span>
            <span class="side-item-text">订单/合同台账查询</span>
          </button>
        </div>
      </div>
    </aside>
    <main class="ledger-plan-content">
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
const plans: Array<{ key: ProductPlanKey; label: string }> = [
  { key: 'prepayment', label: '先票/款后货' },
  { key: 'pledge', label: '货押融资' }
]

const selectPlan = (plan: ProductPlanKey) => {
  activePlan.value = plan
}
</script>

<style scoped lang="scss">
.order-contract-ledger-layout {
  display: flex;
  min-height: calc(100vh - 150px);
  margin: -20px;
  background: #f5f6f8;
}

.ledger-plan-aside {
  width: 258px;
  flex: 0 0 258px;
  min-height: inherit;
  padding: 8px;
  background: #fff;
  box-shadow: -5px 0 5px -2px #cecdcd inset;
}

.side-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 36px;
  margin: 4px 0;
  padding: 0 20px;
  border: 0;
  color: #333;
  background: transparent;
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  line-height: 36px;
  text-align: left;
  transition: all 0.2s ease;
}

.side-item-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.group-header {
  color: #333;
  font-weight: 500;
}

.group-header :deep(.iconify) {
  flex: 0 0 auto;
  margin-right: 7px;
  color: #596b7d;
  font-size: 17px;
}

.group-header .group-icon {
  margin-right: 0;
  margin-left: 8px;
  color: #697786;
  font-size: 12px;
}

.side-item-child {
  padding-left: 34px;
}

.side-item-select {
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
  font-weight: 500;
}

.plan-dot {
  width: 6px;
  height: 6px;
  flex: 0 0 6px;
  margin-right: 9px;
  background: #5ce472;
}

.ledger-plan-content {
  min-width: 0;
  flex: 1;
  padding: 18px 20px;
}

@media (max-width: 900px) {
  .order-contract-ledger-layout { margin: -12px; }
  .ledger-plan-aside { width: 210px; flex-basis: 210px; }
  .ledger-plan-content { padding: 14px 12px; }
}
</style>
