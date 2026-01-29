import { ICategory, ISellerCategory } from '~/types/categories'

export const useCategoriesStore = defineStore('categoriesStore', {
  state: () => ({
    categories: {
      list: [] as ICategory[],
      loading: true,
    },
    // Категории магазинов для сайдбара
    sellerCategories: {
      list: [] as ISellerCategory[],
      loading: true,
    },
    // ID выбранной категории (null = все)
    selectedCategoryId: null as number | null,
    single: {} as ICategory,
  }),
  actions: {
    // Выбрать категорию
    selectCategory(categoryId: number | null) {
      this.selectedCategoryId = categoryId
    },

    // Сбросить выбор категории (показать все)
    clearCategorySelection() {
      this.selectedCategoryId = null
    },

    // Получить категории магазинов для сайдбара
    fetchSellerCategories() {
      return new Promise((resolve, reject) => {
        this.sellerCategories.loading = true
        useChakanaApi()
          .$get('/stores/categories/')
          .then((res: any) => {
            // API возвращает массив напрямую
            this.sellerCategories.list = Array.isArray(res) ? res : []
            
            // Также обновляем основной список категорий для совместимости с сайдбаром
            this.categories.list = this.sellerCategories.list.map((cat: ISellerCategory) => ({
              id: cat.id,
              name: cat.title,
              title: cat.title,
              image: cat.icon_url || cat.icon,
              icon: cat.icon,
              icon_url: cat.icon_url,
              is_active: true,
              has_children: false,
              sellers_count: cat.sellers_count,
            }))
            
            resolve(res)
          })
          .catch((error: any) => {
            console.error('Failed to fetch seller categories:', error)
            reject(error)
          })
          .finally(() => {
            this.sellerCategories.loading = false
            this.categories.loading = false
          })
      })
    },
    
    // Старый метод для совместимости (теперь вызывает fetchSellerCategories)
    fetchCategories() {
      return this.fetchSellerCategories()
    },
  },
})
