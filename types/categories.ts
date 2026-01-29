export interface ICategory {
  id: number
  name?: string
  title?: string
  image?: string
  icon?: string
  icon_url?: string
  slug?: string
  is_active?: boolean
  has_children?: boolean
  children?: ICategory[]
  sellers_count?: number
  created_at?: string
  updated_at?: string
}

// Тип для категорий магазинов из /stores/categories/
export interface ISellerCategory {
  id: number
  title: string
  icon: string | null
  icon_url: string
  sellers_count: number
  created_at: string
  updated_at: string
}
