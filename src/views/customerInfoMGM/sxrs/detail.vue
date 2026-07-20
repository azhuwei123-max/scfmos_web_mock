<template>
  <ContentWrap v-loading="loading">
    <el-tabs v-model="activeTab" class="mb-20px">
       <el-tab-pane label="详情" name="detail">

    
    <!-- 警告提示 -->
    <el-alert
      type="warning"
      :closable="false"
      show-icon
      class="!mb-20px"
    >
      <template #default>

        客户反洗钱相关字段无法修改、ECIF反馈无法修改的信息请至柜面修改
      </template>
    </el-alert>

    <!-- 操作按钮 -->
    <div class="flex justify-between items-center mb-20px">
      <div class="flex gap-10px">
        <el-button tpye="" :loading="saving" @click="handleSave">
          <Icon icon="ep:document" class="mr-5px" />
          保存
        </el-button>
        <el-button @click="handleTemporarySave" :loading="temporarySaving">
          暂存
        </el-button>
        <el-button @click="handleCustomerInfoChange">
          客户信息变更
        </el-button>
        <el-button @click="handleImportECIF">
          导入ECIF数据
        </el-button>
      </div>
      <el-button @click="handleBack">
        <Icon icon="ep:arrow-left" class="mr-5px" />
        返回
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
      <el-collapse v-model="activeNames">
        <!-- 基本信息 -->
        <el-collapse-item name="basicInfo">
          <template #title>
            <span class="text-base font-bold">基本信息</span>
          </template>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="核心客户号" prop="mfcustomerid">
                <el-input
                  v-model="formData.mfcustomerid"
                  placeholder="系统自动生成"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证件类型" prop="certtype">
                <el-select
                  v-model="formData.certtype"
                  placeholder="请选择证件类型"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in idTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span class="ml-5px text-blue-500">√(征信M)</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="国籍" prop="country">
                <el-input
                  v-model="formData.country"
                  placeholder="请选择国籍"
                  disabled
                >
                  <template #append>
                    <el-button @click="handleSelectNationality">
                      <Icon icon="ep:more" />
                    </el-button>
                    <el-button @click="handleSearchNationality">
                      <Icon icon="ep:search" />
                    </el-button>
                  </template>
                </el-input>
                <span class="ml-5px text-blue-500">○(征信M)</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别" prop="sex">
                <el-select
                  v-model="formData.sex"
                  placeholder="请选择性别"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in genderOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span class="ml-5px text-blue-500">√(征信M)</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <!-- <el-form-item label="学历" prop="eduexperience">
                <el-select
                  v-model="formData.eduexperience"
                  placeholder="请选择学历"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in educationOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span class="ml-5px text-blue-500">√(征信M)</span>
              </el-form-item> -->
            </el-col>
            <el-col :span="12">
              <el-form-item label="姓名" prop="fullname">
                <el-input
                  v-model="formData.fullname"
                  placeholder="请输入姓名"
                  disabled
                />
                <span class="ml-5px text-blue-500">(征信M)</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="证件号码" prop="certid">
                <el-input
                  v-model="formData.certid"
                  placeholder="请输入证件号码"
                  disabled
                />
                <span class="ml-5px text-blue-500">(征信M)</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出生日期" prop="birthday">
                <el-date-picker
                  v-model="formData.birthday"
                  type="date"
                  placeholder="请选择出生日期"
                  value-format="YYYY/MM/DD"
                  style="width: 100%"
                />
                <span class="ml-5px text-blue-500">(征信M)</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="婚姻状况" prop="marriage">
                <el-select
                  v-model="formData.marriage"
                  placeholder="请选择婚姻状况"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in maritalStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span class="ml-5px text-blue-500">√(征信M)</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最高学位" prop="edudegree">
                <el-select
                  v-model="formData.edudegree"
                  placeholder="请选择最高学位"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in highestDegreeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span class="ml-5px text-blue-500">√(征信M)</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="民族" prop="nationality">
                <el-select
                  v-model="formData.nationality"
                  placeholder="请选择民族"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in ethnicityOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>

        <!-- 户籍地址 -->
        <el-collapse-item name="householdAddress">
          <template #title>
            <span class="text-base font-bold">户籍地址</span>
          </template>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="户籍地址(区域)" prop="nativeplace">
                <RegionSelect
                  v-model="formData.nativeplace"
                  placeholder="请选择户籍地址区域"
                />
                <span class="ml-5px text-blue-500">○(征信O)</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="户籍详细地址" prop="nativeplacedetail">
                <el-input
                  v-model="formData.nativeplacedetail"
                  placeholder="请输入户籍详细地址"
                  type="textarea"
                  :rows="2"
                />
                <div class="text-12px text-gray-500 mt-5px">
                  (该栏目需要录入省市区信息,不少于四个汉字)
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>

        <!-- 常住地址 -->
        <el-collapse-item name="permanentAddress">
          <template #title>
            <span class="text-base font-bold">常住地址</span>
          </template>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="常住地址(区域)" prop="familyadd">
                <RegionSelect
                  v-model="formData.familyadd"
                  placeholder="请选择常住地址区域"
                />
                <span class="ml-5px text-blue-500">○(征信O)</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="常住详细地址" prop="familyadddetail">
                <el-input
                  v-model="formData.familyadddetail"
                  placeholder="请输入常住详细地址"
                  type="textarea"
                  :rows="2"
                />
                <div class="text-12px text-gray-500 mt-5px">
                  (该栏目需要录入省市区信息,不少于四个汉字)
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="常住地址邮编" prop="familyzip">
                <el-input
                  v-model="formData.familyzip"
                  placeholder="请输入常住地址邮编"
                />
                <span class="ml-5px text-blue-500">(征信M)</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="居住状况" prop="familystatus">
                <el-select
                  v-model="formData.familystatus"
                  placeholder="请选择居住状况"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in residentialStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span class="ml-5px text-blue-500">(征信M)</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>

        <!-- 通讯地址 -->
        <el-collapse-item name="correspondenceAddress">
          <template #title>
            <span class="text-base font-bold">通讯地址</span>
          </template>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="通讯地址(区域)" prop="ctcdstccdname">
                <el-select
                  v-model="formData.ctcdstccdname"
                  placeholder="请选择通讯地址"
                  style="width: 100%"
                >
                  <el-option label="居住地址" value="居住地址" />
                  <el-option label="户籍地址" value="户籍地址" />
                  <el-option label="常住地址" value="常住地址" />
                </el-select>
                <span class="ml-5px text-blue-500">(征信M)</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="通讯地址" prop="commadd">
                <el-input
                  v-model="formData.commadd"
                  placeholder="请输入通讯地址"
                  type="textarea"
                  :rows="2"
                />
                <div class="text-12px text-gray-500 mt-5px">
                  (该栏目需要录入省市区信息,不少于四个汉字)
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="通讯地址邮编" prop="commzip">
                <el-input
                  v-model="formData.commzip"
                  placeholder="请输入通讯地址邮编"
                />
                <span class="ml-5px text-blue-500">(征信M)</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>

        <!-- 联系方式 -->
        <el-collapse-item name="contactInfo">
          <template #title>
            <span class="text-base font-bold">联系方式</span>
          </template>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="手机号码(核心)" prop="mobilephonehx">
                <el-input
                  v-model="formData.mobilephonehx"
                  placeholder="请输入手机号码(核心)"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号码" prop="mobiletelephone">
                <el-input
                  v-model="formData.mobiletelephone"
                  placeholder="请输入手机号码"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="住宅电话" prop="familytel">
                <el-input
                  v-model="formData.familytel"
                  placeholder="请输入住宅电话"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号码(直销)" prop="mobilephonezx">
                <el-input
                  v-model="formData.mobilephonezx"
                  placeholder="请输入手机号码(直销)"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>

        <!-- 职业信息 -->
        <el-collapse-item name="occupationInfo">
          <template #title>
            <span class="text-base font-bold">职业信息</span>
          </template>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="单位名称" prop="workcorp">
                <el-input
                  v-model="formData.workcorp"
                  placeholder="请输入单位名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="办公电话" prop="worktel">
                <el-input
                  v-model="formData.worktel"
                  placeholder="请输入办公电话"
                />
                <span class="ml-5px text-blue-500">(征信O)</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="单位地址" prop="workadd">
                <RegionSelect
                  v-model="formData.workadd"
                  placeholder="请选择单位地址"
                  disabled
                />
                <span class="ml-5px text-blue-500">(征信O)</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位详细地址" prop="workadddetail">
                <el-input
                  v-model="formData.workadddetail"
                  placeholder="请输入单位详细地址"
                  type="textarea"
                  :rows="2"
                />
                <div class="text-12px text-gray-500 mt-5px">
                  (该栏目需要录入省市区信息,不少于四个汉字)
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="个人年收入" prop="yearincome">
                <el-input-number
                  v-model="formData.yearincome"
                  placeholder="请输入个人年收入"
                  :min="0"
                  :precision="2"
                  style="width: 100%"
                />
                <span class="ml-5px">元</span>
                <span class="ml-5px text-blue-500">(征信O)</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位所属行业" prop="unitkind">
                <el-select
                  v-model="formData.unitkind"
                  placeholder="请选择单位所属行业"
                  disabled
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in industryOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span class="ml-5px text-blue-500">(征信O)</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="职业" prop="occupation">
                <el-select
                  v-model="formData.occupation"
                  placeholder="请选择职业"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in occupationOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span class="ml-5px text-blue-500">√(征信M)</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否内部人" prop="relativeflag">
                <el-select
                  v-model="formData.relativeflag"
                  placeholder="请选择是否内部人"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in isInsiderOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="黑名单类型" prop="sectiontype">
                <el-select
                  v-model="formData.sectiontype"
                  placeholder="请选择黑名单类型"
                  clearable
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="长期(一年以上)居住地" prop="peresidence">
                <el-select
                  v-model="formData.peresidence"
                  placeholder="请选择长期居住地"
                  clearable
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="举家外出谋生时间" prop="ifliveout">
                <el-select
                  v-model="formData.ifliveout"
                  placeholder="请选择举家外出谋生时间"
                  clearable
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>

        <!-- 企业信息 -->
        <el-collapse-item name="enterpriseInfo">
          <template #title>
            <span class="text-base font-bold">企业信息</span>
          </template>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="企业注册资金" prop="entregistercapital">
                <el-input-number
                  v-model="formData.entregistercapital"
                  placeholder="请输入企业注册资金"
                  :min="0"
                  :precision="2"
                  style="width: 100%"
                />
                <span class="ml-5px">万元</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业经营年份" prop="entyears">
                <el-input-number
                  v-model="formData.entyears"
                  placeholder="请输入企业经营年份"
                  :min="0"
                  :precision="0"
                  style="width: 100%"
                />
                <span class="ml-5px">年</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="主经营企业名称" prop="entorgcustomername">
                <el-input
                  v-model="formData.entorgcustomername"
                  placeholder="请输入主经营企业名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业主类型" prop="bosstype">
                <el-select
                  v-model="formData.bosstype"
                  placeholder="请选择企业主类型"
                  clearable
                  style="width: 100%"
                >
                  <el-option label="其他" value="其他" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="控股类型" prop="entorgtype">
                <HoldingTypeSelect
                  v-model="formData.entorgtype"
                  placeholder="请选择控股类型"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所在企业股份占比" prop="entstockrate">
                <el-input-number
                  v-model="formData.entstockrate"
                  placeholder="请输入所在企业股份占比"
                  :min="0"
                  :max="100"
                  :precision="2"
                  style="width: 100%"
                />
                <span class="ml-5px">%</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="所在企业雇员人数" prop="entemployee">
                <el-input-number
                  v-model="formData.entemployee"
                  placeholder="请输入所在企业雇员人数"
                  :min="0"
                  :precision="0"
                  style="width: 100%"
                />
                <span class="ml-5px">人</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所在企业月均缴税额" prop="enttaxsum">
                <el-input-number
                  v-model="formData.enttaxsum"
                  placeholder="请输入所在企业月均缴税额"
                  :min="0"
                  :precision="2"
                  style="width: 100%"
                />
                <span class="ml-5px">万元</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>

        <!-- 操作信息 -->
        <el-collapse-item name="operationInfo">
          <template #title>
            <span class="text-base font-bold">操作信息</span>
          </template>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="登记人" prop="inputuserid">
                <el-input
                  v-model="formData.inputuserid"
                  placeholder="请输入登记人"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="登记单位" prop="inputorgid">
                <el-input
                  v-model="formData.inputorgid"
                  placeholder="请输入登记单位"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="登记日期" prop="inputdate">
                <el-date-picker
                  v-model="formData.inputdate"
                  type="date"
                  placeholder="请选择登记日期"
                  value-format="YYYY/MM/DD"
                  disabled
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="更新日期" prop="updatedate">
                <el-date-picker
                  v-model="formData.updatedate"
                  type="date"
                  placeholder="请选择更新日期"
                  value-format="YYYY/MM/DD"
                  disabled
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-form>


  </el-tab-pane>
  <el-tab-pane label="影像系统页面" name="imageSystem">
    <div class="p-20px">
      <Image :data="imageData"></Image>
    </div>
  </el-tab-pane>
    </el-tabs>
  </ContentWrap>

  <!-- 选择国籍对话框（级联选择器） -->
  <Dialog 
    :model-value="nationalityDialogVisible" 
    @update:model-value="nationalityDialogVisible = $event"
    title="选择国籍" 
    :fullscreen="false"
    :append-to-body="true"
    width="800px"
  >
    <el-cascader
      v-model="selectedNationality"
      :options="nationalityOptions"
      :props="nationalityCascaderProps"
      placeholder="请选择洲/国家/地区"
      style="width: 100%"
      clearable
      filterable
      :show-all-levels="false"
    />
    <template #footer>
      <el-button tpye="" @click="handleConfirmNationality">确 定</el-button>
      <el-button @click="nationalityDialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <!-- 选择国籍对话框（表格查询） -->
  <CountrySelect
    v-model="nationalityTableDialogVisible"
    @confirm="handleCountrySelectConfirm"
  />

 

