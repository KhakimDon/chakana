import type { IResponse } from '~/types'
import type { INotification } from '~/types/profile'

export interface ISubscription {
  id: number
  title: string
  price: number
}

export const useSubscriptionsStore = defineStore('subscriptionsStore', {
  state: () => ({
    subscription: { id: 0, title: 'Premium', price: 0 } as ISubscription,
  }),
  actions: {
    fetchSubscription() {
      useApi()
        .$get('/subscriptions')
        .then((res: ISubscription[]) => {
          this.subscription = res[0]
        })
    },
    getSubscription() {
      return new Promise((resolve, reject) => {
        useApi()
          .$get('/user-subscription/create')
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
  },
})
