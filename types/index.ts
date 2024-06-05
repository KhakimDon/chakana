type TClass =
  | string
  | string[]
  | Record<string, boolean>
  | Record<string, boolean>[]

export type TClassName = TClass | TClass[]

export interface ICustomObject<T = string | number> {
  [key: string]: T
}

export interface IBrand {
  id: number
  title: string
  image: string
}

export interface IFile {
  url: string
  name: string
  file?: File
  type: string
  id: string
}

export interface IResponse<T = any> {
  count: number
  items: T[]
  current: string
  next: string
  previous: string
}