</template>

<script lang="ts" setup>
import { useTagsViewStoreWithOut } from '@/store/modules/tagsView'
import { useRoute, useRouter } from 'vue-router'
// @ts-ignore
import Dialog from '@/components/Dialog/src/Dialog.vue'
// @ts-ignore
import CountrySelect from './component/CountrySelect.vue'
import { personalApi } from '@/api/customerInfoMGM/personal'
import {
  idTypeOptions,
  genderOptions,
  educationOptions,
  maritalStatusOptions,
  highestDegreeOptions,
  ethnicityOptions,
  nationalityOptions,
  nationalityCascaderProps,
  residentialStatusOptions,
  occupationOptions,
  isInsiderOptions,
  industryOptions
} from './const/detail'

import { OcrRecognitionDialog } from '@/components/OcrRecognitionDialog'

defineOptions({ name: 'CustomerPersonalDetail1' })

const message = useMessage()
const router = useRouter()
const route = useRoute()
const tagsViewStore = useTagsViewStoreWithOut()


console.log('route',route);


const loading = ref(false)
const saving = ref(false)
const temporarySaving = ref(false)
const formRef = ref()

// 标签页激活项
const activeTab = ref('detail')

// 折叠面板激活项
const activeNames = ref(['basicInfo', 'householdAddress', 'permanentAddress', 'correspondenceAddress', 'contactInfo', 'occupationInfo', 'enterpriseInfo', 'operationInfo'])

