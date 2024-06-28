<template>
  <div>
    <BaseDropdown
      body-class="!w-[260px]"
      :show="showDropdown"
      @toggle="showDropdown = $event"
    >
      <template #head>
        <div class="w-9 h-9 rounded-full linear-border-image cursor-pointer">
          <img
            v-if="user?.image"
            :src="user?.image"
            alt="user"
            class="w-full h-full object-cover object-center rounded-full"
          />
          <img
            v-else
            class="w-full h-full"
            src="/images/default/user.png"
            alt="user-default"
          />
        </div>
      </template>
      <template #body>
        <div>
          <NuxtLinkLocale
            v-for="(item, index) in list"
            :key="index"
            :to="item.link"
            class="flex-y-center gap-3 w-full relative px-3 last:pb-3 first:pt-3 py-2.5 group cursor-pointer"
            @click="hideDropdown(item)"
          >
            <component
              :is="item.icon"
              class="text-2xl text-gray font-bold"
              :class="item.iconClass"
            />
            <p
              class="text-sm font-semibold leading-130 text-dark transition-300 group-hover:text-orange"
              :class="{ 'group-hover:text-red': item.link === 'logout' }"
            >
              {{ item?.title }}
            </p>
            <div
              class="h-px w-[calc(100%-48px)] bg-gray-300 absolute bottom-0 right-0"
            />
          </NuxtLinkLocale>
        </div>
      </template>
    </BaseDropdown>
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

<script setup lang="ts">
import {
  SvgoCommonBell,
  SvgoCommonLogOut,
  SvgoProfileCard,
  SvgoProfileSidebarLocation,
  SvgoProfileSidebarMenuList,
  SvgoProfileSidebarSettings,
  SvgoProfileSidebarTag,
  SvgoProfileUserCircle,
} from '#components'
import { useAuthStore } from '~/store/auth.js'
import type { IUser } from '~/types/auth.js'

interface Props {
  user: IUser
}

defineProps<Props>()

const { t } = useI18n()
const showDropdown = ref(false)
const localePath = useLocalePath()

const list = [
  {
    link: '/profile/edit',
    title: t('my_infos'),
    icon: SvgoProfileUserCircle,
  },
  {
    link: '/profile/addresses',
    title: t('addresses'),
    icon: SvgoProfileSidebarLocation,
  },
  {
    link: '/profile/my-cards',
    title: t('my_cards'),
    icon: SvgoProfileCard,
  },
  {
    link: '/profile/notifications',
    title: t('notifications'),
    icon: SvgoCommonBell,
  },
  {
    link: '/profile/saved',
    title: t('saved_list'),
    icon: SvgoProfileSidebarMenuList,
  },
  {
    link: '/profile/promocodes',
    title: t('discounts_and_promocodes'),
    icon: SvgoProfileSidebarTag,
  },
  {
    link: '/profile/settings',
    title: t('settings'),
    icon: SvgoProfileSidebarSettings,
  },
  {
    link: 'logout',
    title: t('logout_from_account'),
    icon: SvgoCommonLogOut,
    iconClass: 'text-red',
  },
]

const logoutModal = ref(false)

const hideDropdown = (item: any) => {
  if (item.link === 'logout') {
    logoutModal.value = true
    showDropdown.value = false
  } else {
    showDropdown.value = false
  }
}

const router = useRouter()

async function logout() {
  await useAuthStore().logOut()
  logoutModal.value = false
  router.push(localePath('/'))
}
</script>

<style scoped>
.linear-border-image {
  background: radial-gradient(
        circle at 100% 100%,
        #ffffff 0,
        #ffffff 17px,
        transparent 17px
      )
      0% 0%/19px 19px no-repeat,
    radial-gradient(circle at 0 100%, #ffffff 0, #ffffff 17px, transparent 17px)
      100% 0%/19px 19px no-repeat,
    radial-gradient(circle at 100% 0, #ffffff 0, #ffffff 17px, transparent 17px)
      0% 100%/19px 19px no-repeat,
    radial-gradient(circle at 0 0, #ffffff 0, #ffffff 17px, transparent 17px)
      100% 100%/19px 19px no-repeat,
    linear-gradient(#ffffff, #ffffff) 50% 50% / calc(100% - 4px)
      calc(100% - 38px) no-repeat,
    linear-gradient(#ffffff, #ffffff) 50% 50% / calc(100% - 38px)
      calc(100% - 4px) no-repeat,
    linear-gradient(#ff831b 0%, #ff3300 100%);
  border-radius: 19px;
  padding: 2px;
  box-sizing: border-box;
}
</style>
