<template>
  <ContentWrap v-loading="loading">
    <!-- 操作按钮 - 头部 -->
    <div class="flex justify-between items-center mb-20px">
      <div class="flex gap-10px">
        <el-button tpye="" :loading="saving" @click="handleSave">
          <Icon icon="ep:document" class="mr-5px" />
          保存
        </el-button>
        <el-button @click="handleBack">
          <Icon icon="ep:arrow-left" class="mr-5px" />
          返回
        </el-button>
      </div>
      <el-button @click="handleAddSupplyChainMember">
        加入供应链群成员
      </el-button>
    </div>

    <!-- 表单内容 -->
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="160px"
      class="detail-form"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="流水号" prop="serialNumber">
            <el-input
              v-model="formData.serialNumber"
              :disabled="route.params.id !== 'create'"
              placeholder="自动生成"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业编号" prop="enterpriseId" required>
            <el-input
              v-model="formData.enterpriseId"
              placeholder="请输入企业编号"
              clearable
            >
              <template #append>
                <el-button @click="handleSelectEnterprise">
                  <Icon icon="ep:more" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="企业名称" prop="enterpriseName" required>
            <el-input
              v-model="formData.enterpriseName"
              placeholder="请输入企业名称"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="操作类型" prop="operationType" required>
            <el-select
              v-model="formData.operationType"
              placeholder="请选择操作类型"
              clearable
              style="width: 100%"
            >
              <el-option label="新增" value="新增" />
              <el-option label="修改" value="修改" />
              <el-option label="删除" value="删除" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="营业执照号码" prop="businessLicenseNumber" required>
            <el-input
              v-model="formData.businessLicenseNumber"
              placeholder="请输入营业执照号码"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="法定代表人编号" prop="legalRepresentativeId" required>
            <el-input
              v-model="formData.legalRepresentativeId"
              placeholder="请输入法定代表人编号"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="法定代表人姓名" prop="legalRepresentativeName" required>
            <el-input
              v-model="formData.legalRepresentativeName"
              placeholder="请输入法定代表人姓名"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="法定代表人身份证号码" prop="legalRepresentativeIdCard" required>
            <el-input
              v-model="formData.legalRepresentativeIdCard"
              placeholder="请输入法定代表人身份证号码"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="法定代表人联系方式" prop="legalRepresentativeContact" required>
            <el-input
              v-model="formData.legalRepresentativeContact"
              placeholder="请输入法定代表人联系方式"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业基本账户户名" prop="basicAccountName" required>
            <el-input
              v-model="formData.basicAccountName"
              placeholder="请输入企业基本账户户名"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="企业基本账户账号" prop="basicAccountNumber" required>
            <el-input
              v-model="formData.basicAccountNumber"
              placeholder="请输入企业基本账户账号"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业基本账户开户银行" prop="basicAccountBank" required>
            <el-input
              v-model="formData.basicAccountBank"
              placeholder="请输入企业基本账户开户银行"
              clearable
            >
              <template #append>
                <el-button @click="handleSelectBank">
                  <Icon icon="ep:more" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="登记机构" prop="registrationInstitution">
            <el-input
              v-model="formData.registrationInstitution"
              placeholder="请输入登记机构"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记人名称" prop="registrantName">
            <el-input
              v-model="formData.registrantName"
              placeholder="请输入登记人名称"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="登记时间" prop="registrationTime">
            <el-date-picker
              v-model="formData.registrationTime"
              type="date"
              placeholder="请选择登记时间"
              value-format="YYYY/MM/DD"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </ContentWrap>

  <!-- 加入供应链群成员对话框 -->
  <Dialog 
    :model-value="supplyChainDialogVisible" 
    @update:model-value="supplyChainDialogVisible = $event"
    title="选择合作项目" 
    :fullscreen="false"
    :append-to-body="true"
    width="800px"
  >
    <el-table
      v-loading="supplyChainLoading"
      :data="supplyChainProjectList"
      border
      style="width: 100%"
      @selection-change="handleSupplyChainSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="合作项目编号" prop="projectNo" min-width="180" />
      <el-table-column label="合作项目名称" prop="projectName" min-width="200" show-overflow-tooltip />
    </el-table>
    <!-- 分页 -->
    <div class="supply-chain-pagination">
      <Pagination
        v-model:limit="supplyChainQueryParams.pageSize"
        v-model:page="supplyChainQueryParams.pageNo"
        :total="supplyChainTotal"
        @pagination="getSupplyChainProjectList"
      />
    </div>
    <template #footer>
      <el-button tpye="" @click="handleConfirmAddSupplyChain" :disabled="selectedSupplyChainProject === null">
        确 定
      </el-button>
      <el-button @click="supplyChainDialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <!-- 选择企业对话框 -->
  <Dialog 
    :model-value="enterpriseDialogVisible" 
    @update:model-value="enterpriseDialogVisible = $event"
    title="选择企业" 
    :fullscreen="false"
    :append-to-body="true"
    width="1000px"
  >
    <el-table
      v-loading="enterpriseLoading"
      :data="enterpriseList"
      border
      style="width: 100%"
      @row-click="handleEnterpriseRowClick"
      highlight-current-row
    >
      <el-table-column label="企业编号" prop="enterpriseId" min-width="180" />
      <el-table-column label="企业名称" prop="enterpriseName" min-width="200" show-overflow-tooltip />
      <el-table-column label="营业执照号码" prop="businessLicenseNumber" min-width="180" />
      <el-table-column label="法定代表人编号" prop="legalRepresentativeId" min-width="180" />
      <el-table-column label="法定代表人姓名" prop="legalRepresentativeName" min-width="150" />
      <el-table-column label="法定代表人身份证号码" prop="legalRepresentativeIdCard" min-width="200" />
      <el-table-column label="法定代表人联系方式" prop="legalRepresentativeContact" min-width="150" />
      <el-table-column label="企业基本账户户名" prop="basicAccountName" min-width="150" />
      <el-table-column label="企业基本账户账号" prop="basicAccountNumber" min-width="150" />
      <el-table-column label="企业基本账户开户银行" prop="basicAccountBank" min-width="200" show-overflow-tooltip />
    </el-table>
    <!-- 分页 -->
    <div class="enterprise-pagination">
      <Pagination
        v-model:limit="enterpriseQueryParams.pageSize"
        v-model:page="enterpriseQueryParams.pageNo"
        :total="enterpriseTotal"
        @pagination="getEnterpriseList"
      />
    </div>
    <template #footer>
      <el-button tpye="" @click="handleConfirmSelectEnterprise" :disabled="selectedEnterprise === null">
        确 定
      </el-button>
      <el-button @click="enterpriseDialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <!-- 选择银行对话框 -->
  <Dialog 
    :model-value="bankDialogVisible" 
    @update:model-value="bankDialogVisible = $event"
    title="选择银行" 
    :fullscreen="false"
    :append-to-body="true"
    width="800px"
  >
    <el-table
      v-loading="bankLoading"
      :data="bankList"
      border
      style="width: 100%"
      @row-click="handleBankRowClick"
      highlight-current-row
    >
      <el-table-column label="银行编号" prop="bankCode" min-width="150" />
      <el-table-column label="银行名称" prop="bankName" min-width="200" show-overflow-tooltip />
      <el-table-column label="银行简称" prop="bankShortName" min-width="150" />
      <el-table-column label="银行类型" prop="bankType" min-width="120" />
      <el-table-column label="状态" prop="status" min-width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '启用' ? 'success' : 'info'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="bank-pagination">
      <Pagination
        v-model:limit="bankQueryParams.pageSize"
        v-model:page="bankQueryParams.pageNo"
        :total="bankTotal"
        @pagination="getBankList"
      />
    </div>
    <template #footer>
      <el-button tpye="" @click="handleConfirmSelectBank" :disabled="selectedBank === null">
        确 定
      </el-button>
      <el-button @click="bankDialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { useTagsViewStoreWithOut } from '@/store/modules/tagsView'
