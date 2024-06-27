<template>
  <header :key="locale" class="w-full border-b border-white-100 py-4">
    <div class="container grid grid-cols-3 gap-4">
      <CommonLogo />
      <div class="flex-center gap-6">
        <NuxtLinkLocale
          v-for="(item, index) in menu"
          :key="index"
          :to="item?.isPremium ? '#' : item?.link"
          exact-active-class="text-orange"
          class="text-sm leading-[18px] cursor-pointer font-semibold text-dark hover:text-orange transition-300 flex-y-center gap-1"
          @click="item?.isPremium ? (modalStore.premiumModel = true) : null"
        >
          {{ item?.title }}
          <IconCrown
            v-if="item?.isPremium"
            class="text-orange translate-y-0.5"
          />
        </NuxtLinkLocale>
      </div>
      <div class="flex justify-end gap-3">
        <LayoutHeaderLanguageSwitcher />
        <BaseButton
          v-if="!user?.id"
          variant="secondary"
          class="!h-9 flex-center"
          :text="$t('register')"
          @click="openAuthModal"
        >
          <template #prefix>
            <IconLogin class="text-xl" />
          </template>
        </BaseButton>
        <div v-else class="flex-y-center gap-2">
          <div class="w-px h-7 bg-white-100" />
          <NuxtLinkLocale to="/cart" class="flex-y-center gap-1.5 group">
            <IconCart class="text-2xl text-blue-100" />
            <p
              class="text-sm leading-130 font-semibold text-dark transition-300 group-hover:text-orange"
            >
              {{ $t('basket') }}
            </p>
          </NuxtLinkLocale>
          <div class="w-px h-7 bg-white-100" />
          <NuxtLinkLocale to="/saved" class="flex-y-center gap-1.5 group">
            <IconHeart class="text-2xl text-red" />
            <p
              class="text-sm leading-130 font-semibold text-dark transition-300 group-hover:text-orange"
            >
              {{ $t('saved') }}
            </p>
          </NuxtLinkLocale>
          <LayoutHeaderUser :user="user" class="ml-2" />
        </div>
      </div>
      <ProfileSidebarPremium class="hidden" />
    </div>
  </header>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import IconCart from '~/assets/icons/Common/cart.svg'
import IconCrown from '~/assets/icons/Common/crown.svg'
import IconHeart from '~/assets/icons/Common/heart.svg'
import IconLogin from '~/assets/icons/Common/login.svg'
import { useAuthStore } from '~/store/auth'
import { useModalStore } from '~/store/modal.js'

const authStore = useAuthStore()
const modalStore = useModalStore()
const { t } = useI18n()

const user = computed(() => authStore.user)
const { locale } = useI18n()

function openAuthModal() {
  authStore.showAuth = true
}

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
