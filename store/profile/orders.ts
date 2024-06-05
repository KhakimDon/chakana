import type { IResponse } from '~/types'
import type { INotification, IOrderCard } from '~/types/profile'

export const useOrderStore = defineStore('orderStore', {
  state: () => ({
    orders: {
      list: [] as IOrderCard[],
      loading: true,
    },
  }),
  actions: {
    fetchOrders() {
      useApi()
        .$get('/order/list')
        .then((res: IOrderCard[]) => {
          this.orders.list = res
        })
        .finally(() => {
          this.orders.loading = false
        })
    },
  },
})
