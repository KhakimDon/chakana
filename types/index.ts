type TClass =
  | string
  | string[]
  | Record<string, boolean>
  | Record<string, boolean>[]

export type TClassName = TClass | TClass[]

export interface ICustomObject<T = string | number> {
  [key: string]: T
}

export interface IDefaultResponse<T> {
  count: number
  next: string | null
  previous: string | null
  items: T[]
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

// Баннер из API /common/banner/
export interface IBanner {
  id: number
  title: string
  image: string
  image_url?: string
  link?: string
  redirect_url?: string
  order: number
  is_active: boolean
}

// Экспорт типов для локаций
export * from './locations'
