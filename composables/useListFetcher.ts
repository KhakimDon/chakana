import { ICustomObject, IDefaultResponse } from '~/types'

export const useListFetcher = <T>(
  url: string,
  paginationLimit?: number,
  itself?: boolean,
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
    limit: paginationLimit ?? 9,
    offset: (currentPage.value - 1) * (paginationLimit ?? 9),
    search: route.query.search ?? undefined,
    ...customParams,
  })

  const paginationData = reactive({
    count: 0,
    next: '',
  })

  const fetchApplications = async (customParams?: ICustomObject) => {
    const data = await useApi().$get<IDefaultResponse<T>>(url, {
      params,
      ...customParams,
    })

    if (params.offset > 0) {
      if (itself) {
        list.value = [...(list.value ?? []), ...data.items]
      } else {
        list.value = [...(list.value ?? []), ...data]
      }
    } else {
      list.value = data
    }

    paginationData.count = data.count

    loading.list = false
    loading.button = false
  }

  const loadMore = () => {
    loading.button = true
    params.offset += params.limit
  }

  const resetList = () => {
    params.offset = 0
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
