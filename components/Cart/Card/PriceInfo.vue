<template>
  <div class="rounded-xl bg-white-100 p-4">
    <p class="text-base font-extrabold text-dark mb-1">
      {{ $t('shall_we_count') }}
    </p>
    <div
      v-if="false"
      class="text-xs mb-3 flex-y-center gap-1 font-semibold leading-none text-gray-100"
    >
      {{ t('cary_products', { count: cartDetail?.count }) }}
      <p class="w-1 h-1 bg-gray-100 rounded-full"></p>
      {{ t('products_weight', { weight: totalCartWeight }) }}
    </div>
    <div class="space-y-2">
      <div class="flex-y-center justify-between">
        <p class="text-xs font-normal leading-none text-gray-100">
          {{ t('total_products', { count: cartDetail?.count }) }}
        </p>
        <p class="text-xs font-semibold leading-none text-dark">
          {{ formatMoneyDecimal(cartDetail?.product_price, 0) }}
          <span class="text-[10px] font-semibold leading-130">UZS</span>
        </p>
      </div>
      <div class="flex-y-center justify-between">
        <p class="text-xs font-normal leading-none text-gray-100">
          {{ $t('delivery_price') }}
        </p>
        <p class="text-xs font-semibold leading-none text-dark">
          {{ formatMoneyDecimal(cartDetail?.delivery_price ?? 0, 0) }}
          <span class="text-[10px] font-semibold leading-130">UZS</span>
        </p>
      </div>
      <div class="flex-y-center justify-between">
        <p class="text-xs font-normal leading-none text-gray-100">
          {{ $t('ndc') }}
        </p>
        <p class="text-xs font-semibold leading-none text-dark">
          {{ formatMoneyDecimal(cartDetail?.tax_price, 0) }}
          <span class="text-[10px] font-semibold leading-130">UZS</span>
        </p>
      </div>
      <div class="flex-y-center justify-between">
        <p class="text-xs font-medium text-gray-100 leading-130">
          {{ $t('promo_code') }}
        </p>
        <p class="text-xs font-semibold leading-130 text-red">
          {{ cartDetail?.reward_discount }} UZS
        </p>
      </div>
      <div class="flex-y-center justify-between">
        <p class="text-xs font-normal leading-none text-gray-100">
          {{ $t('discount') }}
        </p>
        <p class="text-xs font-semibold leading-none text-red">
          {{ cartDetail?.discount_price > 0 ? '-' : '' }}
          {{ formatMoneyDecimal(cartDetail?.discount_price, 0) }}
          <span class="text-[10px] font-semibold leading-130">UZS</span>
        </p>
      </div>
      <p
        class="text-xs cursor-pointer font-medium leading-none text-green"
        @click="showDiscountDetails = true"
      >
        {{ $t('show_more') }}
      </p>
    </div>

    <div
      class="flex-y-center justify-between border-t border-gray-200 mt-4 pt-4"
    >
      <p class="text-base font-semibold leading-normal text-gray-100">
        {{ $t('total_price') }}
      </p>
      <p
        class="text-xl font-bold leading-normal text-dark whitespace-nowrap line-clamp-1"
      >
        {{ formatMoneyDecimal(cartDetail?.total_price, 0) }}
        <span class="text-xs font-bold leading-snug text-gray-100"> UZS </span>
      </p>
    </div>
    <PaymentModalDiscountDetails
      v-model="showDiscountDetails"
      :promo-code="selectedPromoCode"
    />
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/store/cart.js'
import { useCartOrderStore } from '~/store/cart_order.js'
import { formatMoneyDecimal } from '~/utils/functions/common.js'

const { t } = useI18n()
const cartStore = useCartStore()
const orderCartStore = useCartOrderStore()
const route = useRoute()

const showDiscountDetails = ref(false)

const selectedPromoCode = computed(
  () => orderCartStore.orderDetail?.promo_code_id
)

// Cart details
const cartDetail = computed<any>(() => orderCartStore?.cart?.detail)

onMounted(() => {
  if (route.path?.includes('/payment')) {
    orderCartStore.getCartDetailConfirm({
      promo_code_id: useCookie('order_data').value?.promo_code_id,
    })
  } else {
    orderCartStore.getCartDetail()
  }
})

const cartProducts = computed(() => cartStore.products)

const totalCartWeight = computed(() => {
  return (
    cartProducts.value.reduce((acc, product) => {
      return acc + product?.weight * product?.cart_count
    }, 0) / 1000
  )?.toFixed(2)
})
</script>
<style scoped></style>
