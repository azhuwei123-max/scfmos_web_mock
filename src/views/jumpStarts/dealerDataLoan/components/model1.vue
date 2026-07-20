<template>
  <Dialog
    v-model="visible"
    title="经销商数据贷"
    width="90%"
    top="2vh"
    class="dealer-data-loan-model1"
  >
    <DefineTemplate v-slot="{ icon, label }">
      <div class="head">
        <div class="icon1 bg-[#2196f3]">
          <Icon :icon="icon" :size="24" class="text-[#fff]" />
        </div>
        <span class="mr-20px ml-10px">{{ label }}</span>
        <Icon icon="ep:arrow-right" />
      </div>
    </DefineTemplate>
    <ContentWrap class="shadow">
      <span class="head-text">工作台</span>
      <div class="headers mt-20px">
        <div>
          <ReuseTemplate icon="ep:document" @click="click1" label="手工客户建档" />
          <div class="tip"> 适用于核心企业线下推荐新客户 </div>
        </div>
        <div>
          <ReuseTemplate icon="ep:link" @click="click2" label="手工关联项目" />
          <div class="tip"> 存量客户，需要新关联项目使用此功能 </div>
        </div>
        <div>
          <ReuseTemplate icon="ep:position" @click="click3" label="手工发起决策数据申请" />
          <div class="tip"> 适用于未实现大供对接场景 </div>
        </div>
      </div>
      <div> </div>
    </ContentWrap>

    <div class="content">
      <header>当前待办事项</header>
      <div class="to-do-container" v-loading="loading">
        <div v-for="map in toDoList" :key="map.label" class="to-do-container-1">
          <div class="box">
            <header>
              <div class="cc"></div>
              <span class="title">
                {{ map.label }}
              </span>
              <div class="digit"> {{ map.digit }} 件 </div>
            </header>
            <el-row :gutter="16">
              <el-col :span="12" v-for="v in map.children" :key="v.label">
                <div
                  class="box-1"
                  :class="{ active: v.active }"
                  @click="boxClick(v)"
                  v-loading="getApi[`loading${v.key}`]"
                >
                  <span>{{ v.label }}</span>
                  <div class="box-1-1">
                    <span>{{ v.digit }}</span>
                    <!-- <Icon :class="{ active: v.active }" class="box-1-1-1" icon="ep:arrow-right" /> -->
                  </div>
                </div>

                <!-- 跳转链接点击区域 -->
                <div v-show="v.active" class="box-2">
                  <el-scrollbar max-height="230px">
                    <div
                      v-for="v2 in v.children"
                      :key="v2.key"
                      class="box-2-1"
                      @click="goDetail(v2, v,map)"
                    >
                      <div class="box-2-1-1">
                        <div class="my-success-tag">待办</div>
                        <span>{{ v2.name1 }}</span>
                        <span>{{ v2.name2 }}</span>
                        <span class="text-[#9fa8bb]">{{ v2.name3 }}</span>
                      </div>
                      <!-- <Icon icon="ep:arrow-right" /> -->
                    </div>
                  </el-scrollbar>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { createReusableTemplate } from '@vueuse/core'
import * as Api from './api.js'
import useGetApi from './hooks/useGetApi.js'
import { applicationPenddingApi } from '@/api/creditapplication'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()

const toDoList = reactive([
  {
    label: '链属客户进件申请',
    digit: 0,
    children: [
      {
        label: '待处理的电子渠道进件',
        digit: 0,
        key: 1,
        routerUel: '/singBusMana/channelEntryMana/elecChannelAppMana',
        children: ['', '']
      },
      {
        label: '待处理的大供进件申请',
        digit: 0,
        key: 2,
        routerUel: '/singBusMana/channelEntryMana/applicationMGM'
      },
      {
        label: '待处理的单笔授信业务申请',
        digit: 0,
        key: 3,
        routerUel: '/singBusMana/creditAppMana/singBatCreditApp'
      },
      {
        label: '待处理的供应链决策数据申请',
        digit: 0,
        key: 4,
        routerUel: '/singBusMana/supplyChainDataApproval/supplyChainDataApplication'
      }
    ]
  },
  {
    label: '链属客户查询放贷',
    digit: 0,
    children: [
      {
        label: '待处理的业务合同申请',
        digit: 0,
        key: 5,
        routerUel: '/singBusMana/signDistMana/contractRegi'
      },
      {
        label: '待处理的放贷申请',
        digit: 0,
        key: 6,
        routerUel: '/singBusMana/signDistMana/loanApp'
      }
    ]
  },
  {
    label: '当日审批通过或交易成功的放贷',
    digit: 0,
    children: [
      {
        label: '审批通过的申请',
        digit: 0,
        key: 7,
        routerUel: '/singBusMana/creditAppMana/singBatCreditApp?key=050',
      },
      {
        label: '交易成功的放贷',
        digit: 0,
        key: 8,
        routerUel: '/singBusMana/signDistMana/loanApp?key=1050'
      }
    ]
  }
])

