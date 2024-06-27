import { orderFormName } from '~/components/Order/Info/Form/index.js'

export const steps = [
  {
    id: 'name',
    icon: 'SvgoCommonEdit',
  },
  {
    id: 'when_to_deliver',
    icon: 'SvgoProfileClockLocation',
  },
  {
    id: 'payment',
    icon: 'SvgoProfileMoney',
  },
]

export const orderSteps = [
  {
    id: 'address',
    icon: 'SvgoProfileTruck',
  },
  {
    id: 'when_to_deliver',
    icon: 'SvgoProfileClockLocation',
  },
  {
    id: 'user',
    icon: 'SvgoProfileUserCircle',
  },
  {
    id: 'comment',
    icon: 'SvgoProfileMessage',
  },
  {
    id: 'promo',
    icon: 'SvgoProfileTicket',
  },
  {
    id: 'payment',
    icon: 'SvgoProfileMoney',
  },
]

export const autoOrderSteps = [
  {
    id: 'name',
    icon: 'SvgoCommonEdit',
    component: 'OrderInfoFormName',
    form: orderFormName,
  },
  {
    id: 'address',
    icon: 'SvgoProfileTruck',
  },
  {
    id: 'when_to_deliver',
    icon: 'SvgoProfileClockLocation',
  },
  {
    id: 'user',
    icon: 'SvgoProfileUserCircle',
  },
  {
    id: 'comment',
    icon: 'SvgoProfileMessage',
  },
  {
    id: 'promo',
    icon: 'SvgoProfileTicket',
  },
  {
    id: 'payment',
    icon: 'SvgoProfileMoney',
  },
]
