<template>
  <header
    v-if="!isSearchPage"
    :key="locale"
    class="w-full border-b border-white-100 py-4"
  >
    <div class="container flex-y-center justify-between gap-4">
      <div class="rounded-lg bg-white-100 p-1.5 shrink-0">
        <SvgoCommonEqual class="text-gray-100 text-[22px]" />
      </div>
      <CommonLogo />
      <NuxtLinkLocale
        to="/search"
        class="rounded-lg bg-white-100 p-1.5 shrink-0"
      >
        <SvgoCommonSearch class="text-gray-100 text-[22px]" />
      </NuxtLinkLocale>
    </div>
  </header>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const route = useRoute()
const isSearchPage = computed(() => route.path === `/${locale.value}/search`)
</script>
