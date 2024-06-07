<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <LayoutAuthModal v-model="authStore.showAuth" />
  </div>
</template>
<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()

useSeoMeta({
  title: 'Xolodilnik',
  description: 'Xolodilnik - Xolodilnik',
  ogTitle: `Xolodilnik`,
  twitterTitle: `Xolodilnik`,
  twitterCard: 'summary',
  twitterSite: '@xolodilnik',
  ogImage: '/og.png',
  twitterImage: '/og.png',
})
</script>
