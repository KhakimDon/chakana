import { defineStore } from 'pinia'

export const useCartStore = defineStore('cartStore', () => {
  const products = ref([])
  const cartProductsLoading = ref(false)

  function getCartProducts() {
    return new Promise((resolve, reject) => {
      cartProductsLoading.value = true
      useApi()
        .$get(`/cart/products/mobile`, {})
        .then((res: any) => {
          products.value = res
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          cartProductsLoading.value = false
        })
    })
  }

  return {
    products,
    cartProductsLoading,
    getCartProducts,
  }
})