import { ElMessageBox } from 'element-plus'
import { ydwkhbmdApi } from '@/api/creditapplication/ydwkhbmd'
// @ts-ignore
import Dialog from '@/components/Dialog/src/Dialog.vue'
import { propTypes } from '@/utils/propTypes'
import { log } from 'console'

defineOptions({ name: 'YdwkhbmdDetail' })


const props = defineProps({
  id:propTypes.number.def(undefined)
})

console.log('props',props);


const message = useMessage()
const router = useRouter()
const route = useRoute()
const tagsViewStore = useTagsViewStoreWithOut()

const loading = ref(false)
const saving = ref(false)
const formRef = ref()

// 加入供应链群成员相关
const supplyChainDialogVisible = ref(false)
const supplyChainLoading = ref(false)
const supplyChainProjectList = ref<any[]>([])
const selectedSupplyChainProject = ref<any>(null)
const supplyChainTotal = ref(0)
const supplyChainQueryParams = reactive({
  pageNo: 1,
  pageSize: 10
})

// 选择企业相关
const enterpriseDialogVisible = ref(false)
const enterpriseLoading = ref(false)
const enterpriseList = ref<any[]>([])
const selectedEnterprise = ref<any>(null)
const enterpriseTotal = ref(0)
const enterpriseQueryParams = reactive({
  pageNo: 1,
  pageSize: 10
})

