<template>
  <LayoutWrapper v-if="useMobile('desktop')">
    <template #right>
      <section class="space-y-5">
        <CartCardFreeDelivery :cart-total-price="totalCartProductsPrice" />
        <CartCardPriceInfo />
        <AutoOrderCard v-if="isPremiumUser" @change="isAutoOrder = $event" />
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
        <AutoOrderCard v-if="isPremiumUser" @change="isAutoOrder = $event" />
        <BaseButton
          class="w-full !rounded-10"
          :text="isAutoOrder ? $t('save_auto_order') : $t('payment')"
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
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'

import { useCustomToast } from '~/composables/useCustomToast.js'
import { useAuthStore } from '~/store/auth.js'
import { useCartStore } from '~/store/cart.js'
import { useCartOrderStore } from '~/store/cart_order.js'

const isAutoOrder = ref(false)

const { t, locale } = useI18n()
const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const orderCartStore = useCartOrderStore()

const isPremiumUser = computed(() => authStore.user?.is_premium)
const orderDetail = computed(() => orderCartStore.orderDetail)
const autoOrderDetail = computed(() => orderCartStore.autoOrderDetail)
const loading = computed(
  () => orderCartStore.orderCreating || orderCartStore.autoOrderCreating
)

const { showToast } = useCustomToast()

const goToPayment = () => {
  if (isAutoOrder.value) {
    orderCartStore
      .createAutoOrder({
        name: autoOrderDetail.value.name,
        weekdays: [autoOrderDetail.value.weekday],
        delivery_time: dayjs(autoOrderDetail.value.when_to_deliver).format(
          'HH:mm'
        ),
        payment_type: autoOrderDetail.value.payment_method,
        card_id: autoOrderDetail.value.payment_method.card_id,
        shipping_address: {
          address_id: orderDetail.value.id,
          latitude: null,
          longitude: null,
        },
        recipient: orderDetail.value.recipient,
        products: computed(() => cartStore.products).value?.map((product) => ({
          product_id: product?.id,
          count: product?.quantity,
        })),
      })
      .then(() => {
        showToast(t('auto_order_created'), 'success')
        orderCartStore.cartClear()
        router.push(`/${locale.value}/profile/auto-order`)
        orderCartStore.orderDetail = {}
        orderCartStore.autoOrderDetail = {}
      })
      .catch(() => {
        showToast(t('order_not_created'), 'error')
      })
  } else {
    orderCartStore
      .createOrder({
        ...orderDetail.value,
        when_to_deliver: orderDetail.value.when_to_deliver,
      })
      .then((res: any) => {
        showToast(t('order_created'), 'success')
        cartStore.getCartProducts()
        router.push(`/${locale.value}/profile/orders/${res.order_id}`)
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

// watch(
//   () => orderCartStore.orderDetail,
//   (val) => {
//     if (
//       val?.promo_code_id ||
//       val?.address?.id ||
//       val?.use_from_balance ||
//       !val.use_from_balance
//     ) {
//       orderCartStore.getCartDetailConfirm({
//         promo_code_id: val.promo_code_id,
//         address_id: val.address?.id,
//         is_use_balance: val?.use_from_balance,
//       })
//     }
//   },
//   { immediate: true, deep: true }
// )
onMounted(() => {
  // if (!orderCartStore.orderDetail.id) {
  //   router.push(`/${locale.value}/cart`)
  // }
})

onMounted(() => {
  if (useCookie('order_data').value) {
    useCartOrderStore().orderDetail = useCookie('order_data').value
    isAutoOrder.value = useCartOrderStore().orderDetail.isAuto
  }
})

watch(
  () => useCartOrderStore().orderDetail,
  (val) => {
    useCookie('order_data').value = val
  },
  {
    deep: true,
  }
)
</script>

<style scoped></style>
