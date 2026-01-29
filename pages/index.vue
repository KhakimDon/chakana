<template>
  <main>
    <LayoutWrapper 
      v-if="useMobile('desktop')" 
      has-fixed 
      :left-sidebar-cols="isStorePage ? 3 : 2"
      :hide-left-sidebar="isSavedPage"
    >
      <template #left>
        <!-- Hide left sidebar for saved page -->
        <div v-if="!isSavedPage" :class="isStorePage ? 'w-[280px]' : 'w-[202px]'">
          <!-- Store sidebar when on store page -->
          <MainSidebarStoreSidebar v-if="isStorePage" />
          <!-- Main sidebar for other pages -->
          <MainSidebar
            v-else
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
        <div class="sticky bottom-0 w-[313px] overflow-y-auto pb-16">
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
// import { getAuth, signInAnonymously } from 'firebase/auth'
// import { getMessaging, getToken, onMessage } from 'firebase/messaging'

import { useCartStore } from '~/store/cart.js'
import { useCategoriesStore } from '~/store/categories'
import { useStorePageStore } from '~/store/storePage'

const route = useRoute()
const storePageStore = useStorePageStore()

// Check if we're on a store page
const isStorePage = computed(() => storePageStore.isStorePage)

// Check if we're on saved page (hide left sidebar)
const isSavedPage = computed(() => route.path.includes('/saved'))

const categoriesStore = useCategoriesStore()
const show = ref(false)

const categoriesLoading = computed(() => categoriesStore.categories.loading)
const categories = computed(() => categoriesStore.categories.list)
const single = computed(() => categoriesStore.single)

categoriesStore.fetchCategories()

const cartStore = useCartStore()

const cartProducts = computed(() => cartStore.products)

onMounted(() => {
  cartStore.getCartProducts()
})

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

// if (process.client) {
//   const messaging = getMessaging()
//
//   const activate = async () => {
//     const token = await getToken(messaging, {
//       vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
//     })
//
//     if (token) {
//       onMessage(messaging, (payload) => {
//         console.log('Message from firebase: ', payload)
//         return self?.registration?.showNotification(
//           payload.notification?.title,
//           {
//             body: payload.notification?.body,
//           }
//         )
//       })
//     } else {
//       console.log(
//         'No Instance ID token available. Request permission to generate one.'
//       )
//     }
//   }
//
//   const authFirebase = async () => {
//     try {
//       const { app } = await import('~/plugins/firebase.js')
//       const auth = getAuth(app)
//       await signInAnonymously(auth)
//       activate()
//       console.log('authFirebase successful')
//     } catch (error) {
//       console.error('authFirebase error:', error)
//     }
//   }
//
//   onMessage(messaging, (payload) => {
//     console.log('client onMessage', payload)
//   })
//
//   authFirebase()
// }
</script>
