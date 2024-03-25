type TClass =
  | string
  | string[]
  | Record<string, boolean>
  | Record<string, boolean>[]

export type TClassName = TClass | TClass[]

export interface ICustomObject<T = string | number> {
  [key: string]: T
}
