import { ICustomObject, IDefaultResponse } from '~/types'

export const useListFetcher = <T>(
  url: string,
  paginationLimit?: number,
  itself?: boolean,
  search: string,
  customParams?: ICustomObject
) => {
  const route = useRoute()

  const list = ref<T[]>([])

  const loading = reactive({
    list: true,
    button: false,
  })

  const currentPage = ref(Number(route.query?.page ?? 1))

  const params = reactive({
    page_size: paginationLimit ?? 9,
    page: 1,
    query: search ?? undefined,
    ...customParams,
  })

  const paginationData = reactive({
    count: 0,
    next: '',
  })

  const fetchApplications = async (customParams?: ICustomObject) => {
    const data = await useApi()
      .$get<IDefaultResponse<T>>(url, {
        params,
        ...customParams,
      })
      .finally(() => {
        loading.list = false
        loading.button = false
      })

    if (search) {
      if (params.page > 1) {
        list.value = [...(list.value ?? []), ...data.suggestions]
      } else {
        list.value = data.suggestions
      }
    }
    if (itself && !search) {
      if (params.page > 1) {
        list.value = [...(list.value ?? []), ...data.items]
      } else {
        list.value = data.items
      }
    } else if (!itself && !search) {
      if (params.page > 1) {
        list.value = [...(list.value ?? []), ...data]
      } else {
        list.value = data
      }
    }

    paginationData.count = data?.count
    paginationData.next = data?.next

    loading.list = false
    loading.button = false
  }

  const loadMore = () => {
    loading.button = true
    params.page++
  }

  const resetList = () => {
    params.page = 1
    loading.list = true
    fetchApplications()
  }

  watch(
    () => params,
    () => {
      fetchApplications()
    },
    { deep: true, immediate: true }
  )

  return {
    list,
    loading,
    paginationData,
    params,
    currentPage,
    loadMore,
    resetList,
    fetchApplications,
  }
}
