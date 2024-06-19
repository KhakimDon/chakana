export const useAddressStore = defineStore('addressStore', {
  state: () => ({
    searchAddressList: {
      list: [],
      loading: true,
    },
    addressMap: {
      list: [],
      loading: true,
    },
    coordinates: [],
  }),
  actions: {
    fetchAddress(lat: number, long: number) {
      return new Promise((resolve, reject) => {
        useApi()
          .$get('/get/address', {
            params: {
              latitude: lat,
              longitude: long,
            },
          })
          .then((res: any) => {
            this.addressMap.list = res
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
          .finally(() => {
            this.addressMap.loading = false
          })
      })
    },
    searchAddress(query: string) {
      return new Promise((resolve, reject) => {
        this.searchAddressList.loading = true
        useApi()
          .$get(`/get/address/suggestions?query=${query}`)
          .then((res: any) => {
            this.searchAddressList.list = res?.suggestions
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
          .finally(() => {
            this.searchAddressList.loading = false
          })
      })
    },
  },
})
