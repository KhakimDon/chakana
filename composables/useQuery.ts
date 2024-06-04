import { useRoute } from 'vue-router'

import type { ICustomObject } from '~/types'

export const useQuery = () => {
  const route = useRoute()
  const router = useRouter()

  const getQuery = (key: string, type: 'number' | 'string' = 'string') => {
    const routeQuery = route.query[key]

    if (!routeQuery) {
      return undefined
    }

    return type === 'string' ? String(routeQuery) : Number(routeQuery)
  }

  const getParam = (key: string, type: 'number' | 'string' = 'string') => {
    const routeParam = route.params[key]

    if (!routeParam) {
      return undefined
    }

    return type === 'string' ? String(routeParam) : Number(routeParam)
  }

  const updateQuery = async (key: string, value: string | undefined) => {
    const router = useRouter()
    const routeQuery = { ...router.currentRoute.value.query }

    if (!value) {
      delete routeQuery[key]
    } else {
      routeQuery[key] = value
    }

    return await router.replace({ query: routeQuery })
  }

  const updateQueryParams = async (newQueryParams: ICustomObject) => {
    const updatedQueryParams = { ...route.query, ...newQueryParams }

    return await router.replace({
      query: updatedQueryParams,
    })
  }

  return { getQuery, getParam, updateQuery, updateQueryParams }
}
