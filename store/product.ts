export const useProductStore = defineStore('productStore', {
  state: () => ({
    currentProduct: null as any,
    productCache: {} as Record<string, any>,
  }),
  actions: {
    setCurrentProduct(product: any) {
      this.currentProduct = product
      if (product?.id) {
        this.productCache[product.id] = product
      }
    },
    getProductById(id: string | number) {
      return this.productCache[id] || null
    },
    clearCurrentProduct() {
      this.currentProduct = null
    },
  },
})
