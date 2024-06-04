export const useSearchStore = defineStore('searchStore', () => {
  const products = reactive({
    list: [],
    loading: false,
  })

  function searchProducts(query: string) {
    return new Promise((resolve, reject) => {
      products.loading = true
      useApi()
        .$get(`/search?query=${query}`)
        .then((res: any) => {
          products.list = res?.items
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          products.loading = false
        })
    })
  }

  const searchAutocompleteResults = reactive({
    list: [],
    loading: false,
  })

  function searchAutocomplete(query: string) {
    return new Promise((resolve, reject) => {
      searchAutocompleteResults.loading = true
      useApi()
        .$get(`/search/autocomplete?query=${query}`)
        .then((res: any) => {
          searchAutocompleteResults.list = res
          resolve(res)
        })
        .catch((error) => {
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

  function searchHistory() {
    return new Promise((resolve, reject) => {
      searchHistoryResults.loading = true
      useApi()
        .$get(`/search-history`)
        .then((res: any) => {
          searchHistoryResults.list = res?.items
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          searchHistoryResults.loading = false
        })
    })
  }

  const deleteSearchHistoryLoading = ref(false)
  function deleteSearchHistory(id: number) {
    return new Promise((resolve, reject) => {
      deleteSearchHistoryLoading.value = true
      useApi()
        .$delete(`/search-history/delete`, {
          body: [id],
        })
        .then((res: any) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          deleteSearchHistoryLoading.value = false
        })
    })
  }

  const clearSearchHistoryLoading = ref(false)
  function clearSearchHistory() {
    return new Promise((resolve, reject) => {
      clearSearchHistoryLoading.value = true
      useApi()
        .$delete(`/search-history/clear`)
        .then((res: any) => {
          resolve(res)
        })
        .catch((error) => {
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

  function searchPopular() {
    return new Promise((resolve, reject) => {
      popularSearchResults.loading = true
      useApi()
        .$get(`/popular-search`)
        .then((res: any) => {
          popularSearchResults.list = res?.items
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          popularSearchResults.loading = false
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
  }
})
