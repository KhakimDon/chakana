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

/**
 * Composable для работы с локациями пользователя
 * Использует Chakana API эндпоинты
 */
export const useLocations = () => {
  const api = useApi()

  /**
   * Получить список иконок локаций
   * GET /location-icons/
   */
  const getLocationIcons = async (
    search?: string
  ): Promise<LocationIcon[]> => {
    const params = search ? { search } : {}
    return api.$get<LocationIcon[]>('/location-icons/', { params })
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
   */
  const createLocation = async (
    data: UserLocationCreate
  ): Promise<UserLocation> => {
    return api.$post<UserLocation>('/locations/add/', { body: data })
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
   */
  const deleteLocation = async (
    id: number | string
  ): Promise<DeleteLocationResponse> => {
    return api.$delete<DeleteLocationResponse>(`/locations/${id}/`)
  }

  /**
   * Активировать локацию
   * POST /locations/{location_id}/activate/
   */
  const activateLocation = async (
    locationId: number | string
  ): Promise<ActivateLocationResponse> => {
    return api.$post<ActivateLocationResponse>(
      `/locations/${locationId}/activate/`,
      { body: {} }
    )
  }

  /**
   * Обратное геокодирование - получить адрес по координатам
   * GET /common/address/
   */
  const reverseGeocode = async (
    latitude: number,
    longitude: number
  ): Promise<ReverseGeocodeResponse> => {
    return api.$get<ReverseGeocodeResponse>('/common/address/', {
      params: { latitude, longitude },
    })
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
