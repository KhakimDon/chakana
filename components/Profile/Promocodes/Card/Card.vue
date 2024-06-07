<template>
  <div
    class="flex justify-between bg-white rounded-xl px-4 py-3 border border-white-100"
  >
    <div class="flex flex-col gap-1.5 justify-between">
      <p
        class="font-sm font-bold leading-130"
        :class="statusStyles[promo.status]"
      >
        {{ promo.code }}
      </p>
      <time class="text-gray-100 font-xs font-medium leading-130">
        {{ dayjs(promo.expire).format('DD.MM.YYYY') }}
      </time>
    </div>
    <div class="flex flex-col gap-1.5 items-end">
      <ProfilePromocodesCardBadge :type="promo.status" />
      <div class="flex gap-0.5">
        <p class="text-dark font-sm font-bold leading-130">
          {{ formatMoneyDecimal(promo.discount) }}
        </p>
        <span class="text-gray-100 font-xs font-bold leading-140">UZS</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

import type { IPromocodeDetail, TPromocodeStatuses } from '~/types/profile'
import { formatMoneyDecimal } from '~/utils/functions/common'

defineProps<{ promo: IPromocodeDetail }>()

const statusStyles: Record<TPromocodeStatuses, string> = {
  available: 'text-dark',
  used: 'text-gray-100',
  expired: 'text-gray-100',
}
</script>