// 国籍选择相关（级联选择器）
const nationalityDialogVisible = ref(false)
const selectedNationality = ref<string[]>([])

// 国籍选择相关（表格查询）
const nationalityTableDialogVisible = ref(false)

// 处理国家选择确认
const handleCountrySelectConfirm = (country: any) => {
  formData.nationality = country.countryName
  message.success(`已选择国家：${country.countryName}`)
}

// 搜索国家（打开表格对话框）
const handleSearchNationality = () => {
  nationalityTableDialogVisible.value = true
}






const  imageData = reactive({
  treeNodes: [
      {
        treeId: 'customerGRKH',
        bizReferenceId: route.params.id || ""
      }
    ],
  canDelete: true,
  canUpload: true
})


// 表单数据
const formData = reactive({
  mfcustomerid:'',// 核心客户号
  customerId: '02681502', //客户编号
  fullname:'', //姓名,
  certtype:'', //证件类型
  certid:"", // 证件号码
  country:"",//	国别
  certidmaturity:'', //护照到期日
  birthday:'', //出生日期
  marriage:'',// 婚宴状况
  edudegree:'', //最高学位
  nationality:'', //名族
  nativeplace:"",//户籍地址（区域）
  nativeplacedetail:'',//户籍详细地址
  familyadd:'',//常住地址（区域）
  familyadddetail:'',//常住详细地址
  familyzip:'',// 常住地址邮编
  familystatus:'',//居住状况
  ctcdstccdname:'',//通讯地址（区域）
  commadd:'',//通讯地址
  commzip:'',//通讯地址邮编
  mobilephonehx:'',//手机号码(核心)
  mobiletelephone:"",//手机号码
  familytel:'',//住宅电话
  mobilephonezx:'',//手机号码(直销)
  workcorp:'',//单位名称
  worktel:'',//办公电话
  workadd:'',//单位地址
  workadddetail:'', //单位详细地址
  yearincome:'',//个人年收入
  unitkind:'',//单位所属行业
  occupation:'',//职业
  relativeflag:'', //是否内部人
  sectiontype:'', //黑名单类型
  peresidence:'',//长期(一年以上)居住地
  ifliveout:'',//举家外出谋生时间
  entregistercapital:'', //企业注册资金
  entyears:'',// 企业经营年份
  entorgcustomername:'', //主经营企业名称
  bosstype:'',//企业主类型
  entorgtype:'',//控股类型
  entstockrate:"",// 所在企业股份占比
  entemployee:'',//所在企业雇员人数
  enttaxsum:'',//所在企业月均缴税额
  inputuserid:'',//登记人
  inputorgid:"",//登记单位
  inputdate:'',//登记日期
  updatedate:''//更新日期
})

