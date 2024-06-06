<template>
  <div class="bg-white border border-white-100 rounded-xl p-4">
    <div class="flex-y-center gap-2">
      <div class="w-6 h-6 flex-center bg-white-100 rounded-full shrink-0">
        <img
          class="w-4 h-4 object-contain"
          :src="item.icon"
          :alt="item.title"
        />
      </div>
      <p class="text-sm font-bold leading-130 text-dark line-clamp-1">
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
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

import type { INotification } from '~/types/profile.js'

interface Props {
  item: INotification
}
defineProps<Props>()
</script>
