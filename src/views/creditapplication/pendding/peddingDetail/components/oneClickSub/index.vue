<template>
  <div class="one-click-sub-comp">
    <DefineTemplate v-slot="{ img }">
      <div class="card">
        <img :src="img" />
      </div>
    </DefineTemplate>

    <div class="flex items-start gap-74px mt-72px ml-88px">
      <ReuseTemplate :img="approvalOpinionIMG" @click="doApprovalOpinion" />
      <ReuseTemplate :img="riskDetectionIMG" @click="doRiskDetection" />
    </div>

    <!-- 签署意见 -->
    <ApprovalOpinion
      v-model="approvalOpinionVisible"
      :process-instance="approvalOpinionParams"
      @submit="submit"
    />

    <RiskMonitor
      v-model="riskMonitorVisible"
      :risk-data="riskData"
      @confirm="handleRiskMonitorConfirm"
      @cancel="handleRiskMonitorCancel"
    />
  </div>
</template>

<script setup>
import { createReusableTemplate } from '@vueuse/core'
import ApprovalOpinion from '@/views/creditapplication/creditApplyJob/components/approvalOpinion.vue'
import { applicationPenddingApi } from '@/api/creditapplication'
import { creditApplyJobApi } from '@/api/creditapplication/creditApplyJob'
import approvalOpinionIMG from '@/assets/imgs/approvalOpinion.png'
import riskDetectionIMG from '@/assets/imgs/riskDetection.png'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()

// 签署意见
const route = useRoute()
const { serialNo, ftSerialNo, phaseNo, customerID, objectType, occurType, flowNo, applyType } =
  route.query

const approvalOpinionVisible = ref(false)
const approvalOpinionParams = reactive([
  {
    objectNo: serialNo,
    ftSerialNo: ftSerialNo,
    phaseNo: phaseNo,
    customerid: customerID
  }
])

const doApprovalOpinion = () => {
  approvalOpinionVisible.value = true
}

const checkCommentExec = async (serialNo, objectType, phaseNo) => {
  const resp = await creditApplyJobApi
    .checkComment({ serialNo, objectType, phaseNo })
    .then((res) => res)
  return resp
}

const submitFlag = ref(false)
const submit = async () => {
  const data = await checkCommentExec(serialNo, objectType, phaseNo)

  if (!data?.phaseOpinion) {
    ElMessage.warning(`${serialNo}签署意见未保存`)
    return
  }

  await doRiskDetection(2)
  submitFlag.value = true
}

const riskMonitorVisible = ref(false)
const riskData = ref()
const doRiskDetection = async (rskTp = 1) => {
  riskData.value = {
    scenarioId: '001',
    rskTp: rskTp?.target ? 1 : rskTp,
    params: {
      OccurType: occurType,
      ObjectType: objectType,
      ObjectNo: serialNo,
      FlowNo: flowNo,
      PhaseNo: phaseNo,
      ApplyType1: applyType
    }
  }
  riskMonitorVisible.value = true
  submitFlag.value = false
}
</script>

<style lang="scss" scoped>
.one-click-sub-comp {
  display: flex;
  background-color: white;
  height: 90%;
  margin: 20px;
  border-radius: 4px;

  .card {
    width: 265px;
    display: flex;
    // flex-direction: column;
    justify-content: center;
    align-items: center;
    // background-color: var(--el-color-primary);
    color: white;
    cursor: pointer;
    transition: opacity 0.3s;
    opacity: 1;

    span {
      font-size: larger;
    }

    // &:first-child {
    //   background: linear-gradient(0deg, #993a00, #ff832c);
    // }

    &:hover {
      opacity: 0.8;
    }

    &:active {
      opacity: 1;
    }
  }
}
</style>
