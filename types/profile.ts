export interface Profile {
  id: number
  name: string
  phone: string
  rating: number
  user_id: string
  image: string
  work_time: number
}

export interface INotification {
  id: number
  title: string
  description: string
  icon: string
  date_send: string
  viewed: boolean
}
