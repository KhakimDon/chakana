import type { IResponse } from '~/types'
import type { INotification, IOrderCard } from '~/types/profile'

export const useOrderStore = defineStore('orderStore', {
  state: () => ({
    orders: {
      active: {
        list: [] as IOrderCard[],
        loading: true,
      },
      archive: {
        list: [] as IOrderCard[],
        loading: true,
      },
    },
  }),
  actions: {
    fetchOrders(type: 'active' | 'archive' = 'active') {
      if (this.orders[type].list.length) return
      useApi()
        .$get('/order/list', { params: { status: type } })
        .then((res: IOrderCard[]) => {
          this.orders[type].list = res
        })
        .finally(() => {
          this.orders[type].loading = false
        })
    },
  },
})
