<template>
  <main>
    <LayoutWrapper v-if="useMobile('desktop')" has-fixed>
      <template #left>
        <div class="w-[202px]">
          <MainSidebar
            :loading="categoriesLoading"
            v-bind="{ categories, single }"
          />
        </div>
      </template>
      <Transition name="fade" mode="out-in">
        <div :key="$route.name">
          <NuxtPage />
        </div>
      </Transition>
      <template #right>
        <div
          class="fixed w-[313px] top-[86px] h-[calc(100vh-100px)] overflow-y-auto pb-16"
        >
          <ClientOnly>
            <MainMapSidebar class="md:mr-2" @change-coords="changeCoords" />
          </ClientOnly>
          <Transition name="fade" mode="out-in" class="space-y-5 mt-5 md:mr-2">
            <CartEmpty v-if="cartProducts.length === 0" />
            <CartFilled v-else />
          </Transition>
        </div>
      </template>
      <OrderInfoEditAddress v-model="show" @save="saveAddress" />
    </LayoutWrapper>
    <LayoutMobile v-else>
      <Transition name="fade" mode="out-in">
        <div :key="$route.name">
          <NuxtPage />
        </div>
      </Transition>
    </LayoutMobile>
  </main>
</template>
<script setup lang="ts">
import { getAuth, signInAnonymously } from 'firebase/auth'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

import { useCartStore } from '~/store/cart.js'
import { useCategoriesStore } from '~/store/categories'

const route = useRoute()

const categoriesStore = useCategoriesStore()
const show = ref(false)

const categoriesLoading = computed(() => categoriesStore.categories.loading)
const categories = computed(() => categoriesStore.categories.list)
const single = computed(() => categoriesStore.single)

categoriesStore.fetchCategories()

const cartStore = useCartStore()

const cartProducts = computed(() => cartStore.products)

cartStore.getCartProducts()

watch(
  () => route.name,
  () => {
    categoriesStore.single = null
  }
)

const changeCoords = () => {
  show.value = true
}

function saveAddress(data: any) {}

if (process.client) {
  const messaging = getMessaging()

  const activate = async () => {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    })

    if (token) {
      console.log('FCM token: ', token)

      onMessage(messaging, (payload) => {
        console.log('Message from firebase: ', payload)
        return self?.registration?.showNotification(
          payload.notification?.title,
          {
            body: payload.notification?.body,
          }
        )
      })
    } else {
      console.log(
        'No Instance ID token available. Request permission to generate one.'
      )
    }
  }

  const authFirebase = async () => {
    try {
      const { app } = await import('~/plugins/firebase.js')
      const auth = getAuth(app)
      await signInAnonymously(auth)
      activate()
      console.log('authFirebase successful')
    } catch (error) {
      console.error('authFirebase error:', error)
      // Handle the error appropriately
    }
  }

  onMessage(messaging, (payload) => {
    console.log('client onMessage', payload)
  })

  authFirebase()
}
</script>
