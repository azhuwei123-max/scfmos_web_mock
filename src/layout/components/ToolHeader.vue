<script lang="tsx">
import { defineComponent, computed } from 'vue'
import { Message } from '@/layout/components//Message'
import { Collapse } from '@/layout/components/Collapse'
import { UserInfo } from '@/layout/components/UserInfo'
import { Screenfull } from '@/layout/components/Screenfull'
import { Breadcrumb } from '@/layout/components/Breadcrumb'
import { SizeDropdown } from '@/layout/components/SizeDropdown'
import { LocaleDropdown } from '@/layout/components/LocaleDropdown'
import { SettingButton } from '@/layout/components/Setting'
import RouterSearch from '@/components/RouterSearch/index.vue'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import {Logo} from "@/layout/components/Logo";
import { HeaderImg } from "@/layout/components/HeaderImg";
import {TagsView} from "@/layout/components/TagsView";
import { ThemeSwitch } from '@/layout/components/ThemeSwitch'


const { getPrefixCls, variables } = useDesign()

const prefixCls = getPrefixCls('tool-header')

const appStore = useAppStore()

// 面包屑
const breadcrumb = computed(() => appStore.getBreadcrumb)

// 折叠图标
const hamburger = computed(() => appStore.getHamburger)

// 全屏图标
const screenfull = computed(() => appStore.getScreenfull)
// logo
const logo = computed(() => appStore.logo)
// 搜索图片
const search = computed(() => appStore.search)

// 尺寸图标
const size = computed(() => appStore.getSize)

// 布局
const layout = computed(() => appStore.getLayout)

// 多语言图标
const locale = computed(() => appStore.getLocale)

// 消息图标
const message = computed(() => appStore.getMessage)
export default defineComponent({
  name: 'ToolHeader',
  setup() {
    return () => (
      <div
        id={`${variables.namespace}-tool-header`}
        class={[
          prefixCls,
          'h-[var(--top-tool-height)] relative px-[var(--top-tool-p-x)] flex items-center justify-between',
          'dark:bg-[var(--el-bg-color)]'
        ]}
      >
        {/* <HeaderImg id="topImgHeader" ></HeaderImg> */}
        {layout.value !== 'top' ? (
          <div class="h-full flex items-center">
            <Logo></Logo>
          </div>
        ) : undefined}
        <div class="h-full flex items-center">
          {/* {search.value ? <RouterSearch  isModal={false}/> : undefined} */}
          {/* <el-divider direction="vertical"/> */}
          {/* <ThemeSwitch /> */}
          {/* <el-divider direction="vertical"/> */}
          {/* {screenfull.value ? (
            <Screenfull
              class="custom-hover"
              color="var(--top-header-text-color)">
            </Screenfull>
          ) : undefined} */}
          {/* {locale.value ? (
            <LocaleDropdown
              class="custom-hover"
              color="var(--top-header-text-color)"
            ></LocaleDropdown>
          ) : undefined} */}
          {/* {size.value ? (
            <SizeDropdown class="custom-hover" color="var(--top-header-text-color)"></SizeDropdown>
          ) : undefined} */}

          {/* {message.value ? (
            <Message class="custom-hover" color="var(--top-header-text-color)"></Message>
          ) : undefined} */}
          {/* <SettingButton class="custom-hover" color="var(--top-header-text-color)"></SettingButton> */}
           <UserInfo></UserInfo>
        </div>
      </div>
    )
  }
})
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-tool-header;

.#{$prefix-cls} {
  transition: left var(--transition-time-02);
}
#topImgHeader{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 52px;
  padding: 0;
  margin: 0;

  //z-index:-1;
}
</style>
