/**
 * Типы для работы с локациями пользователя
 * Основано на API из full.api.json
 */

/**
 * Иконка локации
 */
export interface LocationIcon {
  id: number
  title: string
  icon: string
  icon_url: string
  created_at: string
  updated_at: string
}

/**
 * Локация пользователя
 */
export interface UserLocation {
  id: number
  title?: string | null
  apartment?: string
  entrance?: string
  floor?: string
  door_password?: string
  latitude: string
  longitude: string
  address?: string
  is_active: boolean
  created_at: string
  location_icon?: number | null
  location_icon_data?: any
}

/**
 * Данные для создания локации
 */
export interface UserLocationCreate {
  title?: string | null
  apartment?: string
  entrance?: string
  floor?: string
  door_password?: string
  latitude: string
  longitude: string
  address?: string
  location_icon?: number | null
}

/**
 * Данные для обновления локации
 */
export interface UserLocationUpdate {
  title?: string | null
  apartment?: string
  entrance?: string
  floor?: string
  door_password?: string
  latitude?: string
  longitude?: string
  address?: string
  location_icon?: number | null
}

/**
 * Ответ обратного геокодинга (координаты -> адрес)
 */
export interface ReverseGeocodeResponse {
  short_address: string
  long_address: string
  zip_code: string
  street: string
}

/**
 * Элемент предложения адреса
 */
export interface AddressSuggestionItem {
  latitude: number
  longitude: number
  address: string
}

/**
 * Ответ с предложениями адресов
 */
export interface AddressSuggestionsResponse {
  success?: boolean
  message?: string
  suggestions: AddressSuggestionItem[]
}

/**
 * Ответ активации локации
 */
export interface ActivateLocationResponse {
  success: boolean
  message: string
  location: UserLocation
}

/**
 * Ответ удаления локации
 */
export interface DeleteLocationResponse {
  success: boolean
  message: string
  deleted_location_id: number
}
