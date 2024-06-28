<template>
  <div>
    <div class="flex-center w-full">
      <div class="w-[207px]">
        <div class="p-5 rounded-2xl border-2 border-gray-200">
          <LayoutAuthQrGenerator :loading="loading" :text="qrCode" />
        </div>

        <div class="h-1 bg-white-100 rounded-full mt-5">
          <div class="w-0 bg-orange rounded-full h-1 fill-animation" />
        </div>
      </div>
    </div>
    <div class="text-center mt-6">
      <p class="text-xl leading-130 font-bold text-dark">{{ $t('scan_qr') }}</p>
      <p class="text-xs leading-130 text-gray-100 mt-1">
        {{ $t('scan_qr_text') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CONFIG } from '~/config/index.js'
import { useAuthStore } from '~/store/auth.js'
import { useCartStore } from '~/store/cart.js'

const authStore = useAuthStore()
const { t } = useI18n()
const { showToast } = useCustomToast()
const { handleError } = useErrorHandling()

const connection = ref()
const loading = ref(true)
const qrCode = ref('')
const channel = ref('')

const cartStore = useCartStore()

const useReviewSocket = () => {
  try {
    connection.value = new WebSocket(`${CONFIG.WS_URL}`)

    connection.value.onopen = () => {
      const msg = {
        event_name: 'subscribe',
        data: {
          channels: [channel.value],
          last: 0,
        },
      }
      connection.value.send(JSON.stringify(msg))
    }

    connection.value.onmessage = (event: any) => {
      const data = JSON.parse(event.data)
      const payload = JSON.parse(data?.[0]?.message?.payload)
      loading.value = true
      authStore.setTokens(payload)
      setTimeout(() => {
        authStore
          .fetchUser()
          .then(() => {
            showToast(t('login_success'), 'success')
            cartStore.getCartProducts()
          })
          .finally(() => {
            loading.value = false
          })
        authStore.showAuth = false
        useCookie('auth-session').value = null
      }, 300)
    }
  } catch (error) {
    handleError(error)
  }
}

onBeforeUnmount(() => {
  if (connection.value && connection.value.readyState === WebSocket.OPEN) {
    connection.value.close()
  }
})

onMounted(() => {
  getSession()
  setInterval(() => {
    if (connection.value && connection.value.readyState === WebSocket.OPEN) {
      connection.value.close()
    }
    getSession()
  }, 60000)
})

function getSession() {
  loading.value = true
  useApi()
    .$get('/get/qr-login-value')
    .then((res: any) => {
      channel.value = res.channel_name
      qrCode.value = res.qr_login_value
      useReviewSocket()
    })
    .catch((err) => {
      console.log('err', err)
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<style scoped>
.fill-animation {
  animation: fill 60s linear forwards infinite;
}

@keyframes fill {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}
</style>
