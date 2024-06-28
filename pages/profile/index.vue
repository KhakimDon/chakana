<template>
  <section class="pt-4 space-y-4">
    <h1
      v-if="useMobile('mobile')"
      class="text-xl md:text-[22px] font-extrabold leading-7 text-dark"
    >
      {{ $t('profile') }}
    </h1>
    <ProfileSidebarPremium />
    <ProfileSidebarBalance />
    <ProfileSidebarMenu class="my-4" :menu />
    <button
      class="p-[14px] flex items-center gap-1.5 w-full group bg-gray-300 rounded-xl"
      @click="logoutModal = true"
    >
      <span
        class="w-6 h-6 rounded-md flex-center transition-300 group-hover:bg-red/20"
      >
        <SvgoCommonLogOut class="text-xl leading-5 transition-300 text-red" />
      </span>
      <span class="text-xs leading-130 font-semibold text-dark">
        {{ $t('logout_from_account') }}
      </span>
    </button>
    <BaseModal v-model="logoutModal" :title="$t('logout_from_account')">
      <div>
        <p class="text-sm leading-140 text-dark whitespace-pre-line">
          {{ $t('are_you_sure_to_logout') }}
        </p>
        <div class="grid grid-cols-2 gap-4 mt-6">
          <BaseButton
            class="!py-3 !rounded-[10px]"
            :text="$t('cancel')"
            size="md"
            variant="secondary"
            @click="logoutModal = false"
          />
          <BaseButton
            class="!py-3 !rounded-[10px]"
            :text="$t('logout')"
            size="md"
            @click="logout"
          />
        </div>
      </div>
    </BaseModal>
  </section>
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
import { useAuthStore } from '~/store/auth.js'

definePageMeta({
  middleware: ['auth'],
  page: 'MyProfileIndex',
})

const router = useRouter()
const localePath = useLocalePath()
const { t } = useI18n()

const menu = [
  {
    link: '/profile/edit',
    title: t('my_infos'),
    icon: SvgoProfileUserCircle,
    iconClass: 'text-orange group-[.active]:text-white',
    iconWrapperClass: 'group-[.active]:bg-orange group-hover:bg-orange/20',
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
    link: '/profile/my-cards',
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
    link: '/profile/promocodes',
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
const logoutModal = ref(false)

async function logout() {
  await useAuthStore().logOut()
  logoutModal.value = false
  router.push(localePath('/'))
}
</script>
