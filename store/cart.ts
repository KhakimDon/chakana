import { defineStore } from 'pinia'

export const useCartStore = defineStore('cartStore', () => {
  const products = ref([])

  function getCartProducts() {
    return new Promise((resolve, reject) => {
      useApi()
        .$get(`/cart/products/mobile`, {})
        .then((res: any) => {
          products.value = res
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  return {
    products,
    getCartProducts,
  }
})
