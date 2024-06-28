<template>
  <header
    v-if="!isSearchPage"
    :key="locale"
    class="w-full border-b border-white-100 py-4 z-20"
  >
    <div class="container flex-y-center justify-between gap-4">
      <div class="rounded-lg bg-white-100 p-1.5 shrink-0">
        <SvgoCommonEqual
          v-if="!isOpen"
          class="text-gray-100 text-[22px]"
          @click="isOpen = !isOpen"
        />
        <SvgoCommonClose
          v-else
          class="text-gray-100 text-[22px]"
          @click="isOpen = !isOpen"
        />
      </div>
      <CommonLogo @click="isOpen = false" />
      <NuxtLinkLocale
        to="/search"
        class="rounded-lg bg-white-100 p-1.5 shrink-0"
        @click="isOpen = false"
      >
        <SvgoCommonSearch class="text-gray-100 text-[22px]" />
      </NuxtLinkLocale>
    </div>
    <Transition name="fade">
      <LayoutHeaderNavbar v-if="isOpen" @close="isOpen = false" />
    </Transition>
    <ProfileSidebarPremium class="hidden" />
  </header>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const isOpen = ref(false)

const route = useRoute()
const isSearchPage = computed(() => route.path === `/${locale.value}/search`)

watch(
  () => isOpen.value,
  () => {
    if (isOpen.value) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }
)
</script>
