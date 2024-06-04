export const useMainStore = defineStore('mainStore', {
  state: () => ({
    products: {
      list: [],
      loading: true,
    },

    discounts: {
      list: [],
      loading: true,
    },

    brands: {
      list: [],
      loading: true,
    },
    popularBrands: {
      list: [],
      loading: true,
    },

    banners: {
      list: [],
      loading: true,
    },
  }),
  actions: {
    fetchProducts() {
      return new Promise((resolve, reject) => {
        useApi()
          .$get('/new/products')
          .then((res: any) => {
            this.products.list = res?.items
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
          .finally(() => {
            this.products.loading = false
          })
      })
    },

    fetchDiscounts() {
      return new Promise((resolve, reject) => {
        useApi()
          .$get('/discount/products')
          .then((res: any) => {
            this.discounts.list = res?.items
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
          .finally(() => {
            this.discounts.loading = false
          })
      })
    },

    fetchBrands() {
      return new Promise((resolve, reject) => {
        useApi()
          .$get('/brands')
          .then((res: any) => {
            this.brands.list = res
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
          .finally(() => {
            this.brands.loading = false
          })
      })
    },

    fetchPopularBrands() {
      return new Promise((resolve, reject) => {
        useApi()
          .$get('/popular/brands?page_size=15')
          .then((res: any) => {
            this.popularBrands.list = res?.items
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
          .finally(() => {
            this.popularBrands.loading = false
          })
      })
    },
    fetchBanners() {
      return new Promise((resolve, reject) => {
        useApi()
          .$get('/banners')
          .then((res: any) => {
            this.banners.list = res
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
          .finally(() => {
            this.banners.loading = false
          })
      })
    },
  },
})
