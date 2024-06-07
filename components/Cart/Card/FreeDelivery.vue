<template>
  <div class="bg-white-100 rounded-10 p-4 space-y-3">
    <div class="flex-y-center justify-between">
      <p class="text-xs font-normal text-gray-100 leading-none">
        {{ $t('free_delivery') }}
      </p>
      <p class="text-xs font-bold leading-snug text-gray-100">
        <span class="text-base font-bold text-dark leading-normal">
          {{ formatMoneyDecimal(freeDeliveryPrice, 0) }}
        </span>
        UZS
      </p>
    </div>
    <div class="h-1 w-full bg-gray-200 rounded-full relative">
      <div
        :style="{ width: calculatePercentage }"
        class="h-1 absolute left-0 rounded-full transition-300"
        :class="bgColor"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatMoneyDecimal } from '~/utils/functions/common.js'

interface Props {
  freeDeliveryPrice: number
  cartTotalPrice: number
}

const props = defineProps<Props>()
const calculatePercentage = computed(() => {
  const difference = props.cartTotalPrice / props.freeDeliveryPrice
  return difference > 1 ? '100%' : `${difference * 100}%`
})

const bgColor = computed(() => {
  if (props.cartTotalPrice / props.freeDeliveryPrice < 0.6) {
    return 'bg-orange'
  }
  return 'bg-green'
})
</script>

<style scoped></style>
