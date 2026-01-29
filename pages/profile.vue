<template>
  <LayoutWrapper v-if="useMobile('desktop')">
    <template #left>
      <div class="sticky top-[86px]">
        <ProfileSidebarMenu class="mb-4" :menu @menu-click="menuClick" />
        <button
          class="p-[14px] flex items-center gap-1.5 w-full group bg-gray-300 rounded-xl"
          @click="logoutModal = true"
        >
          <span
            class="w-6 h-6 rounded-md flex-center transition-300 group-hover:bg-red/20"
          >
            <SvgoCommonLogOut
              class="text-xl leading-5 transition-300 text-red"
            />
          </span>
          <span class="text-xs leading-130 font-semibold text-dark text-left">
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
      </div>
    </template>
    <template #default> <NuxtPage /> </template>
    <template #right>
      <div class="sticky top-[86px]">
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
      </div>
    </template>
  </LayoutWrapper>
  <LayoutMobile v-else>
    <NuxtPage :transition="{ name: 'fade', mode: 'out-in' }" />
  </LayoutMobile>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth.js'
import { useModalStore } from '~/store/modal.js'

definePageMeta({
  middleware: ['auth'],
  page: 'MyProfile',
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
    isPremium: false,
  },
  {
    link: '/profile/edit',
    title: t('my_infos'),
    icon: 'SvgoProfileUserCircle',
    iconClass: 'text-dark group-[.active]:text-white',
    iconWrapperClass: 'group-[.active]:bg-black group-hover:bg-gray-200',
  },
  {
    link: '/profile/orders',
    title: t('orders'),
    icon: 'SvgoProfileSidebarCart',
    iconClass: 'text-dark group-[.active]:text-white',
    iconWrapperClass: 'group-[.active]:bg-orange group-hover:bg-gray-200',
  },
  {
    link: '/profile/addresses',
    title: t('addresses'),
    icon: 'SvgoProfileSidebarLocation',
    iconClass: 'text-dark group-[.active]:text-white',
    iconWrapperClass: 'group-[.active]:bg-orange group-hover:bg-gray-200',
  },
  {
    link: '/profile/my-cards',
    title: t('my_cards'),
    icon: 'SvgoProfileCard',
    iconClass: 'text-dark group-[.active]:text-white',
    iconWrapperClass: 'group-[.active]:bg-orange group-hover:bg-gray-200',
  },
  {
    link: '/profile/notifications',
    title: t('notifications'),
    icon: 'SvgoCommonBell',
    iconClass: 'text-dark group-[.active]:text-white',
    iconWrapperClass: 'group-[.active]:bg-orange group-hover:bg-gray-200',
  },
  {
    link: '/profile/saved',
    title: t('saved_list'),
    icon: 'SvgoProfileSidebarMenuList',
    iconClass: 'text-dark group-[.active]:text-white',
    iconWrapperClass: 'group-[.active]:bg-orange group-hover:bg-gray-200',
  },
  {
    link: '/profile/promocodes',
    title: t('discounts_and_promocodes'),
    icon: 'SvgoProfileSidebarTag',
    iconClass: 'text-dark group-[.active]:text-white',
    iconWrapperClass: 'group-[.active]:bg-orange group-hover:bg-gray-200',
  },
  {
    link: '/profile/settings',
    title: t('settings'),
    icon: 'SvgoProfileSidebarSettings',
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

const modalStore = useModalStore()
const authStore = useAuthStore()

const menuClick = (item: any) => {
  if (item?.isPremium && !authStore.user?.is_premium) {
    modalStore.premiumModel = true
  }
}
</script>
