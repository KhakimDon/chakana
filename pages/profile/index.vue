<template>
  <section class="space-y-4">
    <h1
      v-if="useMobile('mobile')"
      class="text-xl md:text-[22px] font-extrabold leading-7 text-dark"
    >
      {{ $t('profile') }}
    </h1>
    <!-- Баннер для скачивания приложения -->
    <a 
      href="https://express.chakana.uz/app/" 
      target="_blank"
      class="block rounded-2xl overflow-hidden hover:opacity-90 transition-300"
    >
      <img 
        src="/images/Sidebar.png" 
        alt="Download App" 
        class="w-full h-auto rounded-2xl"
      />
    </a>
    <ProfileSidebarMenu class="my-4" :menu @menu-click="menuClick" />
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
import { useModalStore } from '~/store/modal.js'

definePageMeta({
  middleware: ['auth'],
  page: 'MyProfileIndex',
})

const router = useRouter()
const localePath = useLocalePath()
const { t } = useI18n()

const menu = [
  {
    link: '/profile/auto-order',
    title: t('auto_order'),
    icon: 'SvgoCommonCalendar',
    iconClass: 'text-dark group-[.active]:text-white',
    iconWrapperClass: 'group-[.active]:bg-orange group-hover:bg-gray-200',
    isPremium: true,
  },
  {
    link: '/profile/edit',
    title: t('my_infos'),
    icon: SvgoProfileUserCircle,
    iconClass: 'text-dark group-[.active]:text-white',
    iconWrapperClass: 'group-[.active]:bg-orange group-hover:bg-gray-200',
  },
  {
    link: '/profile/orders',
    title: t('orders'),
    icon: SvgoProfileSidebarCart,
    iconClass: 'text-dark group-[.active]:text-white',
    iconWrapperClass: 'group-[.active]:bg-orange group-hover:bg-gray-200',
  },
  {
    link: '/profile/addresses',
    title: t('addresses'),
    icon: SvgoProfileSidebarLocation,
    iconClass: 'text-dark group-[.active]:text-white',
    iconWrapperClass: 'group-[.active]:bg-orange group-hover:bg-gray-200',
  },
  {
    link: '/profile/my-cards',
    title: t('my_cards'),
    icon: SvgoProfileCard,
    iconClass: 'text-dark group-[.active]:text-white',
    iconWrapperClass: 'group-[.active]:bg-orange group-hover:bg-gray-200',
  },
  {
    link: '/profile/notifications',
    title: t('notifications'),
    icon: SvgoCommonBell,
    iconClass: 'text-dark group-[.active]:text-white',
    iconWrapperClass: 'group-[.active]:bg-orange group-hover:bg-gray-200',
  },
  {
    link: '/profile/saved',
    title: t('saved_list'),
    icon: SvgoProfileSidebarMenuList,
    iconClass: 'text-dark group-[.active]:text-white',
    iconWrapperClass: 'group-[.active]:bg-orange group-hover:bg-gray-200',
  },
  {
    link: '/profile/promocodes',
    title: t('discounts_and_promocodes'),
    icon: SvgoProfileSidebarTag,
    iconClass: 'text-dark group-[.active]:text-white',
    iconWrapperClass: 'group-[.active]:bg-orange group-hover:bg-gray-200',
  },
  {
    link: '/profile/settings',
    title: t('settings'),
    icon: SvgoProfileSidebarSettings,
    iconClass: 'text-dark group-[.active]:text-white',
    iconWrapperClass: 'group-[.active]:bg-orange group-hover:bg-gray-200',
  },
]
const logoutModal = ref(false)

async function logout() {
  await useAuthStore().logOut()
  logoutModal.value = false
  router.push(localePath('/'))
}

const menuClick = (item: any) => {
  if (item?.isPremium && !useAuthStore().user?.is_premium) {
    useModalStore().premiumModel = true
  }
}
</script>
