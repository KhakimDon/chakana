<template>
  <div>
    <CommonBack v-if="useMobile('mobile')" to="/profile" />
    <div class="flex-center-between mb-4">
      <h1 class="text-xl md:text-[22px] font-extrabold leading-7 text-dark">
        {{ $t('my_infos') }}
      </h1>
      <button
        v-if="false"
        class="flex-y-center gap-1 font-semibold text-sm text-center leading-5 text-gray-100 group transition-300 hover:text-orange"
        @click="editModal = true"
      >
        <SvgoCommonEditPenSquare
          class="text-xl leading-5 text-gray-100 transition-300 group-hover:text-orange"
        />
        <span class="hidden md:inline">{{ $t('edit_info') }}</span>
      </button>
    </div>
    <div class="bg-gray-300 rounded-xl">
      <div class="relative">
        <img
          class="w-full max-md:h-[100px] rounded-t-xl relative z-0"
          src="~/public/images/profile-pattern.png"
          alt="Pattern"
        />
        <p
          v-if="data?.is_premium"
          class="px-2 py-1 rounded-full flex-y-center gap-1 text-sm md:text-base font-semibold leading-130 text-white absolute bottom-4 right-6 bg-orange border border-white/20"
        >
          <SvgoProfileSidebarCrownStroke class="text-xl leading-5 text-white" />
          Premium
        </p>
      </div>
      <img
        :key="userTrigger"
        class="relative object-cover left-4 md:left-7 z-10 rounded-full w-20 md:w-[100px] h-20 md:h-[100px] border-2 md:border-4 border-gray-300 bg-gray-300 -mt-10 md:-mt-[50px]"
        width="100%"
        height="100%"
        :src="data?.image || '/images/default/user.png'"
        :alt="data?.name"
        @error="handleImageError"
      />
      <div class="px-4 md:px-6 pb-4 md:pb-6 flex-center-between mt-2 md:mt-4">
        <p class="text-lg md:text-xl font-bold text-dark leading-130">
          {{ data?.name }}
        </p>

        <button
          class="flex-y-center gap-1 font-semibold text-center text-sm leading-5 text-gray-100 group transition-300 hover:text-orange"
          @click="editModal = true"
        >
          <SvgoCommonEditPenSquare
            class="text-xl leading-5 text-gray-100 transition-300 group-hover:text-orange"
          />
          <span class="hidden md:inline">{{ $t('edit_info') }}</span>
        </button>
      </div>
    </div>
    <div
      class="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-300 rounded-xl mt-5"
    >
      <div class="flex flex-col gap-3">
        <p class="text-base md:text-lg font-bold leading-130 text-dark">
          {{ $t('contacts') }}
        </p>
        <div class="flex flex-col gap-1">
          <p class="text-sm leading-130 font-normal text-gray-100">
            {{ $t('phone_number') }}
          </p>
          <p class="text-base font-semibold leading-5 text-dark">
            {{ formatPhoneNumber(data?.phone) || '-' }}
          </p>
        </div>
        <div class="flex flex-col gap-1">
          <p class="text-sm leading-130 font-normal text-gray-100">
            {{ $t('email') }}
          </p>
          <p class="text-base font-semibold leading-5 text-dark">
            {{ data?.email || '-' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col gap-3">
        <p class="text-base md:text-lg font-bold leading-130 text-dark">
          {{ $t('social_contacts') }}
        </p>
        <div class="flex items-center gap-2 p-1.5 pr-3 bg-white rounded-xl">
          <div class="w-[30px] h-[30px] bg-[#FDE9E9] flex-center rounded-lg">
            <img src="/images/svg/socials/instagram-gradient.svg" alt="" />
          </div>
          <p
            class="text-sm font-medium leading-5"
            :class="data?.instagram ? 'text-dark' : 'text-gray'"
          >
            {{ data?.instagram || $t('add_instagram') }}
          </p>
        </div>
        <div class="flex items-center gap-2 p-1.5 pr-3 bg-white rounded-xl">
          <div class="w-[30px] h-[30px] bg-[#FDE9E9] flex-center rounded-lg">
            <img src="/images/svg/socials/telegram-gradient.svg" alt="" />
          </div>
          <p
            class="text-sm font-medium leading-5"
            :class="data?.telegram ? 'text-dark' : 'text-gray'"
          >
            {{ data?.telegram || $t('add_telegram') }}
          </p>
        </div>
      </div>
    </div>
    <ProfileModalEdit :key="data?.id" v-model="editModal" :user="data" />
  </div>
</template>
<script setup lang="ts">
import { useAuthStore } from '~/store/auth.js'
import { formatPhoneNumber } from '~/utils/functions/common'

const data = computed(() => useAuthStore().user)
const userTrigger = computed(() => useAuthStore().userFetchTrigger)

const editModal = ref(false)

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = '/images/default/user.png'
}
</script>
