<template>
  <div>
    <ClientOnly>
      <SmartAppBanner title="Xolodilnik" />
    </ClientOnly>
    <NuxtLoadingIndicator
      color="linear-gradient(183deg, #FF831B -51.95%, #F30 124.83%)"
    />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <WidgetDownload />
    <LayoutAuthModal v-model="authStore.showAuth" />
    <CommonLoading v-if="loading" />
  </div>
</template>
<script setup lang="ts">
import { load } from '@fingerprintjs/fingerprintjs'

import { useAuthStore } from '~/store/auth'

useSeoMeta({
  title: 'Chakana Онлайн',
  description:
    'Добро пожаловать в Магазин Chakana — ваш универсальный онлайн-магазин для всех продуктов, требующих хранения в Chakana! В нашем ассортименте вы найдете свежие и качественные молочные продукты, мясо, рыбу, овощи, фрукты, готовые блюда и многое другое. Мы обеспечиваем быструю и надежную доставку прямо к вашему порогу, чтобы вы могли наслаждаться вкусной и здоровой пищей каждый день. Откройте для себя удобство покупок с Магазин Chakana!',
  ogDescription:
    'Добро пожаловать в Магазин Chakana — ваш универсальный онлайн-магазин для всех продуктов, требующих хранения в Chakana! В нашем ассортименте вы найдете свежие и качественные молочные продукты, мясо, рыбу, овощи, фрукты, готовые блюда и многое другое. Мы обеспечиваем быструю и надежную доставку прямо к вашему порогу, чтобы вы могли наслаждаться вкусной и здоровой пищей каждый день. Откройте для себя удобство покупок с Магазин Chakana!',
  ogTitle: 'Chakana Онлайн',
  twitterTitle: 'Chakana Онлайн',
  twitterCard: 'summary',
  twitterSite: '@xolodilnik',
  ogImage: '/og-image.png',
  twitterImage: '/og-image.png',
})

const authStore = useAuthStore()

const loading = ref(true)

const tokens = computed(() => authStore.getTokens())

if (tokens.value?.access) {
  authStore.fetchUser()
}

const fingerprint = useCookie('fingerprint')

if (!fingerprint.value) {
  let fpPromise

  if (process.client) {
    fpPromise = load()
  }

  const fpd = ref()

  fpPromise
    ?.then((fp) => fp.get())
    .then((result) => (fpd.value = result.visitorId))
    .then(() => {
      fingerprint.value = fpd.value
    })
    .finally(() =>
      useApi()
        .$get('get/device')
        .then(() => {
          window.location.reload()
        })
    )
} else {
  loading.value = false
}

// JivoChat временно отключен
// onMounted(() => {
//   // Временное решение: используем JivoChat для поддержки клиентов
//   // TODO: В будущем заменить на собственную систему чата
//   if (useMobile('desktop')) {
//     useHead({
//       script: [
//         {
//           src: '//code.jivosite.com/widget/ri5Jw2oMql',
//           async: true,
//         },
//       ],
//     })
//   }
// })
</script>
