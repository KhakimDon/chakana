<template>
  <section class="space-y-5 mt-5">
    <CartCardFreeDelivery
      :free-delivery-price="90000"
      :cart-total-price="totalCartPrice"
    />

    <p class="text-xl font-extrabold text-dark">{{ $t('basket') }}</p>
    <div class="space-y-5">
      <div class="flex-y-center justify-between">
        <p class="text-sm font-semibold leading-130 text-dark">
          {{ t('cary_products', { count: cartProducts.length }) }}
        </p>
        <div
          class="flex-center gap-2 group cursor-pointer select-none"
          @click="clearCart"
        >
          <SvgoCommonTrash
            class="text-base text-gray-100 group-hover:text-red transition-300"
          />
          <p
            class="text-xs font-semibold text-gray-100 group-hover:text-red transition-300"
          >
            {{ $t('clear_all') }}
          </p>
        </div>
      </div>
      <div class="h-72 overflow-y-auto space-y-5">
        <SearchCardProduct
          v-for="(product, key) in cartProducts"
          :key
          :product="product"
          class="!p-0"
          title-class="line-clamp-2"
        />
      </div>
    </div>
    <BaseButton
      class="w-full !rounded-10"
      :text="$t('go_to_cart')"
      variant="primary"
      @click="goToCart"
    />
  </section>
</template>

<script setup lang="ts">
import { useCartStore } from '~/store/cart.js'

const router = useRouter()
const { t, locale } = useI18n()
const cartStore = useCartStore()
const cartProducts = computed(() => cartStore.products)

const clearCart = () => {
  cartStore.products = []
}

const totalCartPrice = computed(() => {
  return cartProducts.value.reduce((acc, product) => {
    return acc + product?.price * product.cart_count
  }, 0)
})

const goToCart = () => {
  router.push(`/${locale.value}/cart`)
}
</script>

<style scoped></style>