// 选择银行相关
const bankDialogVisible = ref(false)
const bankLoading = ref(false)
const bankList = ref<any[]>([])
const selectedBank = ref<any>(null)
const bankTotal = ref(0)
const bankQueryParams = reactive({
  pageNo: 1,
  pageSize: 10
})

// 表单数据
const formData = reactive({
  serialNumber: '',
  enterpriseId: '',
  enterpriseName: '',
  operationType: '新增',
  businessLicenseNumber: '',
  legalRepresentativeId: '',
  legalRepresentativeName: '',
  legalRepresentativeIdCard: '',
  legalRepresentativeContact: '',
  basicAccountName: '',
  basicAccountNumber: '',
  basicAccountBank: '',
  registrationInstitution: '',
  registrantName: '',
  registrationTime: ''
})

// 表单验证规则
const formRules = {
  enterpriseId: [
    { required: true, message: '请输入企业编号', trigger: 'blur' }
  ],
  enterpriseName: [
    { required: true, message: '请输入企业名称', trigger: 'blur' }
  ],
  operationType: [
    { required: true, message: '请选择操作类型', trigger: 'change' }
  ],
  businessLicenseNumber: [
    { required: true, message: '请输入营业执照号码', trigger: 'blur' }
  ],
  legalRepresentativeId: [
    { required: true, message: '请输入法定代表人编号', trigger: 'blur' }
  ],
  legalRepresentativeName: [
    { required: true, message: '请输入法定代表人姓名', trigger: 'blur' }
  ],
  legalRepresentativeIdCard: [
    { required: true, message: '请输入法定代表人身份证号码', trigger: 'blur' }
  ],
  legalRepresentativeContact: [
    { required: true, message: '请输入法定代表人联系方式', trigger: 'blur' }
  ],
  basicAccountName: [
    { required: true, message: '请输入企业基本账户户名', trigger: 'blur' }
  ],
  basicAccountNumber: [
    { required: true, message: '请输入企业基本账户账号', trigger: 'blur' }
  ],
  basicAccountBank: [
    { required: true, message: '请输入企业基本账户开户银行', trigger: 'blur' }
  ]
}

// 设置页签标题
const updateTitle = () => {
  const id = route.params.id as string
  const titleFromQuery = (route.query.title as string) || ''
  
  // 如果是新增模式，使用查询参数中的标题
  if (id === 'create' && titleFromQuery) {
    tagsViewStore.updateVisitedView({
      ...route,
      meta: {
        ...route.meta,
        title: titleFromQuery
      }
    })
    return
  }
  
  // 编辑模式，使用流水号
  const serialNo = (route.query.serialNo as string) || ''
  const serialNumber = formData.serialNumber || serialNo || id
  const title = `企业信息(${serialNumber})-详情`
  
  // 更新当前路由的标题
  tagsViewStore.updateVisitedView({
    ...route,
    meta: {
      ...route.meta,
      title
    }
  })
}

// 生成流水号（模拟）
const generateSerialNumber = () => {
  // 生成格式：YYYYMMDD + 8位随机数字
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const random = String(Math.floor(Math.random() * 100000000)).padStart(8, '0')
  return `${year}${month}${day}${random}`
}

