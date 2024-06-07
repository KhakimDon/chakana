<template>
  <NuxtLinkLocale
    :to="`/profile/notifications/${item.id}`"
    class="p-px bg-white-100 rounded-xl group"
    :class="{
      'bg-[linear-gradient(180deg,_#FF831B_0%,_#FF3300_100%)]': !item.viewed,
    }"
  >
    <div
      class="bg-white rounded-[11px] p-4"
      :class="{ 'shadow-[0_4px_20px_0_#FF831B0F]': !item.viewed }"
    >
      <div class="flex-y-center gap-2">
        <div
          class="w-6 h-6 flex-center bg-white-100 rounded-full shrink-0"
          :class="{
            'shadow-[0_4px_10px_0_#FF520B47] bg-[linear-gradient(180deg,_#FF831B_0%,_#FF3300_100%)] ':
              !item.viewed,
          }"
        >
          <img
            class="w-4 h-4 object-contain"
            :class="{ 'icon-active-filter': !item.viewed }"
            :src="item.icon"
            :alt="item.title"
          />
        </div>
        <p
          class="text-sm font-bold leading-130 text-dark line-clamp-1 group-hover:text-orange transition-300"
        >
          {{ item.title }}
        </p>
      </div>

      <p
        class="text-xs font-normal leading-130 text-gray-100 mt-1.5 mb-3 line-clamp-1"
      >
        {{ item.description }}
      </p>
      <div
        class="border border-white-100 rounded-md p-1.5 flex items-center gap-1.5 text-dark text-xs font-medium leading-130"
      >
        <SvgoCommonCalendar class="text-gray-100 font-bold text-xl leading-5" />
        <p>{{ dayjs(item.date_send).format('DD.MM.YYYY') }}</p>
        <span class="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
        <p>{{ dayjs(item.date_send).format('HH:mm') }}</p>
      </div>
    </div>
  </NuxtLinkLocale>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

import type { INotification } from '~/types/profile.js'

interface Props {
  item: INotification
}
defineProps<Props>()
</script>

<style>
.icon-active-filter {
  filter: invert(100%) sepia(12%) saturate(7476%) hue-rotate(177deg)
    brightness(112%) contrast(101%);
}
</style>
