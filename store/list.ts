export const useListStore = defineStore('listStore', () => {
  const selectedList = ref<any>(null)
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

  function deleteList(id: string) {
    return new Promise((resolve, reject) => {
      useApi()
        .$delete(`/delete-user-products-list/${id}`)
        .then((res: any) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  return {
    selectedList,
    lists,
    getUserProductsList,
    deleteList,
  }
})
