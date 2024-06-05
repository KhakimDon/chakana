import { ICategory } from '~/types/categories'

export const useCategoriesStore = defineStore('categoriesStore', {
  state: () => ({
    categories: {
      list: [] as ICategory[],
      loading: true,
    },
    single: {} as ICategory,
  }),
  actions: {
    fetchCategories() {
      return new Promise((resolve, reject) => {
        useApi()
          .$get('/categories')
          .then((res) => {
            this.categories.list = res
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
          .finally(() => {
            this.categories.loading = false
          })
      })
    },
  },
})
