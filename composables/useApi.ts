// @ts-ignore
import { load } from '@fingerprintjs/fingerprintjs'
import { isJwtExpired } from 'jwt-check-expiration'
import { NitroFetchRequest } from 'nitropack'
import { FetchOptions } from 'ofetch'
import { useI18n } from 'vue-i18n'

import { useAuthStore } from '~/store/auth'

export const useApi = (apiUrl?: string) => {
  const authStore = useAuthStore()
  const baseURL = apiUrl || (import.meta.env.VITE_API_BASE_URL as string)
  const loading = ref(false)
  const fingerprint = useCookie('fingerprint')
  async function $service<T = unknown>(
    endpoint: NitroFetchRequest,
    options?: FetchOptions
  ): Promise<T> {
    const { locale } = useI18n()
    const headers = {
      ...options?.headers,
      'Accept-Language': locale.value || 'ru',
      'Device-Id': fingerprint.value,
    }
    const tokens = computed(() => authStore.getTokens())
    if (tokens.value?.refresh) {
      if (!tokens.value?.access || isJwtExpired(tokens.value?.access)) {
        const dFetch = $fetch.create({
          method: 'POST',
          baseURL,
          headers,
          body: {
            refresh_token: tokens.value.refresh,
          },
        })
        try {
          const _res = await dFetch('refresh/token')
          authStore.setTokens({
            access_token: (_res as Pick<any, 'accessToken'>).access_token,
            refresh_token: tokens.value.refresh,
          })
        } catch (err) {
          authStore.logout()
          throw new Error(err)
        }
        // await authStore.refreshToken()
      }
    }

    if (tokens.value?.access) {
      Object.assign(headers, {
        Authorization: 'Bearer ' + tokens.value.access,
      })
    }
    return $fetch.create({
      ...options,
      baseURL,
      headers,
    })(endpoint)
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
    try {
      return await $service<T>(endpoint, { ...options, method: 'POST' })
    } catch (err: any) {
      throw err.response
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
    try {
      return await $service<T>(endpoint, { ...options, method: 'DELETE' })
    } catch (err: any) {
      throw err.response
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