// 获取详情数据
const getDetailData = async () => {
  const id = route.params.id as string


  const serialNo =id || router.currentRoute.value.query.serialNo || props.id
  console.log('serialNo',serialNo,router.currentRoute.value);

  
  
  // 如果是新增模式（id为create），不加载数据，保持表单为空，但自动生成流水号
  if (serialNo === 'create') {
    // 自动生成流水号
    formData.serialNumber = generateSerialNumber()
    // 更新标题
    updateTitle()
    return
  }
  
  if (!serialNo) {
    message.error('参数错误')
    return
  }

  try {
    loading.value = true
    
    // 调用接口获取详情
    const res = await ydwkhbmdApi.getDetail({ serialNo })


    console.log('resresresres',res);
    
    // 根据接口返回的数据结构处理
    // 如果接口返回的是 { data: {} } 格式，提取 data
    // 如果直接返回对象，直接使用
    const data = res?.data || res || {}
    
    // 将接口返回的数据映射到表单字段
    // 根据API文档反向映射字段：
    // serialNo -> serialNumber
    // customerId -> enterpriseId
    // enterpriseName -> enterpriseName
    // licenseNo -> businessLicenseNumber
    // cooPersonName -> legalRepresentativeName
    // cooPersonId -> legalRepresentativeId
    // cooCorpId -> legalRepresentativeIdCard
    // basicAccount -> basicAccountName
    // basicBank -> basicAccountNumber
    // basicBankName -> basicAccountBank
    // cooPhoneId -> legalRepresentativeContact
    // occurType -> operationType
    Object.assign(formData, {
      serialNumber: data.serialNo || data.serialNumber || data.id || '',
      enterpriseId: data.customerId || data.enterpriseId || data.enterpriseNo || '',
      enterpriseName: data.enterpriseName || '',
      operationType: data.occurType || data.operationType || data.operateType || '新增',
      businessLicenseNumber: data.licenseNo || data.businessLicenseNumber || data.businessLicenseNo || '',
      legalRepresentativeId: data.cooPersonId || data.legalRepresentativeId || data.legalRepId || '',
      legalRepresentativeName: data.cooPersonName || data.legalRepresentativeName || data.legalRepName || '',
      legalRepresentativeIdCard: data.cooCorpId || data.legalRepresentativeIdCard || data.legalRepIdCard || '',
      legalRepresentativeContact: data.cooPhoneId || data.legalRepresentativeContact || data.legalRepContact || '',
      basicAccountName: data.basicAccount || data.basicAccountName || data.accountName || '',
      basicAccountNumber: data.basicBank || data.basicAccountNumber || data.accountNumber || '',
      basicAccountBank: data.basicBankName || data.basicAccountBank || data.accountBank || '',
      registrationInstitution: data.registrationInstitution || data.registerOrg || '',
      registrantName: data.registrantName || data.registerUser || '',
      registrationTime: data.registrationTime || data.registerTime || data.createTime || ''
    })
    
    // 更新标题
    updateTitle()
  } catch (error) {
    console.error('获取详情失败：', error)
    message.error('获取详情失败')
  } finally {
    loading.value = false
  }
}

