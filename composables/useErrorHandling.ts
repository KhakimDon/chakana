import { useCustomToast } from '@/composables/useCustomToast'

export interface IErrorResponse {
  _data: {
    detail: {
      detail: string
      code: string
    }
  }
  status: number
}

export function useErrorHandling() {
  const { showToast } = useCustomToast()

  function handleError(res: IErrorResponse) {
    // if (res?.status === 404) {
    //   showError({ statusCode: 404 })
    // } else
    if (res?.status === 500) {
      showToast('Server error', 'error')
    } else {
      showToast(res._data?.detail?.code, 'error')
    }

    return { error: res._data?.detail?.code }
  }

  return { handleError }
}
1
