<template>
  <div>
    <NuxtLinkLocale
      class="flex-y-center gap-1 text-sm font-semibold text-gray-100 group mb-3"
      to="/profile/notifications"
    >
      <SvgoCommonChevron
        class="text-base leading-4 text-gray-100 group-hover:-translate-x-0.5 transition-300"
      />
      {{ $t('go_back') }}
    </NuxtLinkLocale>
    <div class="p-2 bg-white-100 rounded-xl mb-5">
      <img
        class="w-full h-auto aspect-[741/253] rounded-lg object-cover"
        :src="data.image"
        alt=""
      />
    </div>
    <h1 class="text-xl leading-130 text-dark font-extrabold">
      {{ data.title }}
    </h1>
    <div
      class="flex-y-center gap-1.5 font-medium text-xs text-dark leading-130 mt-2 mb-4"
    >
      <SvgoCommonCalendar class="text-xl leading-5 text-gray-100" />
      {{ dayjs(new Date()).format('DD.MM.YYYY') }}
      <span class="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
      {{ dayjs(new Date()).format('HH:mm') }}
    </div>
    <p class="whitespace-pre-line text-sm leading-140 font-normal">
      {{ data.description }}
    </p>
    <!--
   Todo: Backend bo'lganida ulab qo'ymoqchidim lekin
    © Olimjonov Ibrohim, 01:48
    -->
    ️<NuxtLinkLocale
      v-if="false"
      class="font-medium text-sm leading-140 text-blue-100 hover:underline"
      :to="`/profile/auto-order/id`"
    >
      {{ $t('more_about_auto_order') }}
    </NuxtLinkLocale>
    <div v-if="false" class="flex gap-y-2 gap-x-4 max-sm:flex-col mt-4 md:mt-8">
      <BaseButton :text="$t('accept')" class="!py-2 md:!py-3 w-full" />
      <BaseButton
        :text="$t('cancel')"
        variant="secondary"
        class="!py-2 md:!py-3 w-full"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs'

const { data, error } = await useAsyncData(() =>
  useApi().$get(`/notification/${useRoute().params.id}`)
)
if (error.value) showError({ status: 404 })
</script>
