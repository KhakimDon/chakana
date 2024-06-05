
export interface IUser {
  achievement_count: number
  id: string
  last_name: string
  username: string
  first_name: string
  sync_with_sso?: boolean
}


export interface IUserForm {
  first_name: string
  avatar?: string | null
  cover_image?: string | undefined
  last_name: string
  username: string
  sync_with_sso?: boolean
}
