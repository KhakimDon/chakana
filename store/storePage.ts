export const useStorePageStore = defineStore('storePageStore', {
  state: () => ({
    isStorePage: false,
    store: null as any,
    storeId: null as string | number | null, // ID текущего магазина
    categories: [] as any[],
    categoriesLoading: false,
    selectedCategoryId: null as number | null,
  }),
  actions: {
    setIsStorePage(value: boolean) {
      this.isStorePage = value
    },
    setStore(store: any) {
      this.store = store
      if (store) {
        this.storeId = store.id || store.seller_id
      }
    },
    setStoreId(id: string | number | null) {
      this.storeId = id
    },
    setCategories(categories: any[]) {
      this.categories = categories
    },
    setCategoriesLoading(loading: boolean) {
      this.categoriesLoading = loading
    },
    selectCategory(categoryId: number | null) {
      this.selectedCategoryId = categoryId
    },
    reset() {
      this.isStorePage = false
      this.store = null
      this.storeId = null
      this.categories = []
      this.categoriesLoading = false
      this.selectedCategoryId = null
    },
  },
})
