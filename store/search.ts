export const useSearchStore = defineStore('searchStore', () => {
  const autoCompleteItemClicked = ref(false)

  const products = reactive({
    list: [],
    loading: true,
    params: {
      page: 1,
      page_size: 15,
      total: 0,
      loading: false,
    },
  })

  function searchProducts(query: string, force = true) {
    return new Promise((resolve, reject) => {
      if (force) {
        products.params.page = 1
      } else {
        products.params.page += 1
        products.params.loading = true
      }
      useApi()
        .$get(`/search?query=${query}`, {
          params: {
            page_size: products.params.page_size,
            page: products.params.page,
          },
        })
        .then((res: any) => {
          if (force) {
            products.list = res?.items
          } else {
            products.list = products.list.concat(res?.items)
          }
          products.params.total = res?.count
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

  function saveSearch(search: string) {
    return new Promise((resolve, reject) => {
      useApi()
        .$post(`/search/save?query=${search}`)
        .then((res: any) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
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
  }
})