// 保存
const handleSave = async () => {
  try {
    // 表单验证
    await formRef.value?.validate()
    
    saving.value = true
    
    const id = route.params.id as string
    const isCreate = !id || id === 'create'
    
    // 准备提交的数据，将表单字段映射到接口字段
    // 根据API文档映射字段：
    // serialNo: 申请流水号 (更新时后端通过serialNo校验，不需要传id)
    // customerId: 客户编号 (对应 enterpriseId)
    // enterpriseName: 企业名称
    // licenseNo: 营业执照号码 (对应 businessLicenseNumber)
    // cooPersonName: 法人代表姓名 (对应 legalRepresentativeName)
    // cooPersonId: 法人代表编号 (对应 legalRepresentativeId)
    // cooCorpId: 法人代表身份证号码 (对应 legalRepresentativeIdCard)
    // basicAccount: 企业基本银行户 (对应 basicAccountName)
    // basicBank: 企业基本行 (对应 basicAccountNumber)
    // basicBankName: 企业基本账户开户银行 (对应 basicAccountBank)
    // basicBankId: 基础账户企业开户银行 (可能需要从银行选择中获取)
    // cooPhoneId: 法人代表联系方式 (对应 legalRepresentativeContact)
    // occurType: 发生类型 (对应 operationType)
    // flowStatus: 企业白名单状态 (可能需要默认值)
    const submitData: any = {
      serialNo: formData.serialNumber, // 申请流水号 (更新时后端通过serialNo校验)
      customerId: formData.enterpriseId, // 客户编号
      enterpriseName: formData.enterpriseName, // 企业名称
      licenseNo: formData.businessLicenseNumber, // 营业执照号码
      cooPersonName: formData.legalRepresentativeName, // 法人代表姓名
      cooPersonId: formData.legalRepresentativeId, // 法人代表编号
      cooCorpId: formData.legalRepresentativeIdCard, // 法人代表身份证号码
      basicAccount: formData.basicAccountName, // 企业基本银行户
      basicBank: formData.basicAccountNumber, // 企业基本行
      basicBankName: formData.basicAccountBank, // 企业基本账户开户银行
      basicBankId: formData.basicAccountBank, // 基础账户企业开户银行 (暂时使用开户银行名称，后续可能需要银行ID)
      cooPhoneId: formData.legalRepresentativeContact, // 法人代表联系方式
      occurType: formData.operationType, // 发生类型
      flowStatus: '待审核' // 企业白名单状态，默认值，后续可能需要根据业务调整
    }
    
    // 调用保存接口
    // 注意：更新操作不需要传id，后端通过serialNo校验
    // let res
    if (isCreate) {
      // 新增
      await ydwkhbmdApi.add(submitData)
    } else {
      // 更新 (后端通过serialNo校验，不传id)
       await ydwkhbmdApi.save(submitData)
    }

  

    
    // // 如果是新增，从返回结果中获取生成的ID和流水号
    // if (isCreate && res) {
    //   const data = res?.data || res || {}
    //   if (data.id) {
    //     // 更新路由参数，从新增模式切换到编辑模式
    //     await router.replace({
    //       path: `/customeLevel/ydwkhbmd/detail/${data.id}`,
    //       query: route.query
    //     })
    //   }
    //   if (data.serialNumber) {
    //     formData.serialNumber = data.serialNumber
    //   }
    //   updateTitle()
    // }
    
    message.success('保存成功')
    await router.push('/credit/application/customeLevel/ydwkhbmd')
  } catch (error: any) {
    if (error !== false) {
      console.error('保存失败：', error)
      message.error('保存失败，请检查表单数据')
    }
  } finally {
    saving.value = false
  }
}

// 返回
const handleBack = () => {
  router.back()
}

// 选择企业
const handleSelectEnterprise = () => {
  enterpriseDialogVisible.value = true
  selectedEnterprise.value = null
  // 重置分页
  enterpriseQueryParams.pageNo = 1
  enterpriseQueryParams.pageSize = 10
  getEnterpriseList()
}

// 获取企业列表
const getEnterpriseList = async () => {
  try {
    enterpriseLoading.value = true
    
    // TODO: 调用实际接口
    // const data = await YdwkhbmdApi.getEnterpriseList(enterpriseQueryParams)
    // enterpriseList.value = data.list
    // enterpriseTotal.value = data.total
    
    // 模拟数据 - 生成更多数据用于分页测试
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 模拟总数据（假设有50条）
    const allMockData: any[] = []
    for (let i = 1; i <= 50; i++) {
      allMockData.push({
        id: i,
        enterpriseId: `SC20250307${String(i).padStart(6, '0')}`,
        enterpriseName: `企业${String.fromCharCode(64 + ((i - 1) % 26) + 1)}${Math.floor((i - 1) / 26) > 0 ? Math.floor((i - 1) / 26) : ''}`,
        businessLicenseNumber: `92341882MAEB8K${String(i).padStart(2, '0')}${String.fromCharCode(65 + ((i - 1) % 26))}`,
        legalRepresentativeId: `20250605${String(i).padStart(6, '0')}`,
        legalRepresentativeName: `法人${String(i).padStart(2, '0')}`,
        legalRepresentativeIdCard: `22030119950527${String(i).padStart(3, '0')}X`,
        legalRepresentativeContact: `138${String(i).padStart(8, '0')}`,
        basicAccountName: `账户${i}`,
        basicAccountNumber: `${i}${String(i).padStart(10, '0')}`,
        basicAccountBank: ['中国农业银行', '中国工商银行', '中国建设银行', '中国银行', '招商银行'][(i - 1) % 5]
      })
    }
    
    // 分页处理
    const pageNo = enterpriseQueryParams.pageNo || 1
    const pageSize = enterpriseQueryParams.pageSize || 10
    const start = (pageNo - 1) * pageSize
    const end = start + pageSize
    const paginatedList = allMockData.slice(start, end)
    
    enterpriseList.value = paginatedList
    enterpriseTotal.value = allMockData.length
  } catch (error) {
    console.error('获取企业列表失败：', error)
    message.error('获取企业列表失败')
  } finally {
    enterpriseLoading.value = false
  }
}

