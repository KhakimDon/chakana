import { defineStore } from 'pinia'

export const useCartStore = defineStore('cartStore', {
  state: () => ({
    products: [],
    autoOrderProducts: [],
    cartProductsLoading: false,
  }),
  actions: {
    getCartProducts() {
      return new Promise((resolve, reject) => {
        this.cartProductsLoading = true
        useApi()
          .$get(`/cart/products/mobile`, {})
          .then((res) => {
            this.products = res
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
          .finally(() => {
            this.cartProductsLoading = false
          })
      })
    },
    addToCart(product: any, quantity: any) {
      if (quantity === 0) {
        this.products = this.products.filter((p) => p.id !== product.id)
      } else {
        const existingProduct = this.products.find((p) => p.id === product.id)
        if (existingProduct) {
          existingProduct.quantity = quantity
        } else {
          this.products.push({
            ...product,
            quantity,
          })
        }
      }
    },
  },
})
