import { minLength, required } from '@vuelidate/validators'

import { isValidPhone } from '~/utils/functions/common.js'

export const orderFormName = useForm(
  {
    name: '',
  },
  {
    name: { required, minLength: minLength(3) },
  }
)

export const orderFormAddress = useForm(
  {
    id: '',
    address_info: null,
  },
  {
    id: { required },
  }
)

export const orderFormUserInfo = useForm(
  {
    full_name: '',
    phone: '',
  },
  {
    full_name: { required },
    phone: { required, isValidPhone },
  }
)

export const orderFormTime = useForm(
  {
    delivery_time: '',
    weekdays: null,
  },
  {
    delivery_time: { required },
  }
)

export const orderFormComment = useForm(
  {
    comment_to_courier: '',
  },
  {}
)

export const orderFormPromocode = useForm(
  {
    promo_code_id: '',
    promo_info: null,
  },
  {}
)

export const orderFormPayment = useForm(
  {
    card_to_courier: false,
    cash: false,
    card_id: 0,
    balance: false,
  },
  {}
)

export function generateOrderIntervals(isAuto: boolean) {
  const now = isAuto ? new Date('2023-01-01 01:00:00') : new Date()
  const intervals = []

  let currentHour = now.getHours()
  let currentMinute = now.getMinutes()

  // Adjust to the next 2-hour interval
  if (currentMinute > 0) {
    currentHour += 3
  }
  currentHour -= currentHour % 2
  currentMinute = 0

  while (currentHour < 24) {
    const startInterval = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      currentHour,
      currentMinute
    )
    const endInterval = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      currentHour + 1,
      currentMinute
    )
    intervals.push(
      `${startInterval.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })} - ${endInterval.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })}`
    )
    currentHour += 1
  }

  return intervals
}
