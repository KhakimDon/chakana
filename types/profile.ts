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

export interface IBankCard {
  id: number
  card_number: string
  card_type: string
  processing: string
}

export type TOrderStatuses =
  | 'on_the_way'
  | 'cancelled'
  | 'delivered'
  | 'collected'
  | 'accepted'

export interface IOrderCard {
  id: number
  status: TOrderStatuses
  date_order: string
  amount_untaxed: number
  write_date: string
  total_real_price: number
  images: string[]
}
