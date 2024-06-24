<template>
  <div
    class="fixed top-[68px] h-[calc(100vh-68px)] bg-white left-0 z-10 w-full py-5 px-4 flex flex-col justify-between"
  >
    <div class="flex flex-col gap-4" @click="$emit('close')">
      <LayoutHeaderLanguageSwitcher class="mb-3" />

      <NuxtLinkLocale
        v-for="(item, index) in menu"
        :key="index"
        :to="item?.link"
        exact-active-class="text-orange"
        class="text-[22px] leading-[18px] font-semibold text-dark hover:text-orange transition-300 flex-y-center gap-1"
      >
        {{ item?.title }}
        <IconCrown v-if="item?.isPremium" class="text-orange translate-y-0.5" />
      </NuxtLinkLocale>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import IconCrown from '~/assets/icons/Common/crown.svg'

const { t } = useI18n()

const menu = [
  {
    title: t('brands'),
    link: '/brands',
    isPremium: false,
  },
  {
    title: t('discounts'),
    link: '/discounts',
    isPremium: false,
  },
  {
    title: 'Premium',
    link: '/search',
    isPremium: true,
  },
]
</script>
