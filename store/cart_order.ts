export const useCartOrderStore = defineStore('cartOrderStore', () => {
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

  return {
    promoCodes,
    getPromoCodeList,
    applyingPromoCode,
    applyPromoCode,
    isInvalidPromoCode,
    promoCode,
    getPromoCodeDetail,
  }
})
