export const useListStore = defineStore('listStore', () => {
  const lists = reactive({
    list: [],
    loading: true,
  })

  function getUserProductsList(params?: any) {
    return new Promise((resolve, reject) => {
      lists.loading = true
      useApi()
        .$get(`/get-user-products-list`, {
          params: {
            ...params,
          },
        })
        .then((res: any) => {
          lists.list = res?.items
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          lists.loading = false
        })
    })
  }

  return {
    lists,
    getUserProductsList,
  }
})
