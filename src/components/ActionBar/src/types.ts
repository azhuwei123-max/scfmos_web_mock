import type { ButtonProps } from "element-plus"

export interface ActionButton extends Partial<ButtonProps> {
  key: string
  label: string
  icon?: string
  loading?: boolean
  show?: boolean | ((rowData?: any) => boolean)
  permission?: string[]
  onClick: (btn: ActionButton) => void
}