import { useCustomToast } from '@/composables/useCustomToast'

export interface IErrorResponse {
  _data?: {
    detail?: {
      detail?: string
      code?: string
    }
    Details?: string
    Code?: number
    LanguageId?: string
  }
  data?: {
    Details?: string
    Code?: number
    LanguageId?: string
  }
  response?: {
    _data?: {
      Details?: string
      Code?: number
      LanguageId?: string
    }
    data?: {
      Details?: string
      Code?: number
      LanguageId?: string
    }
  }
  status?: number
  statusCode?: number
}

export function useErrorHandling() {
  const { showToast } = useCustomToast()

  function handleError(res: IErrorResponse | any) {
    // Check if it's actually a success status - don't show error for 200/201/204
    const status = res?.status || res?.statusCode || res?.response?.status
    
    // Also check if it's an Error object that might have been created from a success response
    // If res is an Error object without status, we can't determine if it's success, so we'll show error
    // But if it has status 200/201/204, don't show error
    if (status === 200 || status === 201 || status === 204) {
      // This is a success response, don't show error
      console.warn('handleError called with success status:', status, res)
      return { error: null }
    }
    
    // Проверяем различные форматы ответа от API
    // Формат 1: { Details: "Parol noto'g'ri.", Code: -10033, LanguageId: "uz" }
    const details = 
      res?.data?.Details || 
      res?.response?.data?.Details || 
      res?.response?._data?.Details || 
      res?._data?.Details ||
      res?.Details
    
    // Формат 2: Старый формат { detail: { code: "...", detail: "..." } }
    const oldFormatMessage = 
      res?._data?.detail?.code || 
      res?._data?.detail?.detail ||
      res?.data?.detail?.code ||
      res?.data?.detail?.detail

    // Приоритет: Details > oldFormatMessage > message > общая ошибка
    const errorMessage = details || oldFormatMessage || res?.message || 'Произошла ошибка'

    if (res?.status === 500 || res?.statusCode === 500) {
      showToast('Server error', 'error')
    } else {
      showToast(errorMessage, 'error')
    }

    return { error: errorMessage }
  }

  return { handleError }
}
