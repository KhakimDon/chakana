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
    getSubscription(data) {
      return new Promise((resolve, reject) => {
        useApi()
          .$post('/user-subscription/create', { body: data })
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
