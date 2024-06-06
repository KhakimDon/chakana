export const useMainStore = defineStore('mainStore', {
  state: () => ({
    products: {
      list: [],
      loading: true,
      params: {
        page: 1,
        page_size: 15,
        total: 0,
        loading: false,
      },
    },

    discounts: {
      list: [],
      loading: true,
    },

    brands: {
      list: [],
      loading: true,
      params: {
        page: 1,
        page_size: 30,
        total: 0,
        loading: false,
      },
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
    fetchProducts(force = true) {
      return new Promise((resolve, reject) => {
        if (force) {
          this.products.params.page = 1
        } else {
          this.products.params.loading = true
          this.products.params.page += 1
          this.products.params.loading = true
        }
        useApi()
          .$get('/new/products', {
            params: {
              page_size: this.products.params.page_size,
              page: this.products.params.page,
            },
          })
          .then((res: any) => {
            if (force) {
              this.products.list = res?.items
            } else {
              this.products.list = this.products.list.concat(res?.items)
            }
            this.products.params.total = res?.count
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
          .finally(() => {
            this.products.loading = false
            this.products.params.loading = false
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

    fetchBrands(force = true) {
      return new Promise((resolve, reject) => {
        if (force) {
          this.brands.params.page = 1
        } else {
          this.brands.params.loading = true
          this.brands.params.page += 1
          this.brands.params.loading = true
        }
        useApi()
          .$get('/brands/pagination', {
            params: {
              page_size: this.brands.params.page_size,
              page: this.brands.params.page,
            },
          })
          .then((res: any) => {
            if (force) {
              this.brands.list = res?.items
            } else {
              this.brands.list = this.brands.list.concat(res?.items)
            }
            this.brands.params.total = res?.count
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
          .finally(() => {
            this.brands.loading = false
            this.brands.params.loading = false
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
