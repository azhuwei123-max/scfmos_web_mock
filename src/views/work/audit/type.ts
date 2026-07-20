export interface BpmSupplyconditionVO {
  applyRole: []
  approveRole: []
  sponDepFlag: boolean
}

export interface SimpleModel {
  id: string
  type: number
  childNode: SimpleModel
  conditionNodes: SimpleModel[]
  bpmSupplyconditionVO: BpmSupplyconditionVO
  [key: string]: any
}

export type ActivityNodes = Pick<SimpleModel, 'id' | 'bpmSupplyconditionVO' | 'type'>