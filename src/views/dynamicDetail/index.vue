<template>
  <DynamicDetail
    :templates="templates"
    :loading="loading"
    :editable="editable"
    :readonly="readonly"
    @save="handleSave"
    @back="handleBack"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { DynamicDetail } from '@/components/DynamicDetail'

defineOptions({ name: 'DynamicDetailPage' })

const message = useMessage()

// Props
const props = defineProps({
  id: {
    type: [String, Number],
    default: undefined
  },
  editable: {
    type: Boolean,
    default: true // 默认可编辑
  },
  readonly: {
    type: Boolean,
    default: false // 默认非只读
  }
})

// 加载状态
const loading = ref(false)

// 模板配置（可以从后端获取，这里先 mock）
const templates = ref([
  // 一级菜单：合作项目情况
  {
    key: 'project',
    title: '合作项目情况',
    children: [
      // 二级菜单：项目A
      {
        key: 'project-a',
        title: '项目A',
        schema: [
          // 基本信息分组
          {
            field: 'name',
            label: '姓名',
            type: 'text',
            required: true,
            group: '基本信息',
            span: 12
          },
          {
            field: 'age',
            label: '年龄',
            type: 'number',
            group: '基本信息',
            span: 12
          },
          {
            field: 'gender',
            label: '性别',
            type: 'select',
            options: [
              { label: '男', value: 'male' },
              { label: '女', value: 'female' }
            ],
            group: '基本信息',
            span: 12
          },
          {
            field: 'birthday',
            label: '生日',
            type: 'date',
            group: '基本信息',
            span: 12
          },
          {
            field: 'email',
            label: '邮箱',
            type: 'text',
            group: '基本信息',
            span: 12
          },
          {
            field: 'phone',
            label: '手机号',
            type: 'text',
            group: '基本信息',
            span: 12
          },
          {
            field: 'address',
            label: '地址',
            type: 'textarea',
            group: '基本信息',
            span: 24
          },
          {
            field: 'isActive',
            label: '是否激活',
            type: 'boolean',
            group: '基本信息',
            span: 12
          },
          // 工作信息分组
          {
            field: 'company',
            label: '公司',
            type: 'text',
            group: '工作信息',
            span: 12
          },
          {
            field: 'position',
            label: '职位',
            type: 'text',
            group: '工作信息',
            span: 12
          },
          {
            field: 'salary',
            label: '薪资',
            type: 'number',
            formatterType: 'currency',
            formatterConfig: {
              currencySymbol: '¥',
              decimals: 2
            },
            group: '工作信息',
            span: 12
          },
          {
            field: 'joinDate',
            label: '入职日期',
            type: 'date',
            group: '工作信息',
            span: 12
          }
        ],
        data: {
          name: '张三',
          age: 30,
          gender: 'male',
          birthday: '1994-01-15',
          email: 'zhangsan@example.com',
          phone: '13800138000',
          address: '北京市朝阳区xxx街道xxx号',
          isActive: true,
          company: '某某科技有限公司',
          position: '高级工程师',
          salary: 25000,
          joinDate: '2020-06-01'
        }
      },
      // 二级菜单：项目B
      {
        key: 'project-b',
        title: '项目B',
        schema: [
          {
            field: 'company',
            label: '公司',
            type: 'text',
            group: '工作信息',
            span: 12
          },
          {
            field: 'position',
            label: '职位',
            type: 'text',
            group: '工作信息',
            span: 12
          },
          {
            field: 'salary',
            label: '薪资',
            type: 'number',
            formatterType: 'currency',
            formatterConfig: {
              currencySymbol: '¥',
              decimals: 2
            },
            group: '工作信息',
            span: 12
          },
          {
            field: 'joinDate',
            label: '入职日期',
            type: 'date',
            group: '工作信息',
            span: 12
          },
          {
            field: 'department',
            label: '部门',
            type: 'text',
            group: '工作信息',
            span: 12
          },
          {
            field: 'workYears',
            label: '工作年限',
            type: 'number',
            group: '工作信息',
            span: 12
          }
        ],
        data: {
          company: '某某科技有限公司',
          position: '高级工程师',
          salary: 25000,
          joinDate: '2020-06-01',
          department: '技术部',
          workYears: 4
        }
      }
    ]
  },
  // 一级菜单：关联授信额度
  {
    key: 'credit',
    title: '关联授信额度',
    children: [
      // 二级菜单：基本信息
      {
        key: 'credit-basic',
        title: '基本信息',
        schema: [
          {
            field: 'remark',
            label: '备注',
            type: 'textarea',
            group: '其他信息',
            span: 24
          },
          {
            field: 'createTime',
            label: '创建时间',
            type: 'datetime',
            group: '其他信息',
            span: 12,
            readonly: true
          },
          {
            field: 'updateTime',
            label: '更新时间',
            type: 'datetime',
            group: '其他信息',
            span: 12,
            readonly: true
          },
          {
            field: 'creator',
            label: '创建人',
            type: 'text',
            group: '其他信息',
            span: 12,
            readonly: true
          },
          {
            field: 'creditAmount',
            label: '授信额度',
            type: 'number',
            formatterType: 'currency',
            formatterConfig: {
              currencySymbol: '¥',
              decimals: 2
            },
            group: '基本信息',
            span: 12
          },
          {
            field: 'usedAmount',
            label: '已用额度',
            type: 'number',
            formatterType: 'currency',
            formatterConfig: {
              currencySymbol: '¥',
              decimals: 2
            },
            group: '基本信息',
            span: 12
          },
          {
            field: 'availableAmount',
            label: '可用额度',
            type: 'number',
            formatterType: 'currency',
            formatterConfig: {
              currencySymbol: '¥',
              decimals: 2
            },
            group: '基本信息',
            span: 12
          },
          {
            field: 'creditStartDate',
            label: '授信开始日期',
            type: 'date',
            group: '基本信息',
            span: 12
          },
          {
            field: 'creditEndDate',
            label: '授信结束日期',
            type: 'date',
            group: '基本信息',
            span: 12
          },
          {
            field: 'creditType',
            label: '授信类型',
            type: 'select',
            options: [
              { label: '流动资金贷款', value: 'working_capital' },
              { label: '固定资产贷款', value: 'fixed_asset' },
              { label: '综合授信', value: 'comprehensive' }
            ],
            group: '基本信息',
            span: 12
          },
          {
            field: 'interestRate',
            label: '利率',
            type: 'number',
            formatterType: 'percentage',
            formatterConfig: {
              decimals: 2
            },
            group: '工作信息',
            span: 12
          },
          {
            field: 'guaranteeMethod',
            label: '担保方式',
            type: 'select',
            options: [
              { label: '信用', value: 'credit' },
              { label: '抵押', value: 'mortgage' },
              { label: '质押', value: 'pledge' },
              { label: '保证', value: 'guarantee' }
            ],
            group: '工作信息',
            span: 12
          },
          {
            field: 'remark',
            label: '备注',
            type: 'textarea',
            group: '其他信息',
            span: 24
          },
          {
            field: 'createTime',
            label: '创建时间',
            type: 'datetime',
            group: '其他信息',
            span: 12,
            readonly: true
          },
          {
            field: 'updateTime',
            label: '更新时间',
            type: 'datetime',
            group: '其他信息',
            span: 12,
            readonly: true
          }
        ],
        data: {
          creditAmount: 1000000,
          usedAmount: 300000,
          availableAmount: 700000,
          creditStartDate: '2024-01-01',
          creditEndDate: '2024-12-31',
          creditType: 'working_capital',
          interestRate: 4.35,
          guaranteeMethod: 'mortgage',
          remark: '授信额度A相关备注信息',
          createTime: '2024-01-15 10:30:00',
          updateTime: '2024-01-20 15:45:00'
        }
      },
      // 二级菜单：授信额度B
      {
        key: 'credit-b',
        title: '授信额度B',
        schema: [
          {
            field: 'creditAmount',
            label: '授信额度',
            type: 'number',
            formatterType: 'currency',
            formatterConfig: {
              currencySymbol: '¥',
              decimals: 2
            },
            group: '基本信息',
            span: 12
          },
          {
            field: 'usedAmount',
            label: '已用额度',
            type: 'number',
            formatterType: 'currency',
            formatterConfig: {
              currencySymbol: '¥',
              decimals: 2
            },
            group: '基本信息',
            span: 12
          },
          {
            field: 'availableAmount',
            label: '可用额度',
            type: 'number',
            formatterType: 'currency',
            formatterConfig: {
              currencySymbol: '¥',
              decimals: 2
            },
            group: '基本信息',
            span: 12
          },
          {
            field: 'creditStartDate',
            label: '授信开始日期',
            type: 'date',
            group: '基本信息',
            span: 12
          },
          {
            field: 'creditEndDate',
            label: '授信结束日期',
            type: 'date',
            group: '基本信息',
            span: 12
          },
          {
            field: 'creditType',
            label: '授信类型',
            type: 'select',
            options: [
              { label: '流动资金贷款', value: 'working_capital' },
              { label: '固定资产贷款', value: 'fixed_asset' },
              { label: '综合授信', value: 'comprehensive' }
            ],
            group: '基本信息',
            span: 12
          },
          {
            field: 'interestRate',
            label: '利率',
            type: 'number',
            formatterType: 'percentage',
            formatterConfig: {
              decimals: 2
            },
            group: '工作信息',
            span: 12
          },
          {
            field: 'guaranteeMethod',
            label: '担保方式',
            type: 'select',
            options: [
              { label: '信用', value: 'credit' },
              { label: '抵押', value: 'mortgage' },
              { label: '质押', value: 'pledge' },
              { label: '保证', value: 'guarantee' }
            ],
            group: '工作信息',
            span: 12
          },
          {
            field: 'remark',
            label: '备注',
            type: 'textarea',
            group: '其他信息',
            span: 24
          }
        ],
        data: {
          creditAmount: 2000000,
          usedAmount: 500000,
          availableAmount: 1500000,
          creditStartDate: '2024-02-01',
          creditEndDate: '2025-01-31',
          creditType: 'comprehensive',
          interestRate: 4.5,
          guaranteeMethod: 'guarantee',
          remark: '授信额度B相关备注信息'
        }
      }
    ]
  }
])

// 获取详情数据（可以从后端获取模板配置）
const getDetailData = async () => {
  if (!props.id) {
    // 新建模式，使用默认值
    return
  }

  loading.value = true
  try {
    // TODO: 调用实际接口获取模板配置
    // const res = await Api.getDetailTemplates(props.id)
    // templates.value = res.data.templates

    // Mock 数据 - 模拟从后端获取模板配置
    await new Promise((resolve) => setTimeout(resolve, 500))
    // templates 已经在上面定义了，这里可以更新数据
    console.log('获取模板配置成功')
  } catch (error) {
    console.error('获取详情失败:', error)
    message.error('获取详情失败')
  } finally {
    loading.value = false
  }
}

// 保存
const handleSave = async (data: Record<string, any>) => {
  try {
    // TODO: 调用实际接口保存数据
    // await Api.save(data)

    // Mock 保存
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log('保存数据:', data)
    message.success('保存成功')

    // 保存成功后重新获取数据
    await getDetailData()
  } catch (error) {
    console.error('保存失败:', error)
    message.error('保存失败')
  }
}

// 返回
const handleBack = () => {
  // 可以在这里处理返回逻辑
}

// 初始化
onMounted(() => {
  getDetailData()
})
</script>

<style scoped lang="scss"></style>
