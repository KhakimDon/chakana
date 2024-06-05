<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <LayoutAuthModal v-bind="{show}" @close="authStore.showAuth = false" />
  </div>
</template>
<script setup lang="ts">
import {useAuthStore} from "~/store/auth";

const authStore = useAuthStore()

const show = computed(() => authStore.showAuth)
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
