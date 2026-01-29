import { defineStore } from 'pinia'
import type {
  UserLocation,
  LocationIcon,
  UserLocationCreate,
  UserLocationUpdate,
  AddressSuggestionItem,
  ReverseGeocodeResponse,
} from '~/types/locations'

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
        const locationsApi = useLocations()
        const newLocation = await locationsApi.createLocation(data)
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
        console.error('Error creating location:', error)
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
      if (query.length < 2) {
        this.addressSuggestions = []
        return []
      }
      this.suggestionsLoading = true
      try {
        const locationsApi = useLocations()
        const response = await locationsApi.getAddressSuggestions(query)
        this.addressSuggestions = response.suggestions || []
        return this.addressSuggestions
      } catch (error) {
        console.error('Error searching address suggestions:', error)
        this.addressSuggestions = []
        throw error
      } finally {
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
        this.reverseGeocodeData = data
        return data
      } catch (error) {
        console.error('Error reverse geocoding:', error)
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
