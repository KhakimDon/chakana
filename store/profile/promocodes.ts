import type { IPromocodeDetail } from '~/types/profile.js'

export const usePromocodesStore = defineStore('promocodesStore', {
  state: () => ({
    promocodes: {
      list: [] as IPromocodeDetail[],
      loading: true,
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
    async applyPromocode(code: string) {
      return await useApi().$post('/promo-code/apply', {
        body: {
          code,
        },
      })
    },
  },
})
