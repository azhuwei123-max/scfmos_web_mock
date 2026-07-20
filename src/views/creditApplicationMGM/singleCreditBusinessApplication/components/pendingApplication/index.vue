<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="68px"
    >
      <el-form-item label="申请编号" prop="name">
        <el-input
          v-model="queryParams.name"
          class="!w-240px"
          clearable
          placeholder="请输入申请编号"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="code">
        <el-input
          v-model="queryParams.code"
          class="!w-240px"
          clearable
          placeholder="请输入客户名称"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商户标识" label-width="130px" prop="status">
        <el-select
          v-model="queryParams.status"
          class="!w-150px"
          clearable
          placeholder="请选择商户标识"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="业务品种" prop="code">
        <el-input
          v-model="queryParams.code"
          class="!w-240px"
          clearable
          placeholder="请输入业务品种"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发生类型" prop="code">
        <el-input
          v-model="queryParams.code"
          class="!w-240px"
          clearable
          placeholder="请输入发生类型"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="resetQuery" style="width: 74px"> 重置 </el-button>
        <el-button @click="handleQuery" tpye="" style="width: 74px"> 查询 </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div style="display: flex; justify-content: space-between; margin-bottom: 17px">
      <div style="font-size: 18px; font-weight: 700"> 查询结果</div>
      <div>
        <el-button @click="goDetail" plain type="" style="width: 74px">
          <Icon class="mr-5px" icon="ep:edit" />
          详情
        </el-button>
        <el-button v-hasPermi="['system:role:create']" plain tpye="" @click="add('create')">
          <Icon class="mr-5px" icon="ep:plus" />
          新增
        </el-button>
      </div>
    </div>
    <el-table v-loading="loading" :data="list" :header-cell-style="{ background: '#F7F8FA' }" @row-dblclick="goDetail">
      
      <el-table-column align="center" label="申请编号" prop="name" />
      <el-table-column align="center" label="客户名称" prop="type" />
      <el-table-column align="center" label="商户标识" prop="id" />
      <el-table-column align="center" label="业务品种" prop="code" />
      <el-table-column align="center" label="发生类型" prop="sort" />
      <el-table-column align="center" label="业务流程类型" prop="remark" />
      <el-table-column align="center" label="币种" prop="remark" />
      <el-table-column align="center" label="申请金额" prop="remark" />
      <el-table-column align="center" label="业务来源" prop="remark" />
      <el-table-column align="center" label="申请人申请机构" prop="remark" />
      <el-table-column align="center" label="当前六册灰姑娘" prop="remark" />
      <el-table-column align="center" label="当前阶段" prop="remark" />
      <el-table-column align="center" label="完成时间" prop="remark" />
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />

  </ContentWrap>
</template>

<script setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { defineOptions, reactive, ref, shallowRef } from 'vue'
import { checkPermi } from '@/utils/permission'

defineOptions({
  name: 'pendingApplication'
})
const router = useRouter() // 路由

const queryParams = reactive({})

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 添加/修改操作 */
const addCustomerRef = ref()
const add = (type, id) => {
  addCustomerRef.value.open(type, id)
}

const handleCommand = () => {}

/** 查询角色列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await RoleApi.getRolePage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const goDetail = () => {
  router.push('/customerInfoMGM/companyCustomerMGM/customerMGM/customerDetail')
}
</script>