// 表单验证规则
const formRules = {
  // idType: [
  //   { required: true, message: '请选择证件类型', trigger: 'change' }
  // ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  idNumber: [
    { required: true, message: '请输入证件号码', trigger: 'blur' }
  ]
}

// 设置页签标题
const updateTitle = () => {
  const customerName = formData.name || route.query.customerName as string || '客户信息'
  const title = `客户信息(${customerName})-详情`
  
  tagsViewStore.updateVisitedView({
    ...route,
    meta: {
      ...route.meta,
      title
    }
  })
}

// 获取详情数据
const getDetailData = async () => {
  const id = route.params.id as string
  const customerId = route.query.customerId as string

  if (!id) {
    message.error('参数错误')
    return
  }

  try {
    loading.value = true
    
    // // TODO: 调用实际接口获取详情
    // const res = await personalApi.getDetail({ customerid:customerId  })
    // console.log('res',res)

    const asds = await personalApi.getCsutomerView({ customerId:customerId ,codeNo:'IndView' })
    console.log('asds',asds)

    const asds111 = await personalApi.getPageVO({ customerId:customerId ,codeNo:'CustomerType' ,itemNo:'0320'})
    console.log('asds',asds111)


    const asds333 = await personalApi.getPiion({ customerid:customerId })
    console.log('asds',asds333)


    

   

    
    // const data = res?.data || res || {}
    // Object.assign(formData, data)
    
    // 模拟数据加载（使用 id 参数）
    console.log('获取客户详情，ID:', id)
    await new Promise(resolve => setTimeout(resolve, 300))
    
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
    await formRef.value?.validate()
    
    saving.value = true
    
    // TODO: 调用保存接口
    // await CustomerPersonalApi.save(formData)
    
    // 模拟保存
    await new Promise(resolve => setTimeout(resolve, 500))
    
    message.success('保存成功')
    
    // 更新标题
    updateTitle()
  } catch (error: any) {
    if (error !== false) {
      console.error('保存失败：', error)
      message.error('保存失败，请检查表单数据')
    }
  } finally {
    saving.value = false
  }
}

