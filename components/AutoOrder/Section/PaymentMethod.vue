<template>
  <section class="space-y-2">
    <PaymentCardInfo
      :icon="paymentIcon"
      :icon-class="`${paymentIconClass} !text-2xl`"
      text-wrapper-class="!border-gray-200"
      :title="paymentTitle"
      @open-details="modalStore.autoOrderModel.payment = true"
    />
  </section>
  <AutoOrderModalPaymentMethod v-model="modalStore.autoOrderModel.payment" />
</template>

<script setup lang="ts">
import { useCartOrderStore } from '~/store/cart_order.js'
import { useModalStore } from '~/store/modal.js'

const { t } = useI18n()

const modalStore = useModalStore()

const orderCartStore = useCartOrderStore()

const payment = computed(() => orderCartStore.autoOrderDetail.payment_method)

const paymentIcon = computed(() => {
  return payment.value?.card_to_courier
    ? 'SvgoProfileUser'
    : payment.value?.card_id
    ? 'SvgoProfileCard'
    : payment.value?.provider_id
    ? 'SvgoProfileCoins'
    : 'SvgoProfileMoney'
})

const paymentIconClass = computed(() => {
  return payment.value?.cash
    ? '!text-green'
    : payment.value?.card_id
    ? '!text-blue-100'
    : '!text-orange'
})

const paymentTitle = computed(() => {
  return payment.value?.cash
    ? t('cash')
    : payment.value?.card_to_courier
    ? t('courier_card')
    : payment.value?.card_id
    ? t('credit_card')
    : payment.value?.provider_id
    ? payment.value?.provider_id === 17
      ? 'Click'
      : 'Payme'
    : t('payment_method')
})
</script>
