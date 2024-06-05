export const useDiscountsStore = defineStore('discountsStore', {
  state: () => ({
    discounts: {
      list: [],
      loading: true,
      params: {
        page: 1,
        page_size: 12,
        total: 0,
        loading: false,
      },
    },
  }),
  actions: {
    fetchDiscounts(force = true) {
      return new Promise((resolve, reject) => {
        if (force) {
          this.discounts.params.page = 1
        } else {
          this.discounts.params.loading = true
          this.discounts.params.page += 1
        }
        useApi()
          .$get('/discount/products', {
            params: {
              page_size: this.discounts.params.page_size,
              page: this.discounts.params.page,
            },
          })
          .then((res: any) => {
            if (force) {
              this.discounts.list = res?.items
            } else {
              this.discounts.list = res?.items.concat(this.discounts.list)
            }
            this.discounts.params.total = res?.count
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
          .finally(() => {
            this.discounts.loading = false
            this.discounts.params.loading = false
          })
      })
    },
  },
})
