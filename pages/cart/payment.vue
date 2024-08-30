<template>
  <LayoutWrapper v-if="useMobile('desktop')">
    <template #right>
      <section class="space-y-5">
        <CartCardFreeDelivery :cart-total-price="totalCartProductsPrice" />
        <CartCardPriceInfo />
        <AutoOrderCard v-if="isPremiumUser" @change="isAutoOrder = $event" />
        <BaseButton
          class="w-full !rounded-10 !py-2"
          :text="$t(isAutoOrder ? 'save_auto_order' : 'order')"
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
          :text="isAutoOrder ? $t('save_auto_order') : $t('order')"
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
import { useModalStore } from '~/store/modal.js'

const { t, locale } = useI18n()
const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const orderCartStore = useCartOrderStore()

const isPremiumUser = computed(() => authStore.user?.is_premium)
const orderDetail = computed(() => orderCartStore.orderDetail)
const loading = computed(
  () => orderCartStore.orderCreating || orderCartStore.autoOrderCreating
)
const isAutoOrder = computed(() => orderCartStore.orderDetail?.isAuto)

const { showToast } = useCustomToast()

const goToPayment = () => {
  if (isAutoOrder.value) {
    if (!useAuthStore().user?.is_premium) {
      useModalStore().premiumModel = true
      return
    }
    orderCartStore
      .createAutoOrder({
        name: orderDetail.value.name,
        // weekdays: [orderDetail.value.weekdays],
        delivery_times: orderDetail.value.delivery_times.map((el) => {
          return {
            ...el,
            delivery_time: el.delivery_time.substring(0, 5),
          }
        }),
        // delivery_times
        payment_type: {
          balance: orderDetail.value.balance,
          // card_to_courier: orderDetail.value.card_to_courier,
          cash: orderDetail.value.cash,
          card_id: orderDetail.value.card_id,
          provider_id: orderDetail.value.provider_id,
        },
        products: cartStore.products?.map((product) => ({
          product_id: product?.id,
          count: product?.quantity,
        })),
        shipping_address: {
          address_id: orderDetail.value.id,
          latitude: null,
          longitude: null,
        },
        recipient: {
          full_name: orderDetail.value.full_name,
          phone: orderDetail.value.phone,
        },
        comment_to_picker: orderDetail.value.comment_to_courier,
        comment_to_courier: orderDetail.value.picker_comment,
      })
      .then((res) => {
        if (res.redirect) window.location.href = res.payment_url
        else {
          showToast(t('auto_order_created'), 'success')
          orderCartStore.cartClear()
          router.push(`/${locale.value}/profile/auto-order`)
          orderCartStore.orderDetail = {}
          orderCartStore.autoOrderDetail = {}
        }
      })
      .catch(() => {
        showToast(t('order_not_created'), 'error')
      })
  } else {
    const now = dayjs()
    orderCartStore
      .createOrder({
        address: {
          id: orderDetail.value.id,
          latitude: null,
          longitude: null,
        },
        when_to_deliver:
          orderDetail.value.when_to_deliver === 'nearest_half_hour'
            ? getCurrentDateTimeISO(now.add(30, 'minutes'))
            : orderDetail.value.when_to_deliver,
        recipient: {
          full_name: orderDetail.value.full_name,
          phone: orderDetail.value.phone,
        },
        comment_to_courier: orderDetail.value.comment_to_courier,
        comment_to_picker: orderDetail.value.picker_comment,
        payment_method: {
          balance: orderDetail.value.balance,
          // card_to_the_courier: orderDetail.value.card_to_courier,
          cash: orderDetail.value.cash,
          card_id: orderDetail.value.card_id,
          provider_id: orderDetail.value.provider_id,
        },
        promo_code_id: orderDetail.value.promo_code_id || 0,
        use_from_balance: orderDetail.value.balance,
      })
      .then((res: any) => {
        if (res.redirect) window.location.href = res.payment_url
        else {
          showToast(t('order_created'), 'success')
          cartStore.getCartProducts()
          router.push(`/${locale.value}/profile/order/${res.order_id}`)
          orderCartStore.orderDetail = {}
        }
      })
      .catch((error: any) => {
        showToast(error?.detail?.detail ?? t('order_not_created'), 'error')
      })
  }
}

function getCurrentDateTimeISO(date: any) {
  return date.format().slice(0, -6)
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
