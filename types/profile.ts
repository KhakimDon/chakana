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

export type TPromocodeStatuses = 'available' | 'used' | 'expired'

export interface IPromocodeDetail {
  id: number
  code: string
  expire?: string | null
  minimum_price?: number | null
  status: TPromocodeStatuses
  discount: number
  available?: boolean
}

export type TPaymentTypes = 'cash' | 'card' | false

export interface IOrderDetail {
  delivery: {
    address: string
    date: string
    customer: {
      full_name: string
      phone: string
    }
    carrier: {
      full_name: string
      phone: string
    }
  }
  payment_type: TPaymentTypes
}
