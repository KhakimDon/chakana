import type { IResponse } from '~/types'
import type { INotification } from '~/types/profile'

export const useNotificationsStore = defineStore('notificationsStore', {
  state: () => ({
    notifications: {
      list: [] as INotification[],
      loading: true,
      moreLoading: false,
      next: null as null | string,
    },
    notificationsParams: {
      page: 1,
      page_size: 10,
    },
  }),
  actions: {
    fetchNotifications(merge = false) {
      useApi()
        .$get<IResponse<INotification>>('/notifications', {
          params: this.notificationsParams,
        })
        .then((res: any) => {
          if (merge) {
            this.notifications.list = [...this.notifications.list, ...res.items]
          } else {
            this.notifications.list = res.items
            this.notifications.next = res.next
          }
        })
        .finally(() => {
          this.notifications.loading = false
          this.notifications.moreLoading = false
        })
    },
  },
})
