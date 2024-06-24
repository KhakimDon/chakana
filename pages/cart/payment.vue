<template>
  <LayoutWrapper v-if="useMobile('desktop')">
    <template #right>
      <section class="space-y-5">
        <CartCardFreeDelivery :cart-total-price="totalCartProductsPrice" />
        <CartCardPriceInfo />
        <AutoOrderCard @change="isAutoOrder = $event" />
        <BaseButton
          class="w-full !rounded-10 !py-2"
          :text="$t('payment')"
          variant="green"
          :loading="loading"
          @click="goToPayment"
        />
      </section>
    </template>
    <PaymentFullInfos />
  </LayoutWrapper>
  <LayoutMobile v-else>
    <section class="mb-24 space-y-6">
      <PaymentFullInfos />
      <section class="space-y-5">
        <CartCardFreeDelivery :cart-total-price="totalCartProductsPrice" />
        <CartCardPriceInfo />
        <AutoOrderCard />
        <BaseButton
          class="w-full !rounded-10"
          :text="$t('payment')"
          variant="green"
          :loading="loading"
          @click="goToPayment"
        />
      </section>
      <CartSectionProducts />
    </section>
  </LayoutMobile>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { useCustomToast } from '~/composables/useCustomToast.js'
import { useCartStore } from '~/store/cart.js'
import { useCartOrderStore } from '~/store/cart_order.js'

const isAutoOrder = ref(false)

const { t, locale } = useI18n()
const router = useRouter()
const cartStore = useCartStore()

const orderCartStore = useCartOrderStore()

const orderDetail = computed(() => orderCartStore.orderDetail)
const autoOrderDetail = computed(() => orderCartStore.autoOrderDetail)
const loading = computed(() => orderCartStore.orderCreating)

const { showToast } = useCustomToast()

const goToPayment = () => {
  if (isAutoOrder.value) {
    orderCartStore.createAutoOrder({
      name: autoOrderDetail.value.name,
      weekdays: [autoOrderDetail.value.weekday],
      delivery_time: autoOrderDetail.value.when_to_deliver,
      payment_type: autoOrderDetail.value.payment_method,
      card_id: autoOrderDetail.value.payment_method.card_id,
      shipping_address: {
        address_id: orderDetail.value.address.id,
      },
      recipient: orderDetail.value.recipient,
    })
  } else {
    orderCartStore
      .createOrder({
        ...orderDetail.value,
        when_to_deliver: orderDetail.value.when_to_deliver,
      })
      .then(() => {
        showToast(t('order_created'), 'success')
        cartStore.getCartProducts()
        router.push(`/${locale.value}/profile/orders`)
        orderCartStore.orderDetail = {}
      })
      .catch(() => {
        showToast(t('order_not_created'), 'error')
      })
  }
}

// All prices
const totalCartProductsPrice = computed(
  () => orderCartStore.cart?.detail?.product_price
)

watch(
  () => orderCartStore.orderDetail,
  (val) => {
    if (
      val?.promo_code_id ||
      val?.address?.id ||
      val?.use_from_balance ||
      !val.use_from_balance
    ) {
      orderCartStore.getCartDetailConfirm({
        promo_code_id: val.promo_code_id,
        address_id: val.address?.id,
        is_use_balance: val?.use_from_balance,
      })
    }
  },
  { immediate: true, deep: true }
)
onMounted(() => {
  if (!orderCartStore.orderDetail.address.id) {
    router.push(`/${locale.value}/cart`)
  }
})
</script>

<style scoped></style>
