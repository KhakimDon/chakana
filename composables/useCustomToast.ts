import * as pkg from 'vue-toastification'

import UIToast from '~/components/Common/Toast.vue'

const { useToast } = pkg

export const useCustomToast = () => {
  const toast = useToast()

  const showToast = (
    title: string,
    type: 'success' | 'error' | 'warning' | 'info'
  ) => {
    toast({
      component: UIToast,
      props: {
        title,
        type,
      },
    })
  }

  return { showToast }
}
