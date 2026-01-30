import type {
  UserLocation,
  UserLocationCreate,
  UserLocationUpdate,
  LocationIcon,
  ReverseGeocodeResponse,
  AddressSuggestionsResponse,
  ActivateLocationResponse,
  DeleteLocationResponse,
} from '~/types/locations'
import { useChakanaApi } from './useChakanaApi'

/**
 * Composable для работы с локациями пользователя
 * Использует Chakana API эндпоинты
 */
export const useLocations = () => {
  const api = useApi()
  const chakanaApi = useChakanaApi()

  /**
   * Получить список иконок локаций
   * GET /location-icons/
   * Использует Chakana API
   */
  const getLocationIcons = async (
    search?: string
  ): Promise<LocationIcon[]> => {
    const params = search ? { search } : {}
    const response = await chakanaApi.$get<LocationIcon[] | {
      success?: boolean
      message?: string
      data?: LocationIcon[]
      results?: LocationIcon[]
    }>('/location-icons/', { params })
    
    // API может вернуть массив или объект с data/results
    if (Array.isArray(response)) {
      return response
    }
    if (response?.data && Array.isArray(response.data)) {
      return response.data
    }
    if (response?.results && Array.isArray(response.results)) {
      return response.results
    }
    return []
  }

  /**
   * Получить список локаций пользователя
   * GET /locations/
   * API может вернуть массив или объект с results/items
   */
  const getLocations = async (params?: {
    search?: string
    limit?: number
    offset?: number
  }): Promise<UserLocation[]> => {
    const response = await api.$get<any>('/locations/', { params })
    // Обрабатываем разные форматы ответа
    if (Array.isArray(response)) {
      return response
    }
    // Если объект с results или items
    return response?.results || response?.items || []
  }

  /**
   * Получить детали конкретной локации
   * GET /locations/{id}/
   */
  const getLocation = async (id: number | string): Promise<UserLocation> => {
    return api.$get<UserLocation>(`/locations/${id}/`)
  }

  /**
   * Создать новую локацию
   * POST /locations/add/
   * Использует Chakana API
   */
  const createLocation = async (
    data: UserLocationCreate
  ): Promise<UserLocation> => {
    console.log('[useLocations] createLocation called with data:', data)
    const response = await chakanaApi.$post<any>('/locations/add/', data)
    console.log('[useLocations] createLocation response:', response)
    
    // API может вернуть { success, message, data: {...} } или напрямую объект
    if (response?.data) {
      console.log('[useLocations] Using response.data')
      return response.data
    }
    console.log('[useLocations] Using response directly')
    return response
  }

  /**
   * Обновить локацию (PUT - полное обновление)
   * PUT /locations/{id}/edit/
   */
  const updateLocation = async (
    id: number | string,
    data: UserLocationUpdate
  ): Promise<UserLocation> => {
    return api.$put<UserLocation>(`/locations/${id}/edit/`, { body: data })
  }

  /**
   * Частично обновить локацию (PATCH)
   * PATCH /locations/{id}/edit/
   */
  const patchLocation = async (
    id: number | string,
    data: Partial<UserLocationUpdate>
  ): Promise<UserLocation> => {
    return api.$patch<UserLocation>(`/locations/${id}/edit/`, { body: data })
  }

  /**
   * Удалить локацию
   * DELETE /locations/{id}/
   * Использует Chakana API для правильной аутентификации
   */
  const deleteLocation = async (
    id: number | string
  ): Promise<DeleteLocationResponse> => {
    console.log('[useLocations] deleteLocation called with id:', id)
    
    // Используем request напрямую с методом DELETE
    const response = await chakanaApi.request<DeleteLocationResponse>(`/locations/${id}/`, {
      method: 'DELETE',
    })
    console.log('[useLocations] deleteLocation response:', response)
    return response
  }

  /**
   * Активировать локацию
   * POST /locations/{location_id}/activate/
   * Использует Chakana API
   */
  const activateLocation = async (
    locationId: number | string
  ): Promise<ActivateLocationResponse> => {
    console.log('[useLocations] activateLocation called with id:', locationId)
    if (!locationId || locationId === 'undefined') {
      throw new Error('Location ID is required for activation')
    }
    const response = await chakanaApi.$post<ActivateLocationResponse>(
      `/locations/${locationId}/activate/`,
      {}
    )
    console.log('[useLocations] activateLocation response:', response)
    return response
  }

  /**
   * Обратное геокодирование - получить адрес по координатам
   * GET /common/address/
   * Использует Chakana API
   * API возвращает { success, message, data: { short_address, long_address, ... } }
   */
  const reverseGeocode = async (
    latitude: number,
    longitude: number
  ): Promise<ReverseGeocodeResponse> => {
    console.log('[useLocations] reverseGeocode called with lat:', latitude, 'lng:', longitude)
    const response = await chakanaApi.$get<{
      success?: boolean
      message?: string
      data?: {
        short_address?: string
        long_address?: string
        zip_code?: string
        street?: string
      }
      short_address?: string
      long_address?: string
    }>('/common/address/', {
      params: { latitude, longitude },
    })
    
    console.log('[useLocations] API response:', JSON.stringify(response, null, 2))
    console.log('[useLocations] response.data:', response?.data)
    
    // API возвращает { success, message, data: { ... } }
    if (response?.data) {
      const result = {
        short_address: response.data.short_address || '',
        long_address: response.data.long_address || '',
        zip_code: response.data.zip_code || '',
        street: response.data.street || '',
      }
      console.log('[useLocations] Parsed result:', result)
      return result
    }
    
    // Fallback для старого формата
    const fallback = {
      short_address: response.short_address || '',
      long_address: response.long_address || '',
      zip_code: '',
      street: '',
    }
    console.log('[useLocations] Using fallback:', fallback)
    return fallback
  }

  /**
   * Поиск предложений адресов
   * GET /common/address/suggestions/
   */
  const getAddressSuggestions = async (
    query: string
  ): Promise<AddressSuggestionsResponse> => {
    if (query.length < 2) {
      return { suggestions: [] }
    }
    return api.$get<AddressSuggestionsResponse>('/common/address/suggestions/', {
      params: { query },
    })
  }

  return {
    getLocationIcons,
    getLocations,
    getLocation,
    createLocation,
    updateLocation,
    patchLocation,
    deleteLocation,
    activateLocation,
    reverseGeocode,
    getAddressSuggestions,
  }
}
