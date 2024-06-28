import { defineStore } from 'pinia'

export const useCartStore = defineStore('cartStore', () => {
  const products = ref<any[]>([])
  const autoOrderProducts = ref<any[]>([])
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

  function addToCart(product: any, quantity: number) {
    if (quantity === 0) {
      products.value = products.value?.filter((p) => p.id !== product.id)
    } else if (products.value?.find((p) => p?.id === product.id)) {
      products.value.find((p) => p?.id === product.id).quantity = quantity
    } else {
      products.value?.push({
        ...product,
        quantity,
      })
    }
  }

  return {
    products,
    autoOrderProducts,
    cartProductsLoading,
    getCartProducts,
    addToCart,
  }
})
