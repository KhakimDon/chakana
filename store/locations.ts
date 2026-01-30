import { defineStore } from 'pinia'
import type {
  UserLocation,
  LocationIcon,
  UserLocationCreate,
  UserLocationUpdate,
  AddressSuggestionItem,
  ReverseGeocodeResponse,
} from '~/types/locations'
import { useChakanaApi } from '~/composables/useChakanaApi'

export const useLocationsStore = defineStore('locationsStore', {
  state: () => ({
    // Список локаций пользователя
    locations: [] as UserLocation[],
    locationsLoading: false,
    
    // Активная локация
    activeLocation: null as UserLocation | null,
    
    // Иконки локаций
    locationIcons: [] as LocationIcon[],
    iconsLoading: false,
    
    // Поиск адресов
    addressSuggestions: [] as AddressSuggestionItem[],
    suggestionsLoading: false,
    
    // Обратное геокодирование
    reverseGeocodeData: null as ReverseGeocodeResponse | null,
    reverseGeocodeLoading: false,
  }),

  getters: {
    /**
     * Получить активную локацию
     */
    getActiveLocation: (state): UserLocation | null => {
      return state.activeLocation || state.locations.find(loc => loc.is_active) || null
    },

    /**
     * Получить первую локацию (последнюю в списке)
     * Используется для подтверждения, когда нет активной локации
     */
    getFirstLocation: (state): UserLocation | null => {
      return state.locations.length > 0 ? state.locations[0] : null
    },

    /**
     * Получить локацию по ID
     */
    getLocationById: (state) => {
      return (id: number | string) => {
        return state.locations.find(loc => loc.id === Number(id))
      }
    },

    /**
     * Проверить, есть ли локации
     */
    hasLocations: (state): boolean => {
      return state.locations.length > 0
    },
  },

  actions: {
    /**
     * Загрузить список локаций пользователя
     */
    async fetchLocations(params?: { search?: string; limit?: number; offset?: number }) {
      // Предотвращаем параллельные запросы
      if (this.locationsLoading) {
        return this.locations
      }
      
      this.locationsLoading = true
      try {
        const locationsApi = useLocations()
        const response = await locationsApi.getLocations(params)
        
        // API может вернуть массив или объект с results
        const locations = Array.isArray(response) 
          ? response 
          : (response?.results || response?.items || [])
        
        this.locations = locations
        // Обновляем активную локацию
        this.activeLocation = locations.find(loc => loc.is_active) || null
        return locations
      } catch (error) {
        console.error('Error fetching locations:', error)
        this.locations = []
        this.activeLocation = null
        throw error
      } finally {
        this.locationsLoading = false
      }
    },

    /**
     * Загрузить детали конкретной локации
     */
    async fetchLocation(id: number | string) {
      try {
        const locationsApi = useLocations()
        const location = await locationsApi.getLocation(id)
        // Обновляем локацию в списке, если она там есть
        const index = this.locations.findIndex(loc => loc.id === location.id)
        if (index !== -1) {
          this.locations[index] = location
        } else {
          this.locations.push(location)
        }
        // Если это активная локация, обновляем activeLocation
        if (location.is_active) {
          this.activeLocation = location
        }
        return location
      } catch (error) {
        console.error('Error fetching location:', error)
        throw error
      }
    },

    /**
     * Создать новую локацию
     */
    async createLocation(data: UserLocationCreate) {
      try {
        console.log('[LocationsStore] Creating location with data:', data)
        const locationsApi = useLocations()
        const newLocation = await locationsApi.createLocation(data)
        console.log('[LocationsStore] Created location response:', newLocation)
        console.log('[LocationsStore] Location ID:', newLocation?.id)
        
        if (!newLocation?.id) {
          console.error('[LocationsStore] Location ID is missing!', newLocation)
          throw new Error('Location ID is missing after creation')
        }
        
        // Добавляем в список
        this.locations.push(newLocation)
        // Если это активная локация, обновляем activeLocation
        if (newLocation.is_active) {
          this.activeLocation = newLocation
          // Деактивируем остальные
          this.locations.forEach(loc => {
            if (loc.id !== newLocation.id) {
              loc.is_active = false
            }
          })
        }
        return newLocation
      } catch (error) {
        console.error('[LocationsStore] Error creating location:', error)
        throw error
      }
    },

    /**
     * Обновить локацию
     */
    async updateLocation(id: number | string, data: UserLocationUpdate) {
      try {
        const locationsApi = useLocations()
        const updatedLocation = await locationsApi.updateLocation(id, data)
        // Обновляем в списке
        const index = this.locations.findIndex(loc => loc.id === Number(id))
        if (index !== -1) {
          this.locations[index] = updatedLocation
        }
        // Если это активная локация, обновляем activeLocation
        if (updatedLocation.is_active) {
          this.activeLocation = updatedLocation
        }
        return updatedLocation
      } catch (error) {
        console.error('Error updating location:', error)
        throw error
      }
    },

    /**
     * Частично обновить локацию
     */
    async patchLocation(id: number | string, data: Partial<UserLocationUpdate>) {
      try {
        const locationsApi = useLocations()
        const updatedLocation = await locationsApi.patchLocation(id, data)
        // Обновляем в списке
        const index = this.locations.findIndex(loc => loc.id === Number(id))
        if (index !== -1) {
          this.locations[index] = updatedLocation
        }
        // Если это активная локация, обновляем activeLocation
        if (updatedLocation.is_active) {
          this.activeLocation = updatedLocation
          // Деактивируем остальные
          this.locations.forEach(loc => {
            if (loc.id !== updatedLocation.id) {
              loc.is_active = false
            }
          })
        }
        return updatedLocation
      } catch (error) {
        console.error('Error patching location:', error)
        throw error
      }
    },

    /**
     * Удалить локацию
     */
    async deleteLocation(id: number | string) {
      try {
        const locationsApi = useLocations()
        await locationsApi.deleteLocation(id)
        // Удаляем из списка
        this.locations = this.locations.filter(loc => loc.id !== Number(id))
        // Если удалили активную локацию, очищаем activeLocation
        if (this.activeLocation?.id === Number(id)) {
          this.activeLocation = null
        }
      } catch (error) {
        console.error('Error deleting location:', error)
        throw error
      }
    },

    /**
     * Активировать локацию
     */
    async activateLocation(locationId: number | string) {
      try {
        const locationsApi = useLocations()
        const response = await locationsApi.activateLocation(locationId)
        // Обновляем все локации
        this.locations.forEach(loc => {
          loc.is_active = loc.id === response.location.id
        })
        this.activeLocation = response.location
        return response
      } catch (error) {
        console.error('Error activating location:', error)
        throw error
      }
    },

    /**
     * Загрузить иконки локаций
     */
    async fetchLocationIcons(search?: string) {
      this.iconsLoading = true
      try {
        const locationsApi = useLocations()
        const icons = await locationsApi.getLocationIcons(search)
        this.locationIcons = icons
        return icons
      } catch (error) {
        console.error('Error fetching location icons:', error)
        throw error
      } finally {
        this.iconsLoading = false
      }
    },

    /**
     * Поиск предложений адресов
     */
    async searchAddressSuggestions(query: string) {
      console.log('[LocationsStore] searchAddressSuggestions CALLED with query:', query)
      if (query.length < 2) {
        console.log('[LocationsStore] Query too short, clearing suggestions')
        this.addressSuggestions = []
        return []
      }
      console.log('[LocationsStore] Setting loading to true')
      this.suggestionsLoading = true
      try {
        console.log('[LocationsStore] Getting API instance')
        const api = useChakanaApi()
        console.log('[LocationsStore] API instance:', api)
        console.log('[LocationsStore] Fetching suggestions for query:', query)
        const response = await api.$get<any>(
          '/common/address/suggestions/',
          { params: { query } }
        )
        console.log('[LocationsStore] API response received:', response)
        console.log('[LocationsStore] API response stringified:', JSON.stringify(response, null, 2))
        console.log('[LocationsStore] Response type:', typeof response)
        console.log('[LocationsStore] Response.data:', response?.data)
        console.log('[LocationsStore] Response.data.suggestions:', response?.data?.suggestions)
        
        // API возвращает { success, message, data: { suggestions } }
        let suggestions: AddressSuggestionItem[] = []
        if (response?.data?.suggestions && Array.isArray(response.data.suggestions)) {
          suggestions = response.data.suggestions
          console.log('[LocationsStore] Using response.data.suggestions, count:', suggestions.length)
        } else if (response?.suggestions && Array.isArray(response.suggestions)) {
          suggestions = response.suggestions
          console.log('[LocationsStore] Using response.suggestions, count:', suggestions.length)
        } else if (Array.isArray(response)) {
          suggestions = response
          console.log('[LocationsStore] Using response as array, count:', suggestions.length)
        } else {
          console.warn('[LocationsStore] Unexpected response format:', response)
        }
        
        console.log('[LocationsStore] Extracted suggestions:', suggestions.length, suggestions)
        console.log('[LocationsStore] Before assignment, this.addressSuggestions:', this.addressSuggestions.length)
        this.addressSuggestions = suggestions
        console.log('[LocationsStore] After assignment, this.addressSuggestions:', this.addressSuggestions.length)
        console.log('[LocationsStore] After assignment, this.addressSuggestions data:', this.addressSuggestions)
        return this.addressSuggestions
      } catch (error) {
        console.error('[LocationsStore] Error searching address suggestions:', error)
        console.error('[LocationsStore] Error details:', error instanceof Error ? error.message : String(error))
        console.error('[LocationsStore] Error stack:', error instanceof Error ? error.stack : 'No stack')
        this.addressSuggestions = []
        throw error
      } finally {
        console.log('[LocationsStore] Setting loading to false')
        this.suggestionsLoading = false
      }
    },

    /**
     * Обратное геокодирование - получить адрес по координатам
     */
    async reverseGeocode(latitude: number, longitude: number) {
      this.reverseGeocodeLoading = true
      try {
        const locationsApi = useLocations()
        const data = await locationsApi.reverseGeocode(latitude, longitude)
        console.log('[LocationsStore] reverseGeocode received data:', data)
        this.reverseGeocodeData = data
        return data
      } catch (error) {
        console.error('[LocationsStore] Error reverse geocoding:', error)
        throw error
      } finally {
        this.reverseGeocodeLoading = false
      }
    },

    /**
     * Очистить предложения адресов
     */
    clearAddressSuggestions() {
      this.addressSuggestions = []
    },

    /**
     * Очистить данные обратного геокодирования
     */
    clearReverseGeocode() {
      this.reverseGeocodeData = null
    },
  },
})
