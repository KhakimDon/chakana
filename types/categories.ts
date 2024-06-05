export interface ICategory {
  id: number
  name: string
  image: string
  is_active: boolean
  has_children: boolean
  children?: ICategory[]
}
