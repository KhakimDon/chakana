export interface IUser {
  id: number
  name: string
  phone: string
  email: string
  image: string
  telegram: string
  instagram: string
  is_premium: boolean
  has_image: boolean
}

export interface IUserForm {
  first_name: string
  avatar?: string | null
  cover_image?: string | undefined
  last_name: string
  username: string
  sync_with_sso?: boolean
}
