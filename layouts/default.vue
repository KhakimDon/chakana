<template>
  <div class="max-md:pb-16">
    <LayoutHeader v-if="useMobile('desktop')" class="top-0 bg-white z-10" />
    <LayoutHeaderMobile v-else class="sticky top-0 bg-white z-10" />
    <div
      class="md:min-h-[calc(100vh-69px)] min-h-[calc(100vh-68px-64px)] py-4 pb-10 md:pb-4 md:mt-[70px]"
    >
      <slot />
    </div>
    <LayoutMobileBottomBar v-if="!useMobile('desktop')" />
  </div>
</template>
<script setup lang="ts">
import { getAuth, signInAnonymously } from 'firebase/auth'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

const messaging = getMessaging()

onUpdated(() => {
  console.clear()
})

onMounted(() => {
  console.clear()
})

console.clear()

const activate = async () => {
  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
  })

  if (token) {
    onMessage(messaging, (payload) => {
      console.log('Message from firebase: ', payload)
      return self?.registration?.showNotification(payload.notification?.title, {
        body: payload.notification?.body,
      })
    })
  } else {
    console.log(
      'No Instance ID token available. Request permission to generate one.'
    )
  }
}

activate()

const authFirebase = async () => {
  console.log('authFirebase')
  await signInAnonymously(getAuth())
}

onMounted(() => {
  const messaging = getMessaging()

  onMessage(messaging, (payload) => {
    console.log('client onMessage', payload)
  })
})
</script>
