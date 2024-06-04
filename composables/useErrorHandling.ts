import { useI18n } from 'vue-i18n'

import { useCustomToast } from '@/composables/useCustomToast'

export function useErrorHandling() {
  const { showToast } = useCustomToast()
  const { t } = useI18n()

  function handleError(res: any) {
    if (res?.status === 404) {
      showError({ statusCode: 404 })
    }
    if (res?.status === 403) {
      showToast('error', res?._data?.detail)
    }
    if (res?.status === 500) {
      showToast('error', 'Server error')
    }
    showToast('error', t(res?._data?.errors?.[0]?.message))

    return { error: res?._data?.errors?.[0]?.message }
  }

  return { handleError }
}
