<template>
  <header class="w-full border-b border-white-100 py-4">
    <div class="container grid grid-cols-3 gap-4">
      <CommonLogo />
      <div class="flex-center gap-6">
        <NuxtLinkLocale
          v-for="(item, index) in menu"
          :key="index"
          :to="item?.link"
          class="text-sm leading-[18px] font-semibold text-dark hover:text-orange transition-300 flex-y-center gap-1"
        >
          {{ item?.title }}
          <IconCrown
            v-if="item?.isPremium"
            class="text-orange translate-y-0.5"
          />
        </NuxtLinkLocale>
      </div>
      <div class="flex justify-end">
        <BaseButton
          variant="secondary"
          class="!h-9 flex-center"
          :text="$t('register')"
        >
          <template #prefix>
            <IconLogin class="text-xl" />
          </template>
        </BaseButton>
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import IconCrown from '~/assets/icons/Common/crown.svg'
import IconLogin from '~/assets/icons/Common/login.svg'

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