// 企业表格行点击
const handleEnterpriseRowClick = (row: any) => {
  selectedEnterprise.value = row
}

// 确认选择企业
const handleConfirmSelectEnterprise = () => {
  if (!selectedEnterprise.value) {
    message.warning('请选择一条企业记录')
    return
  }

  // 将选中的企业信息填充到表单
  formData.enterpriseId = selectedEnterprise.value.enterpriseId
  formData.enterpriseName = selectedEnterprise.value.enterpriseName
  formData.businessLicenseNumber = selectedEnterprise.value.businessLicenseNumber
  formData.legalRepresentativeId = selectedEnterprise.value.legalRepresentativeId
  formData.legalRepresentativeName = selectedEnterprise.value.legalRepresentativeName
  formData.legalRepresentativeIdCard = selectedEnterprise.value.legalRepresentativeIdCard
  formData.legalRepresentativeContact = selectedEnterprise.value.legalRepresentativeContact
  formData.basicAccountName = selectedEnterprise.value.basicAccountName
  formData.basicAccountNumber = selectedEnterprise.value.basicAccountNumber
  formData.basicAccountBank = selectedEnterprise.value.basicAccountBank

  message.success(`已选择企业：${selectedEnterprise.value.enterpriseName}`)
  
  // 关闭对话框
  enterpriseDialogVisible.value = false
  selectedEnterprise.value = null
}

// 选择银行
const handleSelectBank = () => {
  bankDialogVisible.value = true
  selectedBank.value = null
  // 重置分页
  bankQueryParams.pageNo = 1
  bankQueryParams.pageSize = 10
  getBankList()
}

// 获取银行列表
const getBankList = async () => {
  try {
    bankLoading.value = true
    
    // TODO: 调用实际接口
    // const data = await YdwkhbmdApi.getBankList(bankQueryParams)
    // bankList.value = data.list
    // bankTotal.value = data.total
    
    // 模拟数据 - 生成更多数据用于分页测试
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 银行名称列表
    const bankNames = [
      '中国工商银行', '中国农业银行', '中国银行', '中国建设银行', '交通银行',
      '招商银行', '浦发银行', '中信银行', '中国光大银行', '华夏银行',
      '中国民生银行', '广发银行', '平安银行', '兴业银行', '浙商银行',
      '恒丰银行', '渤海银行', '北京银行', '上海银行', '江苏银行',
      '南京银行', '宁波银行', '杭州银行', '徽商银行', '长沙银行',
      '成都银行', '重庆银行', '贵阳银行', '西安银行', '兰州银行'
    ]
    
    // 模拟总数据（假设有30条）
    const allMockData: any[] = []
    for (let i = 0; i < 30; i++) {
      const bankName = bankNames[i % bankNames.length]
      allMockData.push({
        id: i + 1,
        bankCode: `BANK${String(i + 1).padStart(4, '0')}`,
        bankName: bankName,
        bankShortName: bankName.replace(/中国|银行/g, ''),
        bankType: ['国有银行', '股份制银行', '城市商业银行'][i % 3],
        status: i < 25 ? '启用' : '停用'
      })
    }
    
    // 分页处理
    const pageNo = bankQueryParams.pageNo || 1
    const pageSize = bankQueryParams.pageSize || 10
    const start = (pageNo - 1) * pageSize
    const end = start + pageSize
    const paginatedList = allMockData.slice(start, end)
    
    bankList.value = paginatedList
    bankTotal.value = allMockData.length
  } catch (error) {
    console.error('获取银行列表失败：', error)
    message.error('获取银行列表失败')
  } finally {
    bankLoading.value = false
  }
}

// 银行表格行点击
const handleBankRowClick = (row: any) => {
  selectedBank.value = row
}

// 确认选择银行
const handleConfirmSelectBank = () => {
  if (!selectedBank.value) {
    message.warning('请选择一条银行记录')
    return
  }

  // 将选中的银行信息填充到表单
  formData.basicAccountBank = selectedBank.value.bankName

  message.success(`已选择银行：${selectedBank.value.bankName}`)
  
  // 关闭对话框
  bankDialogVisible.value = false
  selectedBank.value = null
}