// 暂存
const handleTemporarySave = async () => {
  try {
    temporarySaving.value = true
    
    // TODO: 调用暂存接口
    // await CustomerPersonalApi.temporarySave(formData)
    
    // 模拟暂存
    await new Promise(resolve => setTimeout(resolve, 300))
    
    message.success('暂存成功')
  } catch (error) {
    console.error('暂存失败：', error)
    message.error('暂存失败，请重试')
  } finally {
    temporarySaving.value = false
  }
}

// 客户信息变更
const handleCustomerInfoChange = () => {
  message.info('客户信息变更功能待实现')
  // TODO: 实现客户信息变更逻辑
}

// 导入ECIF数据
const handleImportECIF = () => {
  message.info('导入ECIF数据功能待实现')
  // TODO: 实现导入ECIF数据逻辑
}

// 返回
const handleBack = () => {
  router.back()
}

// 选择国籍
const handleSelectNationality = () => {
  nationalityDialogVisible.value = true
  // 如果已有国籍值，尝试解析并设置选中值
  if (formData.nationality) {
    // 这里可以根据实际数据格式进行解析
    selectedNationality.value = []
  } else {
    selectedNationality.value = []
  }
}

// 确认选择国籍
const handleConfirmNationality = () => {
  if (!selectedNationality.value || selectedNationality.value.length === 0) {
    message.warning('请选择国籍')
    return
  }
  
  // 获取最后一级（国家或地区）作为国籍值
  const nationalityValue = selectedNationality.value[selectedNationality.value.length - 1]
  formData.nationality = nationalityValue
  
  message.success(`已选择国籍：${nationalityValue}`)
  nationalityDialogVisible.value = false
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
  
  :deep(.el-collapse-item__header) {
    font-size: 16px;
    font-weight: bold;
    padding: 15px 0;
  }
  
  :deep(.el-collapse-item__content) {
    padding-bottom: 20px;
  }
}
</style>

