export const useCartOrderStore = defineStore('cartOrderStore', () => {
  const orderDetail = ref()

  const autoOrderDetail = reactive({
    name: '',
    when_to_deliver: '',
    payment_method: {
      card_to_the_courier: false,
      cash: false,
      card_id: 0,
      provider_id: 0,
    },
    weekday: 1,
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

  const weekdays = reactive({
    list: [],
    loading: true,
  })

  function getWeekdaysList() {
    return new Promise((resolve, reject) => {
      weekdays.loading = true
      useApi()
        .$get(`/weekdays`, {})
        .then((res: any) => {
          weekdays.list = res
          resolve(res)
        })
        .catch((error: any) => {
          reject(error)
        })
        .finally(() => {
          weekdays.loading = false
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

  const delivery = reactive({
    detail: {},
    loading: true,
  })

  function getDeliveryDetail() {
    return new Promise((resolve, reject) => {
      delivery.loading = true
      useApi()
        .$get(`/delivery/details`, {})
        .then((res: any) => {
          delivery.detail = res
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          delivery.loading = false
        })
    })
  }

  function getCartDetailConfirm(data?: {
    promo_code_id?: number
    address_id?: number
    is_use_balance?: boolean
  }) {
    return new Promise((resolve, reject) => {
      cart.loading = true
      useApi()
        .$get(`/cart/detail/web/confirm`, {
          query: {
            ...data,
          },
        })
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

  const clearingCart = ref(false)

  function cartClear() {
    return new Promise((resolve, reject) => {
      clearingCart.value = true
      useApi()
        .$post(`/cart/clear`, {})
        .then((res: any) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          clearingCart.value = false
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

  const autoOrderCreating = ref(false)

  function createAutoOrder(body: any) {
    return new Promise((resolve, reject) => {
      autoOrderCreating.value = true
      useApi()
        .$post(`/auto-order/create`, {
          body,
        })
        .then((res: any) => {
          resolve(res)
        })
        .catch((error: any) => {
          reject(error)
        })
        .finally(() => {
          autoOrderCreating.value = false
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
    clearingCart,
    cartClear,
    addToCart,
    orderDetail,
    autoOrderDetail,
    orderCreating,
    createOrder,
    getCartDetailConfirm,
    delivery,
    getDeliveryDetail,
    weekdays,
    getWeekdaysList,
    autoOrderCreating,
    createAutoOrder,
  }
})
