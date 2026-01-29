// @ts-ignore
import { load } from '@fingerprintjs/fingerprintjs'
import { isJwtExpired } from 'jwt-check-expiration'
import { NitroFetchRequest } from 'nitropack'
import { FetchOptions } from 'ofetch'

import { useAuthStore } from '~/store/auth'

export const useApi = (apiUrl?: string) => {
  const { $i18n } = useNuxtApp()

  const locale = $i18n?.locale ?? 'ru'

  const authStore = useAuthStore()
  const baseURL = apiUrl || (import.meta.env.VITE_API_BASE_URL as string)
  const loading = ref(false)
  const fingerprint = useCookie('fingerprint')
  async function $service<T = unknown>(
    endpoint: NitroFetchRequest,
    options?: FetchOptions
  ): Promise<T> {
    const headers = {
      ...options?.headers,
      'Accept-Language': locale.value || 'ru',
      'Device-Id': fingerprint.value,
      'Cache-Control': 'no-store',
    }
    // Получаем токены напрямую из store (реактивные свойства)
    // Используем getTokens() для синхронизации с cookies
    const tokens = authStore.getTokens()
    
    // Всегда добавляем Authorization заголовок, если есть access token
    if (tokens?.access) {
      // Проверяем, не истек ли токен
      if (isJwtExpired(tokens.access)) {
        // Токен истек, пытаемся обновить
        if (tokens?.refresh) {
          try {
            // Используем новый метод refresh-token из identity-api
            await authStore.refreshTokens()
            // После обновления токенов, получаем их снова
            const updatedTokens = authStore.getTokens()
            if (updatedTokens?.access) {
              Object.assign(headers, {
                Authorization: 'Bearer ' + updatedTokens.access,
              })
            }
          } catch (err) {
            console.error('[useApi] Failed to refresh token:', err)
            authStore.logOut()
            throw new Error(err as string)
          }
        } else {
          // Нет refresh token, используем истекший access token (API может его принять)
          Object.assign(headers, {
            Authorization: 'Bearer ' + tokens.access,
          })
        }
      } else {
        // Токен валиден, используем его
        Object.assign(headers, {
          Authorization: 'Bearer ' + tokens.access,
        })
      }
    } else if (tokens?.refresh) {
      // Есть только refresh token, пытаемся обновить
      try {
        await authStore.refreshTokens()
        const updatedTokens = authStore.getTokens()
        if (updatedTokens?.access) {
          Object.assign(headers, {
            Authorization: 'Bearer ' + updatedTokens.access,
          })
        }
      } catch (err) {
        console.error('[useApi] Failed to refresh token:', err)
        authStore.logOut()
        throw new Error(err as string)
      }
    }
    
    // Use onResponse and onResponseError to handle 204 and other success statuses
    let responseStatus: number | null = null
    let responseData: any = null
    let isSuccessResponse = false
    
    try {
      const result = await $fetch<T>(endpoint, {
        ...options,
        baseURL,
        headers,
        onResponse({ response }) {
          responseStatus = response.status
          responseData = response._data
          // Mark as success if status is 200, 201, or 204
          if (response.status === 200 || response.status === 201 || response.status === 204) {
            isSuccessResponse = true
          }
        },
        onResponseError({ response }) {
          // Even in onResponseError, check if it's actually a success status
          responseStatus = response?.status || null
          responseData = response?._data || null
          if (response?.status === 200 || response?.status === 201 || response?.status === 204) {
            isSuccessResponse = true
          }
        },
      })
      
      // If status is success (200, 201, 204), return result
      if (isSuccessResponse || (responseStatus && (responseStatus === 200 || responseStatus === 201 || responseStatus === 204))) {
        return result || (responseData as T) || ({} as T)
      }
      
      return result
    } catch (err: any) {
      // Check if it's actually a success status (204 No Content)
      const status = responseStatus || err?.response?.status || err?.status || err?.statusCode
      
      if (isSuccessResponse || status === 204 || status === 200 || status === 201) {
        // Success response, return empty object or response data
        return (responseData || err?.response?._data || err?.response?.data || {}) as T
      }
      
      // Real error, throw it
      throw err
    }
  }
  async function $get<T = never>(
    endpoint: NitroFetchRequest,
    options?: FetchOptions
  ): Promise<T> {
    try {
      loading.value = true
      return await $service<T>(endpoint, options)
    } catch (err: any) {
      throw err.response
    } finally {
      loading.value = false
    }
  }
  async function $post<T = never>(
    endpoint: NitroFetchRequest,
    options?: Omit<FetchOptions, 'method'>
  ): Promise<T> {
    loading.value = true
    let responseStatus: number | null = null
    let responseData: any = null
    
    try {
      const result = await $fetch<T>(endpoint, {
        ...options,
        method: 'POST',
        baseURL,
        headers: {
          ...options?.headers,
          'Accept-Language': locale.value || 'ru',
          'Device-Id': fingerprint.value,
          'Cache-Control': 'no-store',
          ...(authStore.getTokens()?.access ? {
            'Authorization': 'Bearer ' + authStore.getTokens().access
          } : {}),
        },
        onResponse({ response }) {
          responseStatus = response.status
          responseData = response._data
          // If status is success, don't throw error
          if (response.status === 200 || response.status === 201 || response.status === 204) {
            // Success - don't throw
          }
        },
        onResponseError({ response }) {
          responseStatus = response?.status || null
          responseData = response?._data || null
          // Even if onResponseError is called, check if it's actually success
          if (response?.status === 200 || response?.status === 201 || response?.status === 204) {
            // It's success, don't treat as error
            responseStatus = response.status
          }
        },
        // Ignore errors for success statuses - this is critical
        ignoreResponseError: (response) => {
          const status = response?.status
          const isSuccess = status === 200 || status === 201 || status === 204
          if (isSuccess) {
            responseStatus = status
            responseData = response?._data
          }
          return isSuccess
        },
      })
      
      // If status is success, return result or data
      if (responseStatus === 200 || responseStatus === 201 || responseStatus === 204) {
        return result || (responseData as T) || ({} as T)
      }
      
      return result
    } catch (err: any) {
      // Check status from error or from onResponse
      const status = responseStatus || err?.response?.status || err?.status || err?.statusCode
      
      // 200/201/204 is success for POST - NEVER throw error for this
      if (status === 200 || status === 201 || status === 204) {
        // Success response, return the response data or empty object
        return (responseData || err?.response?.data || err?.response?._data || err?.data || {}) as T
      }
      
      // Real error, throw it
      throw err.response || err
    } finally {
      loading.value = false
    }
  }
  async function $put<T = never>(
    endpoint: NitroFetchRequest,
    options?: Omit<FetchOptions, 'method'>
  ): Promise<T> {
    try {
      return await $service<T>(endpoint, { ...options, method: 'PUT' })
    } catch (err: any) {
      throw err.response
    } finally {
      loading.value = false
    }
  }
  async function $patch<T = never>(
    endpoint: NitroFetchRequest,
    options?: Omit<FetchOptions, 'method'>
  ): Promise<T> {
    try {
      return await $service<T>(endpoint, { ...options, method: 'PATCH' })
    } catch (err: any) {
      throw err.response
    } finally {
      loading.value = false
    }
  }
  async function $delete<T = never>(
    endpoint: NitroFetchRequest,
    options?: Omit<FetchOptions, 'method'>
  ): Promise<T> {
    loading.value = true
    let responseStatus: number | null = null
    let caughtError: any = null
    
    try {
      const result = await $fetch<T>(endpoint, {
        ...options,
        method: 'DELETE',
        baseURL,
        headers: {
          ...options?.headers,
          'Accept-Language': locale.value || 'ru',
          'Device-Id': fingerprint.value,
          'Cache-Control': 'no-store',
          ...(authStore.getTokens()?.access ? {
            'Authorization': 'Bearer ' + authStore.getTokens().access
          } : {}),
        },
        onResponse({ response }) {
          responseStatus = response.status
          // If status is 204 or 200, don't throw error
          if (response.status === 204 || response.status === 200) {
            // Success - don't throw
          }
        },
        onResponseError({ response }) {
          responseStatus = response?.status || null
          // Even if onResponseError is called, check if it's actually success
          if (response?.status === 204 || response?.status === 200) {
            // It's success, don't treat as error
            responseStatus = response.status
          }
        },
        // Ignore errors for success statuses - this is critical
        ignoreResponseError: (response) => {
          const status = response?.status
          const isSuccess = status === 200 || status === 204
          if (isSuccess) {
            responseStatus = status
          }
          return isSuccess
        },
      })
      
      // If status is 204 or 200, return empty object (success)
      if (responseStatus === 204 || responseStatus === 200) {
        return {} as T
      }
      
      return result || ({} as T)
    } catch (err: any) {
      caughtError = err
      // Check status from error or from onResponse
      const status = responseStatus || err?.response?.status || err?.status || err?.statusCode
      
      // 204 No Content is success for DELETE - NEVER throw error for this
      if (status === 204 || status === 200) {
        return {} as T
      }
      
      // Real error, throw it
      throw err.response || err
    } finally {
      loading.value = false
    }
  }
  return {
    loading,
    baseURL,
    $get,
    $post,
    $put,
    $patch,
    $delete,
  }
}
