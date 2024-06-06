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

  const searchByNoteProducts = reactive({
    list: [],
    loading: true,
  })

  function getUserProductsByNotes(notes?: string[]) {
    return new Promise((resolve, reject) => {
      searchByNoteProducts.loading = true
      useApi()
        .$post(`/search/product/by-note`, {
          body: notes,
        })
        .then((res: any) => {
          searchByNoteProducts.list = res
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          searchByNoteProducts.loading = false
        })
    })
  }

  const searchByNoteAndOrderProducts = reactive({
    list: [],
    loading: true,
  })

  function getUserProductsByNotesWithOrder(notes?: string[]) {
    return new Promise((resolve, reject) => {
      searchByNoteAndOrderProducts.loading = true
      useApi()
        .$post(`/search/product/by-note-and-order`, {
          body: notes,
        })
        .then((res: any) => {
          searchByNoteAndOrderProducts.list = res
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          searchByNoteAndOrderProducts.loading = false
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
    searchByNoteProducts,
    getUserProductsByNotes,
    searchByNoteAndOrderProducts,
    getUserProductsByNotesWithOrder,
  }
})
