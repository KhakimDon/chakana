import { useChakanaApi } from '~/composables/useChakanaApi'
import { useLocationsStore } from './locations'
import { useAuthStore } from './auth'

export const useSearchStore = defineStore('searchStore', () => {
  const autoCompleteItemClicked = ref(false)
  const chakanaApi = useChakanaApi()
  const locationsStore = useLocationsStore()
  const authStore = useAuthStore()

  const products = reactive({
    list: [],
    loading: true,
    params: {
      page: 1,
      page_size: 15,
      total: 0,
      loading: false,
    },
    next: null,
  })

  /**
   * Поиск магазинов (вместо продуктов)
   * GET /stores/nearby/ с параметром search
   * Использует Chakana API
   */
  function searchProducts(query: string, force = true) {
    return new Promise((resolve, reject) => {
      if (force) {
        products.params.page = 1
        products.loading = true
      } else {
        products.params.page += 1
        products.params.loading = true
      }

      // Параметры запроса для поиска магазинов
      const params: any = {
        search: query,
      }

      chakanaApi
        .$get('/stores/nearby/', { params })
        .then((res: any) => {
          // API возвращает массив магазинов
          const items = Array.isArray(res) ? res : res?.results || res?.items || []
          
          if (force) {
            products.list = items
          } else {
            products.list = products.list.concat(items)
          }
          
          products.params.total = items.length
          products.next = null // Магазины не поддерживают пагинацию через offset
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          products.loading = false
          products.params.loading = false
        })
    })
  }

  const searchAutocompleteResults = reactive({
    list: [],
    loading: false,
  })

  /**
   * Автодополнение поиска (по магазинам)
   * GET /stores/nearby/ с параметром search
   * Использует Chakana API
   */
  function searchAutocomplete(query: string) {
    return new Promise((resolve, reject) => {
      if (!query || query.length < 2) {
        searchAutocompleteResults.list = []
        resolve([])
        return
      }

      searchAutocompleteResults.loading = true

      const params: any = {
        search: query,
      }

      chakanaApi
        .$get('/stores/nearby/', { params })
        .then((res: any) => {
          // Извлекаем уникальные названия магазинов для автодополнения
          const items = Array.isArray(res) ? res : res?.results || res?.items || []
          const suggestions = items
            .map((item: any) => ({
              name: item?.seller_name || item?.store_name || '',
              id: item?.id,
            }))
            .filter((item: any) => item.name)
            .slice(0, 5) // Максимум 5 подсказок

          searchAutocompleteResults.list = suggestions
          resolve(suggestions)
        })
        .catch((error) => {
          console.error('[SearchStore] Error in autocomplete:', error)
          searchAutocompleteResults.list = []
          reject(error)
        })
        .finally(() => {
          searchAutocompleteResults.loading = false
        })
    })
  }

  const searchHistoryResults = reactive({
    list: [],
    loading: false,
  })

  /**
   * Получить историю поиска
   * GET /search-history/
   * Использует Chakana API (требует аутентификации)
   */
  function searchHistory() {
    return new Promise((resolve, reject) => {
      // Если пользователь не авторизован, возвращаем пустой список
      if (!authStore.isAuthorized) {
        searchHistoryResults.list = []
        resolve([])
        return
      }

      searchHistoryResults.loading = true
      chakanaApi
        .request('/search-history/', { method: 'GET' })
        .then((res: any) => {
          // API возвращает массив напрямую или объект с items
          const items = Array.isArray(res) ? res : res?.items || res?.results || []
          searchHistoryResults.list = items
          resolve(items)
        })
        .catch((error) => {
          console.error('[SearchStore] Error fetching search history:', error)
          searchHistoryResults.list = []
          reject(error)
        })
        .finally(() => {
          searchHistoryResults.loading = false
        })
    })
  }

  const deleteSearchHistoryLoading = ref(false)
  
  /**
   * Удалить элемент истории поиска
   * DELETE /search-history/{id}/
   * Использует Chakana API (требует аутентификации)
   */
  function deleteSearchHistory(id: number) {
    return new Promise((resolve, reject) => {
      if (!authStore.isAuthorized) {
        reject(new Error('User not authorized'))
        return
      }

      deleteSearchHistoryLoading.value = true
      chakanaApi
        .request(`/search-history/${id}/`, { method: 'DELETE' })
        .then((res: any) => {
          // Удаляем элемент из локального списка
          searchHistoryResults.list = searchHistoryResults.list.filter(
            (item: any) => item.id !== id
          )
          resolve(res)
        })
        .catch((error) => {
          console.error('[SearchStore] Error deleting search history:', error)
          reject(error)
        })
        .finally(() => {
          deleteSearchHistoryLoading.value = false
        })
    })
  }

  const clearSearchHistoryLoading = ref(false)
  
  /**
   * Очистить всю историю поиска
   * DELETE /search-history/clear/
   * Использует Chakana API (требует аутентификации)
   */
  function clearSearchHistory() {
    return new Promise((resolve, reject) => {
      if (!authStore.isAuthorized) {
        reject(new Error('User not authorized'))
        return
      }

      clearSearchHistoryLoading.value = true
      chakanaApi
        .request('/search-history/clear/', { method: 'DELETE' })
        .then((res: any) => {
          // Очищаем локальный список
          searchHistoryResults.list = []
          resolve(res)
        })
        .catch((error) => {
          console.error('[SearchStore] Error clearing search history:', error)
          reject(error)
        })
        .finally(() => {
          clearSearchHistoryLoading.value = false
        })
    })
  }

  const popularSearchResults = reactive({
    list: [],
    loading: false,
  })

  /**
   * Получить популярные поиски
   * GET /popular-searches/
   * Использует Chakana API
   */
  function searchPopular() {
    return new Promise((resolve, reject) => {
      popularSearchResults.loading = true
      chakanaApi
        .$get('/popular-searches/', { params: { limit: 15 } })
        .then((res: any) => {
          // API возвращает массив с объектами { id, query, ... }
          // Извлекаем только query для отображения
          const items = Array.isArray(res) ? res : res?.items || res?.results || []
          const queries = items.map((item: any) => item?.query || item).filter(Boolean)
          popularSearchResults.list = queries
          resolve(queries)
        })
        .catch((error) => {
          console.error('[SearchStore] Error fetching popular searches:', error)
          popularSearchResults.list = []
          reject(error)
        })
        .finally(() => {
          popularSearchResults.loading = false
        })
    })
  }

  const searchAddressList = reactive({
    list: [],
    loading: false,
  })
  function searchAddress(query: string) {
    return new Promise((resolve, reject) => {
      searchAddressList.loading = true
      useApi()
        .$get(`/get/address/suggestions?query=${query}`)
        .then((res: any) => {
          searchAddressList.list = res?.suggestions
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          searchAddressList.loading = false
        })
    })
  }

  /**
   * Сохранить поисковый запрос в историю
   * POST /search-history/ с body: { query: string }
   * Использует Chakana API (требует аутентификации)
   */
  function saveSearch(search: string) {
    return new Promise((resolve, reject) => {
      if (!search || !search.trim()) {
        resolve(null)
        return
      }

      // Если пользователь не авторизован, просто разрешаем промис без сохранения
      if (!authStore.isAuthorized) {
        resolve(null)
        return
      }

      chakanaApi
        .$post('/search-history/', { query: search.trim() })
        .then((res: any) => {
          // Обновляем локальную историю, добавляя новый элемент в начало
          if (res) {
            const newItem = typeof res === 'object' ? res : { id: Date.now(), query: search.trim() }
            // Проверяем, нет ли уже такого запроса
            const exists = searchHistoryResults.list.some(
              (item: any) => item.query === search.trim()
            )
            if (!exists) {
              searchHistoryResults.list = [newItem, ...searchHistoryResults.list].slice(0, 15)
            }
          }
          resolve(res)
        })
        .catch((error) => {
          console.error('[SearchStore] Error saving search:', error)
          // Не отклоняем промис, чтобы не блокировать поиск
          resolve(null)
        })
    })
  }

  /**
   * Поиск магазинов
   * GET /stores/nearby/ с параметром search
   * Использует Chakana API
   */
  const stores = reactive({
    list: [],
    loading: false,
  })

  function searchStores(query: string) {
    return new Promise((resolve, reject) => {
      stores.loading = true
      const params: any = {}
      
      if (query && query.trim()) {
        params.search = query.trim()
      }

      chakanaApi
        .$get('/stores/nearby/', { params })
        .then((res: any) => {
          // API возвращает массив магазинов
          const items = Array.isArray(res) ? res : res?.results || res?.items || []
          stores.list = items
          resolve(items)
        })
        .catch((error) => {
          console.error('[SearchStore] Error searching stores:', error)
          stores.list = []
          reject(error)
        })
        .finally(() => {
          stores.loading = false
        })
    })
  }

  return {
    products,
    searchProducts,
    searchAutocompleteResults,
    searchAutocomplete,
    searchHistoryResults,
    searchHistory,
    popularSearchResults,
    searchPopular,
    deleteSearchHistoryLoading,
    deleteSearchHistory,
    clearSearchHistoryLoading,
    clearSearchHistory,
    autoCompleteItemClicked,
    searchAddressList,
    searchAddress,
    saveSearch,
    stores,
    searchStores,
  }
})
