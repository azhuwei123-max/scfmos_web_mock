<template>
  <div class="flex items-center mb-2 w-[110px]" @click="isExpand = !isExpand">
    <Icon v-show="!isExpand" class="mr-4px" icon="ep:plus" />
    <Icon v-show="isExpand" class="mr-4px" icon="ep:minus" />
    <el-button link> 查询条件 </el-button>
  </div>
  <el-form
    ref="queryFormRef"
    v-show="isExpand"
    :model="queryParams"
    class="search-form"
    label-width="auto"
    @keyup.enter="search"
  >
    <el-form-item label="申请流水号" prop="serialNo">
      <el-input
        v-model="queryParams.serialNo"
        class="!w-240px"
        clearable
        placeholder="请输入申请流水号"
      />
    </el-form-item>
    <el-form-item label="客户名称" prop="customerName">
      <el-input
        v-model="queryParams.customerName"
        class="!w-240px"
        clearable
        placeholder="请输入客户名称"
      />
    </el-form-item>
    <el-form-item label="客户证件号" prop="certId">
      <el-input
        v-model="queryParams.certID"
        class="!w-240px"
        clearable
        placeholder="请输入客户证件号"
      />
    </el-form-item>
    <el-form-item label="核心客户号" prop="mfCustomerID">
      <el-input
        v-model="queryParams.mfCustomerID"
        class="!w-240px"
        clearable
        placeholder="请输入核心客户号"
      />
    </el-form-item>
    <el-form-item>
      <el-button @click="search" tpye=""
        ><Icon class="mr-5px" icon="ep:search" /> 查询
      </el-button>
      <el-button @click="reSearch"> <Icon class="mr-5px" icon="ep:refresh" />重置 </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>

const props = defineProps({
  queryParams: Object,
  search: Function,
  reSearch: Function,
})
const isExpand = ref(false)
</script>
