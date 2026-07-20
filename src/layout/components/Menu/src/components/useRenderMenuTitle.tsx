import type { RouteMeta } from 'vue-router'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTooltip } from 'element-plus'
import { Icon } from '@/components/Icon'
import { SvgIcon } from '@/components/SvgIcon'

export const useRenderMenuTitle = () => {
  const renderMenuTitle = (meta: RouteMeta) => {
    const { t } = useI18n()
    const { title = 'Please set title', icon = '' } = meta

    const renderIcon = () => {
      if (!icon) {
        return null
      }
      if (icon.startsWith('ep:')) {
        return (
          <Icon
            icon={icon}
            class="v-menu__icon text-[var(--left-menu-text-color)] transition-colors duration-200"
            size={18}
          />
        )
      }
      const rawName = icon.includes(':') ? icon.split(':').pop()! : icon
      const svgName = rawName.startsWith('icon-') ? rawName.replace(/^icon-/, '') : rawName
      return (
        <SvgIcon name={svgName} height="18px" width="18px" />
      )
    }

    const text = t(title as string)
    if (!text) {
      return (
        <>
          {renderIcon()}
          <span class="v-menu__title overflow-hidden overflow-ellipsis whitespace-nowrap ml-[9px]">
            {text}
          </span>
        </>
      )
    }
    const isLong = text.length > 10
    const label = isLong ? `${text.slice(0, 10)}...` : text
    const content =
      text.length > 0 && text.length > 10 ? (
        <ElTooltip content={text} placement="right">
          {{
            default: () => (
              <span class="v-menu__title overflow-hidden overflow-ellipsis whitespace-nowrap ml-[9px] mr-[12px]">
                {label}
              </span>
            )
          }}
        </ElTooltip>
      ) : (
        <span class="v-menu__title overflow-hidden overflow-ellipsis whitespace-nowrap ml-[9px] mr-[14px]">
          {label}
        </span>
      )
    return (
      <>
        {renderIcon()}
        {content}
      </>
    )
  }
  return {
    renderMenuTitle
  }
}
