export const usePaymentStore = defineStore('paymentStore', () => {
  const paymentProviders = reactive({
    list: [],
    loading: true,
  })

  function getPaymentProviderList(params?: any) {
    return new Promise((resolve, reject) => {
      paymentProviders.loading = true
      useApi()
        .$get(`/payment/providers`, {
          params: {
            ...params,
          },
        })
        .then((res: any) => {
          paymentProviders.list = res
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          paymentProviders.loading = false
        })
    })
  }

  return {
    paymentProviders,
    getPaymentProviderList,
  }
})
