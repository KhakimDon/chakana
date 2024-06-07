import type { IPromocodeDetail } from '~/types/profile.js'

export const usePromocodesStore = defineStore('promocodesStore', {
  state: () => ({
    promocodes: {
      list: [] as IPromocodeDetail[],
      loading: true,
    },
    applyResult: {
      success: true,
      message: '',
    },
  }),
  actions: {
    fetchPromocodes() {
      useApi()
        .$get('/promo-codes')
        .then((res: IPromocodeDetail[]) => {
          this.promocodes.list = res
        })
        .finally(() => {
          this.promocodes.loading = false
        })
    },
    applyPromocode(code: string) {
      return useApi()
        .$post('/promo-code/apply', {
          body: {
            code,
          },
        })
        .then(() => {
          this.applyResult.success = true
          this.applyResult.message = 'Promocode applied successfully!'
          promocodesStore.fetchPromocodes()
        })
        .catch((error) => {
          // const { handleError } = useErrorHandling()
          // handleError(error)

          this.applyResult.success = false
          this.applyResult.message = error?._data?.detail.code
        })
    },
  },
})