// 加入供应链群成员
const handleAddSupplyChainMember = () => {
  supplyChainDialogVisible.value = true
  selectedSupplyChainProject.value = null
  // 重置分页
  supplyChainQueryParams.pageNo = 1
  supplyChainQueryParams.pageSize = 10
  getSupplyChainProjectList()
}

// 获取合作项目列表
const getSupplyChainProjectList = async () => {
  try {
    supplyChainLoading.value = true
    
    // TODO: 调用实际接口
    // const data = await YdwkhbmdApi.getSupplyChainProjectList(supplyChainQueryParams)
    // supplyChainProjectList.value = data.list
    // supplyChainTotal.value = data.total
    
    // 模拟数据 - 生成更多数据用于分页测试
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 模拟总数据（假设有50条）
    const allMockData: any[] = []
    for (let i = 1; i <= 50; i++) {
      allMockData.push({
        id: i,
        projectNo: `PROJ202401${String(i).padStart(3, '0')}`,
        projectName: `供应链金融合作项目${String.fromCharCode(64 + ((i - 1) % 26) + 1)}${Math.floor((i - 1) / 26) > 0 ? Math.floor((i - 1) / 26) : ''}`
      })
    }
    
    // 分页处理
    const pageNo = supplyChainQueryParams.pageNo || 1
    const pageSize = supplyChainQueryParams.pageSize || 10
    const start = (pageNo - 1) * pageSize
    const end = start + pageSize
    const paginatedList = allMockData.slice(start, end)
    
    supplyChainProjectList.value = paginatedList
    supplyChainTotal.value = allMockData.length
  } catch (error) {
    console.error('获取合作项目列表失败：', error)
    message.error('获取合作项目列表失败')
  } finally {
    supplyChainLoading.value = false
  }
}

// 表格选择变化
const handleSupplyChainSelectionChange = (selection: any[]) => {
  if (selection.length > 0) {
    selectedSupplyChainProject.value = selection[0]
  } else {
    selectedSupplyChainProject.value = null
  }
}

// 确认加入供应链群成员
const handleConfirmAddSupplyChain = async () => {
  if (!selectedSupplyChainProject.value) {
    message.warning('请选择一条合作项目')
    return
  }

  try {
    // 确认提示
    await ElMessageBox.confirm(
      '确定新增吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 调用加入接口
    const addParams = {
      enterpriseId: formData.enterpriseId,
      projectId: selectedSupplyChainProject.value.id,
      projectNo: selectedSupplyChainProject.value.projectNo,
      projectName: selectedSupplyChainProject.value.projectName
    }

    // TODO: 调用实际接口
    // await YdwkhbmdApi.addSupplyChainMember(addParams)
    
    // 模拟接口调用
    console.log('加入供应链群成员参数：', addParams)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    message.success(`成功加入合作项目：${selectedSupplyChainProject.value.projectName}`)
    
    // 关闭对话框
    supplyChainDialogVisible.value = false
    selectedSupplyChainProject.value = null
  } catch (error: any) {
    // 用户取消操作时不处理
    if (error !== 'cancel') {
      console.error('加入供应链群成员失败：', error)
      message.error('加入供应链群成员失败，请重试')
    }
  }
}

// 初始化
onMounted(() => {
  getDetailData()
})
</script>

<style scoped lang="scss">
.detail-form {
  :deep(.el-form-item__label) {
    font-weight: 500;
  }
}

// 分页组件样式调整
.supply-chain-pagination,
.enterprise-pagination,
.bank-pagination {
  padding: 16px 0;
  
  :deep(.el-pagination) {
    justify-content: center;
    
    .el-pagination__sizes {
      margin-right: 24px;
      
      .el-select {
        margin-right: 0;
      }
    }
    
    .btn-prev,
    .btn-next {
      min-width: 36px;
      height: 32px;
      margin: 0 6px;
      padding: 0 8px;
    }
    
    .el-pager {
      margin: 0 8px;
      
      li {
        min-width: 36px;
        height: 32px;
        margin: 0 4px;
        line-height: 32px;
      }
    }
    
    .el-pagination__jump {
      margin-left: 24px;
      
      .el-input {
        width: 60px;
        margin: 0 10px;
        
        .el-input__inner {
          padding: 0 8px;
        }
      }
    }
    
    // 增加整体间距
    .el-pagination__total {
      margin-right: 16px;
    }
  }
}
</style>

