export const useSearchStore = defineStore('searchStore', () => {
  const products = reactive({
    list: [],
    loading: false,
  })

  const searchAutocompleteResults = reactive({
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

  return {
    products,
    searchProducts,
    searchAutocompleteResults,
    searchAutocomplete,
  }
})