const initList = () => {
  toDoList.forEach((v) => {
    v.digit = 0
    v.children.forEach((v2) => {
      v2.digit = 0
      v2.active = false
    })
  })
}

const visible = ref()
const open = () => {
  visible.value = true
  initList()

  getAll()
}

const getApi = useGetApi()

const getAll = () => {
  for (let i = 0; i < 4; i++) {
    getApi.value[`getList${i + 1}`]({ productName: 'GYL13' }).then((res) => {
      toDoList[0].children[i].children = res.map((v) => {
        const names = v.name.split('] [')
        return {
          name1: `${names[0]}]`,
          name2: `[${names[1]}]`,
          // name3: names[2] ? `[${names[2]}` : '',
          name3: names[2] ? `[${names.slice(2).join('] [')}` : '',
          url: v?.url ?? '',
          name4: v.serialno
        }
      })
      toDoList[0].children[i].digit = res.length
      toDoList[0].digit += res.length
    })
  }

  for (let i = 0; i < 2; i++) {
    getApi.value[`getList${i + 5}`]({ productName: 'GYL13' }).then((res) => {
      toDoList[1].children[i].children = res.map((v) => {
        const names = v.name.split('] [')
        return {
          name1: `${names[0]}]`,
          name2: `[${names[1]}]`,
          name3: names[2] ? `[${names.slice(2).join('] [')}` : '',
          url: v?.url ?? '',
          name4: v.serialno
        }
      })
      toDoList[1].children[i].digit = res.length
      toDoList[1].digit += res.length
    })
  }

  for (let i = 0; i < 2; i++) {
    getApi.value[`getList${i + 7}`]({ productName: 'GYL13' }).then((res) => {
      toDoList[2].children[i].children = res.map((v) => {
        const names = v.name.split('] [')
        return {
          name1: `${names[0]}]`,
          name2: `[${names[1]}]`,
          name3: names[2] ? `[${names.slice(2).join('] [')}` : '',
          url: v?.url ?? '',
          name4: v.serialno
        }
      })
      toDoList[2].children[i].digit = res.length
      toDoList[2].digit += res.length
    })
  }
}

const router = useRouter()
const boxClick = (info) => {
  // toDoList.forEach(v => {
  //   v.children.forEach(v2 => {
  //     if (v2.label === info.label) return
  //     v2.active = false
  //   })
  // })

  info.active = !info.active
}

const goDetail = async(info, rout,map) => {
  if(info?.url) {
    if (rout.key == 3) {
    //待处理的单笔授信业务申请
        const params = {
          serialNo: info.name4,
          phaseType: '1010',
          creditSourceFlag: '02'
        }
        const res = await applicationPenddingApi.getApplicationPenddingPage(params)
        console.log("res:",res)

        const row = res.list[0]

      const detailPath = `/creditapplication/pendding/peddingDetail`
      router.push({
        path: detailPath,
        query: {
          ...row,
          objectType: "CreditApply",
          serialNo : row.serialNo,
          objectNo : row.serialNo,
          customerID: row.customerID,
          businessType : row.businessType,
          customerType: row.customerType,
          t: new Date().getTime(), // 解决重复打开相同详情，详情页面不加载的问题
          quick:1
        }
      })
    }else{
    const newUrl = new URL(window.location.origin + '/' + info.url)
        const paramsObj = Object.fromEntries(newUrl.searchParams.entries())
        router.push({ path: info.url, query: {...paramsObj} })
    }
  }else {
   if (rout.key == 3) {
      //待处理的单笔授信业务申请
      const params = {
        serialNo: info.name4,
        phaseType: '1010',
        creditSourceFlag: '02'
      }
      const res = await applicationPenddingApi.getApplicationPenddingPage(params)
      console.log("res:",res)

      const row = res.list[0]

    const detailPath = `/creditapplication/pendding/peddingDetail`
    router.push({
      path: detailPath,
      query: {
        ...row,
        objectType:"CreditApply",
        serialNo : row.serialNo,
        customerID: row.customerID,
        businessType : row.businessType,
        customerType: row.customerType,
        t: new Date().getTime(), // 解决重复打开相同详情，详情页面不加载的问题
        quick:1
      }
    })
    }else{
    router.push(rout.routerUel)
    }
  }
}

