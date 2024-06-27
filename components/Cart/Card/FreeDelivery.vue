<template>
  <div v-if="!isPremium">
    <div
      v-if="delivery?.loading"
      class="shimmer bg-white-100 rounded-10 p-4 h-[72px] space-y-3"
    ></div>
    <div v-else class="bg-white-100 rounded-10 p-4 space-y-3">
      <div class="flex-y-center justify-between">
        <p class="text-xs font-normal text-gray-100 leading-none">
          {{ $t('free_delivery') }}
        </p>
        <p class="text-xs font-bold leading-snug text-gray-100">
          <span class="text-base font-bold text-dark leading-normal">
            {{ formatMoneyDecimal(delivery?.detail?.free_delivery_price, 0) }}
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
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth.js'
import { useCartOrderStore } from '~/store/cart_order.js'
import { formatMoneyDecimal } from '~/utils/functions/common.js'

interface Props {
  cartTotalPrice: number
}

const props = defineProps<Props>()

const cartOrderStore = useCartOrderStore()
const authStore = useAuthStore()

const isPremium = computed(() => authStore.user?.is_premium)

cartOrderStore.getCartDetail()
cartOrderStore.getDeliveryDetail()

const delivery = computed(() => cartOrderStore.delivery)

const calculatePercentage = computed(() => {
  const difference =
    props.cartTotalPrice / delivery.value?.detail?.free_delivery_price
  return difference > 1 ? '100%' : `${difference * 100}%`
})

const bgColor = computed(() => {
  if (
    props.cartTotalPrice / delivery.value?.detail?.free_delivery_price <
    0.6
  ) {
    return 'bg-orange'
  }
  return 'bg-green'
})
</script>

<style scoped></style>
