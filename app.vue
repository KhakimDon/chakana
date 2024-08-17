<template>
  <div>
    xolodilnik
    <!--    <NuxtLoadingIndicator-->
    <!--      color="linear-gradient(183deg, #FF831B -51.95%, #F30 124.83%)"-->
    <!--    />-->
    <!--    <NuxtLayout>-->
    <!--      <NuxtPage />-->
    <!--    </NuxtLayout>-->
    <!--    <LayoutAuthModal v-model="authStore.showAuth" />-->
    <!--    <CommonLoading v-if="loading" />-->
  </div>
</template>
<script setup lang="ts">
import { load } from '@fingerprintjs/fingerprintjs'

import { useAuthStore } from '~/store/auth'

useSeoMeta({
  title: 'Холодильник Онлайн',
  description:
    'Добро пожаловать в Магазин Холодильник — ваш универсальный онлайн-магазин для всех продуктов, требующих хранения в холодильнике! В нашем ассортименте вы найдете свежие и качественные молочные продукты, мясо, рыбу, овощи, фрукты, готовые блюда и многое другое. Мы обеспечиваем быструю и надежную доставку прямо к вашему порогу, чтобы вы могли наслаждаться вкусной и здоровой пищей каждый день. Откройте для себя удобство покупок с Магазин Холодильник!',
  ogTitle: 'Холодильник Онлайн',
  twitterTitle: 'Холодильник Онлайн',
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

  const fp = ref()

  fpPromise
    .then((fp) => fp.get())
    .then((result) => (fp.value = result.visitorId))
    .then(() => {
      fingerprint.value = fp.value
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

useSeoMeta({
  title: 'Холодильник Онлайн',
  description:
    'Добро пожаловать в Магазин Холодильник — ваш универсальный онлайн-магазин для всех продуктов, требующих хранения в холодильнике! В нашем ассортименте вы найдете свежие и качественные молочные продукты, мясо, рыбу, овощи, фрукты, готовые блюда и многое другое. Мы обеспечиваем быструю и надежную доставку прямо к вашему порогу, чтобы вы могли наслаждаться вкусной и здоровой пищей каждый день. Откройте для себя удобство покупок с Магазин Холодильник!',
  ogTitle: `Холодильник Онлайн`,
  ogDescription: `Добро пожаловать в Магазин Холодильник — ваш универсальный онлайн-магазин для всех продуктов, требующих хранения в холодильнике! В нашем ассортименте вы найдете свежие и качественные молочные продукты, мясо, рыбу, овощи, фрукты, готовые блюда и многое другое. Мы обеспечиваем быструю и надежную доставку прямо к вашему порогу, чтобы вы могли наслаждаться вкусной и здоровой пищей каждый день. Откройте для себя удобство покупок с Магазин Холодильник!`,
  twitterTitle: `Холодильник Онлайн`,
  twitterCard: 'summary',
  twitterSite: '@xolodilnik',
  ogImage: '/og.png',
  twitterImage: '/og.png',
})

onMounted(() => {
  if (useMobile('desktop')) {
    useHead({
      script: [
        {
          src: '//code.jivosite.com/widget/ri5Jw2oMql',
          async: true,
        },
      ],
    })
  }
})
</script>