const close = () => {
  visible.value = false
}

const emit = defineEmits(['click1', 'click2'])

const click1 = () => {
  visible.value = false
  emit('click1')
}

const click2 = () => {
  visible.value = false
  emit('click2')
}

const click3 = () => {
  router.push({
    path: '/singBusMana/supplyChainDataApproval/supplyChainDataApplication'
  })
}

const loading = ref()
const getTodoCount = () => {
  loading.value = true
  Api.getTodoCount()
    .then((res) => {
      toDoList[0].digit = res.comCredCount
      toDoList[1].digit = res.comLoanCount
      toDoList[2].digit = res.dayCount
      toDoList[0].children[0].digit = res.eleChlCount
      toDoList[0].children[1].digit = res.bigSuppCount
      toDoList[0].children[2].digit = res.sinCredCount
      toDoList[0].children[3].digit = res.suppDeciCount
      toDoList[1].children[0].digit = res.busConCount
      toDoList[1].children[1].digit = res.loanCount
      toDoList[2].children[0].digit = res.passCount
      toDoList[2].children[1].digit = res.succCount
    })
    .finally((_) => (loading.value = false))
}

defineExpose({
  open,
  close
})
</script>

<style lang="scss" scoped>
.dealer-data-loan-model1 {
  .shadow {
    box-shadow: 0px 2px 4px 1px #ccc;
  }
  .head-text {
    font-size: large;
  }
  .headers {
    display: flex;

    .head {
      display: flex;
      align-items: center;
      padding: 15px;
      margin-right: 20px;
      border-radius: 5px;
      box-shadow: 0px 1px 3px 0px #ccc;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        filter: brightness(90%);
        background-color: #dde6ff2b;
      }

      .icon1 {
        display: flex;
        align-items: center;
        padding: 10px;
        border-radius: 10px;
      }
    }

    .tip {
      margin: 10px 8px 0 5px;
      color: #5a5a5a;
      font-size: smaller;
    }
  }

  .content {
    border-radius: 10px;

    > header {
      background-color: #2196f3;
      color: white;
      padding: 15px;
      font-size: large;
      border-radius: 5px 5px 0 0;
      display: flex;
    }

    .to-do-container {
      display: flex;
      flex-direction: column;

      .box {
        display: flex;
        flex-direction: column;
        margin: 16px;

        &-1 {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 8px;
          // margin-bottom: 8px;
          padding: 8px 12px;
          // padding-left: 12px;
          // margin-left: 20px;
          border-radius: 8px;
          background-color: #fafafa;
          cursor: pointer;
          font-size: 14px;

          &.active {
            border: 1px solid #096DD9;
            background-color: #fff;
            color: #096DD9;
            box-shadow: 0px 2px 7px 0px rgba(7,147,243,0.18);
          }

          &-1 {
            display: flex;
            align-items: center;

            & > span {
              font-size: 16px;
              color: #096DD9;
            }

            &-1 {
              transition: all 0.3s;
              transform: rotate(0);
            }

            .active {
              transform: rotate(90deg);
            }
          }
        }

        &-2 {
          display: flex;
          flex-direction: column;
          border: 1px solid #C2DDFE;
          margin: 8px;
          padding: 4px 0;
          // margin-bottom: 8px;
          // margin-right: 10px;
          border-radius: 8px;
          overflow: hidden;

          &-1 {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 2px 12px;
            // border-bottom: 1px solid #f1f1f1;
            cursor: pointer;
            transition: all 0.3s;
            background-color: white;
            font-size: 12px;

            &:hover {
              background-color: #f9fafb;
            }

            &-1 {
              display: flex;
              align-items: center;
              gap: 4px;

              &-1 {
                width: 8px;
                height: 8px;
                border-radius: 8px;
                background-color: #2196f3;
              }
            }
          }
        }

        header {
          display: flex;
          align-items: center;

          & > .cc {
            width: 3px;
            height: 22px;
            background-color: #2196f3;
            border-radius: 3px;
            margin-right: 10px;
          }

          & > .title {
            font-size: 18px;
            font-weight: 600;
          }

          & > .digit {
            white-space: nowrap;
            margin-left: 20px;
            padding: 3px 15px;
            border-radius: 22px;
            margin-right: 5px;
            color: #2196f3;
            background-color: #dff0ff;
          }
        }
      }
    }
  }
}

.my-success-tag {
  background: #F0FAF2;
  border: 1px solid rgba(159,214,168,1);
  border-radius: 2px;
  font-size: 10px;
  color: #389E0D;
  line-height: 11px;
  font-weight: 400;
  padding: 1px 4px;
}
</style>
