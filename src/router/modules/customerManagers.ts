import { Layout } from '@/utils/routerHelper'


/* 
 * 客户管理
 */
export const customerManagers: AppCustomRouteRecordRaw[]= [
  {
    path:'/customerManagers',
    component: Layout,
    name:"customerManagers",
    meta:{
      hidden:true
    },
    children:[
      {
        path:'compCustMana/detail',
        component: () => import('@/views/customerManagers/compCustMana/customerDetail/index.vue'),
        name:"compCustManalDetail",
        meta:{
          title:"公司客户管理详情",
          noCache:true,
          canTo:true,
          hidden:true
        }
      },
      {
        path:'personal/detail/:id',
        component: () => import('@/views/customerManagers/indCustMana/personal/customerDetail/index.vue'),
        name:"CustomerPersonalDetail",
        meta:{
          title:"自雇人士-详情",
          noCache:true,
          canTo:true,
          hidden:true
        }
      },
    ]
  }
]