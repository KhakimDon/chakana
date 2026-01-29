import type {
  ReverseGeocodeResponse,
  AddressSuggestionItem,
} from '~/types/locations'

export const useAddressStore = defineStore('addressStore', {
  state: () => ({
    searchAddressList: {
      list: [] as AddressSuggestionItem[],
      loading: false,
    },
    addressMap: {
      data: null as ReverseGeocodeResponse | null,
      loading: false,
    },
    coordinates: [] as number[],
    savedAddress: {} as any,
  }),
  actions: {
    /**
     * Получить адрес по координатам (обратное геокодирование)
     * Использует правильный эндпоинт: /common/address/
     */
    async fetchAddress(lat: number, long: number) {
      this.addressMap.loading = true
      try {
        const locationsApi = useLocations()
        const response = await locationsApi.reverseGeocode(lat, long)
        this.addressMap.data = response
        return response
      } catch (error) {
        console.error('Error fetching address:', error)
        throw error
      } finally {
        this.addressMap.loading = false
      }
    },

    /**
     * Поиск предложений адресов
     * Использует правильный эндпоинт: /common/address/suggestions/
     */
    async searchAddress(query: string) {
      if (query.length < 2) {
        this.searchAddressList.list = []
        return []
      }
      this.searchAddressList.loading = true
      try {
        const locationsApi = useLocations()
        const response = await locationsApi.getAddressSuggestions(query)
        this.searchAddressList.list = response.suggestions || []
        return response
      } catch (error) {
        console.error('Error searching address:', error)
        this.searchAddressList.list = []
        throw error
      } finally {
        this.searchAddressList.loading = false
      }
    },
  },
})
