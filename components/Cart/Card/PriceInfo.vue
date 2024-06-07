<template>
  <div class="rounded-xl bg-white-100 p-4">
    <p class="text-base font-extrabold text-dark mb-1">
      {{ $t('shall_we_count') }}
    </p>
    <div
      class="text-xs mb-3 flex-y-center gap-1 font-semibold leading-none text-gray-100"
    >
      {{ t('cary_products', { count: cartProducts.length }) }}
      <p class="w-1 h-1 bg-gray-100 rounded-full"></p>
      {{ t('products_weight', { weight: totalCartWeight }) }}
    </div>
    <div class="space-y-2">
      <div class="flex-y-center justify-between">
        <p class="text-xs font-normal leading-none text-gray-100">
          {{ t('total_products', { count: cartProducts.length }) }}
        </p>
        <p class="text-xs font-semibold leading-none text-dark">
          {{ formatMoneyDecimal(totalCartProductsPrice, 0) }}
          <span class="text-[10px] font-semibold leading-130">UZS</span>
        </p>
      </div>
      <div class="flex-y-center justify-between">
        <p class="text-xs font-normal leading-none text-gray-100">
          {{ $t('delivery_price') }}
        </p>
        <p class="text-xs font-semibold leading-none text-dark">
          {{ formatMoneyDecimal(deliveryPrice, 0) }}
          <span class="text-[10px] font-semibold leading-130">UZS</span>
        </p>
      </div>
      <div class="flex-y-center justify-between">
        <p class="text-xs font-normal leading-none text-gray-100">
          {{ $t('ndc') }}
        </p>
        <p class="text-xs font-semibold leading-none text-dark">
          {{ formatMoneyDecimal(ndcPrice, 0) }}
          <span class="text-[10px] font-semibold leading-130">UZS</span>
        </p>
      </div>
      <div class="flex-y-center justify-between">
        <p class="text-xs font-normal leading-none text-gray-100">
          {{ $t('discount') }}
        </p>
        <p class="text-xs font-semibold leading-none text-dark">
          {{ formatMoneyDecimal(discountPrice, 0) }}
          <span class="text-[10px] font-semibold leading-130">UZS</span>
        </p>
      </div>
      <p class="text-xs font-medium leading-none text-green">
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
        {{ formatMoneyDecimal(totalPrice, 0) }}
        <span class="text-xs font-bold leading-snug text-gray-100"> UZS </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/store/cart.js'
import { formatMoneyDecimal } from '~/utils/functions/common.js'

const { t } = useI18n()
const router = useRouter()
const cartStore = useCartStore()

const cartProducts = computed(() => cartStore.products)

const totalCartWeight = computed(() => {
  return (
    cartProducts.value.reduce((acc, product) => {
      return acc + product?.weight * product?.cart_count
    }, 0) / 1000
  )?.toFixed(2)
})

// All prices
const totalCartProductsPrice = computed(() => {
  return (
    cartProducts.value.reduce((acc, product) => {
      return acc + product?.price * product?.cart_count
    }, 0) || 0
  )
})

const discountPrice = computed(() => {
  return (
    cartProducts.value.reduce((acc, product) => {
      return acc + product?.discountPrice * product?.cart_count
    }, 0) || 0
  )
})

const ndcPrice = computed(() => {
  return (
    cartProducts.value.reduce((acc, product) => {
      return acc + product?.ndcPrice * product?.cart_count
    }, 0) || 0
  )
})

const deliveryPrice = computed(() => {
  return (
    cartProducts.value.reduce((acc, product) => {
      return acc + product?.deliveryPrice * product?.cart_count
    }, 0) || 0
  )
})

const totalPrice = computed(() => {
  return (
    totalCartProductsPrice.value +
    discountPrice.value +
    ndcPrice.value +
    deliveryPrice.value
  )
})
</script>
<style scoped></style>
