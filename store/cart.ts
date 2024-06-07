import { defineStore } from 'pinia'

export const useCartStore = defineStore('cartStore', {
  state: () => {
    return {
      products: [],
    }
  },
  actions: {
    addToCart(payload: any) {
      if (this.products.find((product) => product?.id === payload?.id)) {
        return
      }
      this.products.push(payload)
    },
    updateToCart(payload: any) {
      const product = this.products.find(
        (product) => product?.id === payload?.id
      )
      if (product) {
        product.cart_count = payload.cart_count
      }
    },
    removeFromCart(id: any) {
      this.products = this.products.filter(
        (product) => Number(product?.id) !== Number(id)
      )
    },
  },
  persist: true,
})
