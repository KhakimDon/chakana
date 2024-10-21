import { minLength, required, requiredIf } from '@vuelidate/validators'

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

export const orderFormTime = (isAuto: boolean) =>
  useForm(
    {
      delivery_times: null,
      when_to_deliver: '',
    },
    {
      delivery_times: {
        requiredIf: requiredIf(isAuto),
      },
      when_to_deliver: { requiredIf: requiredIf(!isAuto) },
    }
  )

export const orderFormComment = useForm(
  {
    comment_to_courier: '',
    location_details: {
      entrance: '',
      floor: '',
      home_number: '',
      entrance_code: '',
    },
  },
  {
    location_details: {
      home_number: { required },
    },
  }
)

export const orderFormPickerComment = useForm(
  {
    picker_comment: '',
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
    // card_to_courier: false,
    cash: false,
    card_id: 0,
    balance: false,
    provider_id: 0,
  },
  {}
)

export function generateOrderIntervals(isAuto: boolean, dayjs: Function) {
  const now = isAuto ? new Date('2023-01-01 09:00:00') : new Date()
  const intervals = []

  let currentHour = now.getHours()
  let currentMinute = now.getMinutes()

  // // Adjust to the next 2-hour interval
  // if (currentMinute > 0) {
  //   currentHour += 2
  // }
  // currentHour -= currentHour % 2
  currentMinute = 0
  let trigger = 0

  if (isAuto) {
    while (currentHour < 23) {
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
  } else {
    while (trigger < 24) {
      const startInterval = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        currentHour + 2,
        0
      )

      const endInterval = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        currentHour + 3,
        currentMinute
      )
      intervals.push({
        time: dayjs(endInterval).format('YYYY-MM-DDTHH:mm:ss'),
        time_text: `${startInterval.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })} - ${endInterval.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}`,
      })
      trigger += 1
      currentHour += 1
    }
  }

  return intervals
}

export function generateOrderTomorrowIntervals(dayjs: Function) {
  const newDate = new Date()
  const now = new Date(
    newDate.getFullYear(),
    newDate.getMonth(),
    newDate.getDate() + 1,
    9,
    0
  )
  const intervals = []

  let currentHour = now.getHours()
  let currentMinute = now.getMinutes()

  // Adjust to the next 2-hour interval
  if (currentMinute > 0) {
    currentHour += 1
  }
  // currentHour -= currentHour % 2
  currentMinute = 0

  while (currentHour < 23) {
    const startInterval = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      currentHour,
      currentMinute
    )
    intervals.push(dayjs(startInterval).format('YYYY-MM-DDTHH:mm:ss'))
    currentHour += 1
  }

  return intervals
}
