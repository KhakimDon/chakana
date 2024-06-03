<template>
  <LayoutWrapper>
    <template #left>
      <div>
        <SidebarPremium />
        <SidebarMenu class="my-4" :menu />
        <button
          class="p-[14px] flex items-center gap-1.5 w-full group bg-gray-300 rounded-xl"
        >
          <span
            class="w-6 h-6 rounded-md flex-center transition-300 group-hover:bg-red/20"
          >
            <SvgoCommonLogOut
              class="text-xl leading-5 transition-300 text-red"
            />
          </span>
          <span class="text-xs leading-130 font-semibold text-dark">
            {{ $t('logout_from_account') }}
          </span>
        </button>
      </div>
    </template>
    <template #default> <NuxtPage /> </template>
    <template #right>
      <div>right side</div>
    </template>
  </LayoutWrapper>
</template>

<script setup lang="ts">
import {
  SvgoCommonBell,
  SvgoProfileCard,
  SvgoProfileSidebarCart,
  SvgoProfileSidebarLocation,
  SvgoProfileSidebarMenuList,
  SvgoProfileSidebarSettings,
  SvgoProfileSidebarTag,
  SvgoProfileUserCircle,
} from '#components'

const { t } = useI18n()

const menu = [
  {
    link: '/profile',
    title: t('my_infos'),
    icon: SvgoProfileUserCircle,
    iconClass: 'text-orange group-[.active]:text-white',
    iconWrapperClass: 'group-[.active]:bg-orange',
  },
  {
    link: '/profile/orders',
    title: t('orders'),
    icon: SvgoProfileSidebarCart,
    iconClass: 'text-blue-100 group-[.active]:text-white',
    iconWrapperClass: 'group-[.active]:bg-blue-100 group-hover:bg-blue-100/20',
  },
  {
    link: '/profile/addresses',
    title: t('addresses'),
    icon: SvgoProfileSidebarLocation,
    iconClass: 'text-[#088339] group-[.active]:text-white',
    iconWrapperClass:
      'group-[.active]:bg-[#088339] group-hover:bg-[#088339]/20',
  },
  {
    link: '/profile/addresses',
    title: t('my_cards'),
    icon: SvgoProfileCard,
    iconClass: 'text-blue-100 group-[.active]:text-white',
    iconWrapperClass: 'group-[.active]:bg-blue-100 group-hover:bg-blue-100/20',
  },
  {
    link: '/profile/notifications',
    title: t('notifications'),
    icon: SvgoCommonBell,
    iconClass: 'text-[#F7C954] group-[.active]:text-white',
    iconWrapperClass:
      'group-[.active]:bg-[#F7C954] group-hover:bg-[#F7C954]/20',
  },
  {
    link: '/profile/saved',
    title: t('saved_list'),
    icon: SvgoProfileSidebarMenuList,
    iconClass: 'text-[#9747FF] group-[.active]:text-white',
    iconWrapperClass:
      'group-[.active]:bg-[#9747FF] group-hover:bg-[#9747FF]/20',
  },
  {
    link: '/profile/discounts',
    title: t('discounts_and_promocodes'),
    icon: SvgoProfileSidebarTag,
    iconClass: 'text-[#F5C005] group-[.active]:text-white',
    iconWrapperClass:
      'group-[.active]:bg-[#F5C005]  group-hover:bg-[#F5C005]/20',
  },
  {
    link: '/profile/settings',
    title: t('settings'),
    icon: SvgoProfileSidebarSettings,
    iconClass: 'text-[#FF831B] group-[.active]:text-white',
    iconWrapperClass:
      'group-[.active]:bg-[#FF831B]  group-hover:bg-[#FF831B]/20',
  },
]
</script>
