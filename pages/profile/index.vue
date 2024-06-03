<template>
  <div>
    <pre>{{ data }}</pre>
    <div class="flex-center-between mb-4">
      <h1 class="text-[22px] font-extrabold leading-7 text-dark">
        {{ $t('my_infos') }}
      </h1>
      <button
        class="flex-y-center gap-1 font-semibold text-sm text-center leading-5 text-gray-100 group transition-300 hover:text-orange"
      >
        <SvgoCommonEditPenSquare
          class="text-xl leading-5 text-gray-100 transition-300 group-hover:text-orange"
        />
        {{ $t('edit_info') }}
      </button>
    </div>
    <div class="bg-gray-300 rounded-xl">
      <img
        class="w-full rounded-t-xl relative z-0"
        src="/images/profile-pattern.webp"
        alt=""
      />
      <img
        class="relative left-7 z-10 rounded-full w-[100px] h-[100px] border-4 border-gray-300 -mt-[50px] bg-transparent"
        width="100%"
        height="100%"
        src="https://picsum.photos/123/123"
        alt=""
      />
      <div class="px-6 pb-6 flex-center-between mt-4">
        <p class="text-xl font-bold text-dark leading-130">Муродхожа Муратов</p>

        <button
          class="flex-y-center gap-1 font-semibold text-center text-sm leading-5 text-gray-100 group transition-300 hover:text-orange"
        >
          <SvgoCommonEditPenSquare
            class="text-xl leading-5 text-gray-100 transition-300 group-hover:text-orange"
          />
          {{ $t('edit_info') }}
        </button>
      </div>
    </div>
    <div class="px-5 py-4 grid grid-cols-2 gap-4 bg-gray-300 rounded-xl mt-5">
      <div class="flex flex-col gap-3">
        <p class="text-lg font-bold leading-130 text-dark">
          {{ $t('contacts') }}
        </p>
        <div class="flex flex-col gap-1">
          <p class="text-sm leading-130 font-normal text-gray-100">
            {{ $t('phone_number') }}
          </p>
          <p class="text-base font-semibold leading-5 text-dark">
            +998 71 200-70-07
          </p>
        </div>
        <div class="flex flex-col gap-1">
          <p class="text-sm leading-130 font-normal text-gray-100">
            {{ $t('email') }}
          </p>
          <p class="text-base font-semibold leading-5 text-dark">-</p>
        </div>
      </div>
      <div class="flex flex-col gap-3">
        <p class="text-lg font-bold leading-130 text-dark">
          {{ $t('social_contacts') }}
        </p>
        <div class="flex items-center gap-2 p-1.5 pr-3 bg-white rounded-xl">
          <div class="w-[30px] h-[30px] bg-orange/10 flex-center rounded-lg">
            <img src="/images/svg/socials/instagram-gradient.svg" alt="" />
          </div>
          <p class="text-sm font-medium leading-5 text-gray">
            {{ $t('add_instagram') }}
          </p>
        </div>
        <div class="flex items-center gap-2 p-1.5 pr-3 bg-white rounded-xl">
          <div class="w-[30px] h-[30px] bg-orange/10 flex-center rounded-lg">
            <img src="/images/svg/socials/telegram-gradient.svg" alt="" />
          </div>
          <p class="text-sm font-medium leading-5 text-gray">
            {{ $t('add_telegram') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data } = await useAsyncData('profile', () =>
  useApi().$get('/deliver/profile/detail')
)
</script>
