type CompType =
  | 'input'
  | 'textarea'
  | 'number'
  | 'radio'
  | 'checkbox'
  | 'select'
  | 'date'
  | 'selectInput'

export class DynamicForm {
  colheader: string
  colname: string
  compType: CompType
  dockid: string
  colvisible: string
  colreadonly: string
  colrequired: string

  constructor(
    dockid: string,
    colheader: string,
    colname: string,
    compType: CompType,
    params: any = {}
  ) {
    ;[this.colheader, this.colname, this.compType, this.dockid] = [
      colheader,
      colname,
      compType,
      dockid
    ]

    this.colvisible = '1'
    this.colreadonly = '0'
    this.colrequired = '0'
    Object.assign(this, params)
  }
}

export class DockInfo {
  dockname: string
  dockid: string
  slotName: string
  constructor(dockname: string, dockid: string, slotName: string) {
    this.dockname = dockname
    this.dockid = dockid
    this.slotName = slotName
  }
}

export const codeSource = (sourcename: string) => {
  return {
    coleditsourcetype: 'Code',
    coleditsource: sourcename
  }
}

export const newCodeSource = (sourcename: string) => {
  return {
    coleditsourcetype: 'NewCode',
    coleditsource: sourcename
  }
}

type Base3 = '0' | '1'

/**
 * 基础属性三幻神
 * @param colvisible 
 * @param colreadonly 
 * @param colrequired 
 * @returns 
 */
export const base3 = (colrequired: Base3 = '0', colvisible: Base3 = '1', colreadonly: Base3 = '0') => {
  return {
    colrequired,
    colvisible,
    colreadonly,
  }
}

export const pip = (...params: any[]) => {
  return Object.assign({}, ...params)
}