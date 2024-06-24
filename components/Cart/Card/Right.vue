<template>
  <section class="space-y-5">
    <CartCardFreeDelivery :cart-total-price="cartDetails?.total_price ?? 0" />
    <div
      v-if="loading"
      class="shimmer bg-white-100 rounded-10 p-4 h-[200px] space-y-3"
    ></div>
    <CartCardPriceInfo v-else />
    <div
      v-if="loading"
      class="shimmer bg-white-100 rounded-10 p-4 h-[38px]"
    ></div>
    <BaseButton
      v-else
      class="w-full !rounded-10 !py-2"
      :text="$t('go_to_registration')"
      variant="green"
      :disabled="cartProducts.length === 0"
      @click="goToPayment"
    />
    <PaymentFullInfos class="hidden" />
  </section>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth.js'
import { useCartStore } from '~/store/cart.js'
import { useCartOrderStore } from '~/store/cart_order.js'
import { useModalStore } from '~/store/modal.js'

const { locale } = useI18n()
const router = useRouter()

const orderCartStore = useCartOrderStore()
const cartStore = useCartStore()

const cartProducts = computed(() => cartStore.products)
const loading = computed(() => cartStore.cartProductsLoading)
const cartDetails = computed(() => orderCartStore.cart.detail)

const modalStore = useModalStore()
const authStore = useAuthStore()

const token = computed(() => authStore.accessToken)
const goToPayment = () => {
  if (token.value) {
    if (!modalStore.addressModel && !orderCartStore.orderDetail.address?.id) {
      modalStore.addressModel = true
    } else {
      router.push(`/${locale.value}/cart/payment`)
    }
  } else {
    authStore.showAuth = true
  }
}
</script>

<style scoped></style>
