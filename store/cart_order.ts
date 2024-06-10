export const useCartOrderStore = defineStore('cartOrderStore', () => {
  const orderDetail = reactive({
    address: {
      id: 0,
    },
    when_to_deliver: new Date(),
    recipient: {
      full_name: '',
      phone: '',
    },
    comment_to_courier: '',
    payment_method: {
      card_to_the_courier: false,
      cash: false,
      card_id: 0,
      provider_id: 0,
    },
    promo_code_id: 0,
    use_from_balance: false,
  })

  const promoCodes = reactive({
    list: [],
    loading: true,
  })

  function getPromoCodeList(params?: any) {
    return new Promise((resolve, reject) => {
      promoCodes.loading = true
      useApi()
        .$get(`/promo-codes`, {
          params: {
            ...params,
          },
        })
        .then((res: any) => {
          promoCodes.list = res
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          promoCodes.loading = false
        })
    })
  }

  const promoCode = reactive({
    detail: {},
    loading: true,
  })

  function getPromoCodeDetail(id: string) {
    return new Promise((resolve, reject) => {
      promoCode.loading = true
      useApi()
        .$get(`/promo-code/${id}`, {})
        .then((res: any) => {
          promoCode.detail = res
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          promoCode.loading = false
        })
    })
  }

  const applyingPromoCode = ref(false)
  const isInvalidPromoCode = ref(false)
  function applyPromoCode(code: string) {
    return new Promise((resolve, reject) => {
      applyingPromoCode.value = true
      useApi()
        .$post(`/promo-code/apply`, {
          body: {
            code,
          },
        })
        .then((res: any) => {
          isInvalidPromoCode.value = false
          resolve(res)
        })
        .catch((error) => {
          isInvalidPromoCode.value = true
          reject(error)
        })
        .finally(() => {
          applyingPromoCode.value = false
        })
    })
  }

  const discount = reactive({
    detail: {},
    loading: true,
  })

  function getCartDiscountDetail(id: string) {
    return new Promise((resolve, reject) => {
      discount.loading = true
      useApi()
        .$get(`/cart/discounts`, {
          query: {
            promo_code_id: id,
          },
        })
        .then((res: any) => {
          discount.detail = res
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          discount.loading = false
        })
    })
  }

  const cart = reactive({
    detail: {},
    loading: true,
  })

  function getCartDetail() {
    return new Promise((resolve, reject) => {
      cart.loading = true
      useApi()
        .$get(`/cart/detail/mobile`, {})
        .then((res: any) => {
          cart.detail = res
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          cart.loading = false
        })
    })
  }

  function cartClear() {
    return new Promise((resolve, reject) => {
      useApi()
        .$post(`/cart/clear`, {})
        .then((res: any) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  function addToCart(pId: number, count: number) {
    return new Promise((resolve, reject) => {
      useApi()
        .$post(`/cart/add/mobile`, {
          body: {
            product_id: pId,
            count,
          },
        })
        .then((res: any) => {
          resolve(res)
          getCartDetail().then(() => {})
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  const orderCreating = ref(false)

  function createOrder(orderDetail: any) {
    return new Promise((resolve, reject) => {
      orderCreating.value = true
      useApi()
        .$post(`/order/create`, {
          body: {
            ...orderDetail,
          },
        })
        .then((res: any) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          orderCreating.value = false
        })
    })
  }

  return {
    promoCodes,
    getPromoCodeList,
    applyingPromoCode,
    applyPromoCode,
    isInvalidPromoCode,
    promoCode,
    getPromoCodeDetail,
    discount,
    getCartDiscountDetail,
    cart,
    getCartDetail,
    cartClear,
    addToCart,
    orderDetail,
    orderCreating,
    createOrder,
  }
})
