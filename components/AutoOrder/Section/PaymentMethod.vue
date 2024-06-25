<template>
  <section class="space-y-2">
    <PaymentCardInfo
      icon="SvgoProfileMoney"
      icon-class="text-green !text-2xl"
      text-wrapper-class="!border-gray-200"
      :title="
        payment?.cash
          ? $t('cash')
          : payment.card_to_the_courier
          ? $t('courier_card')
          : payment.card_id
          ? $t('credit_card')
          : $t('payment_method')
      "
      @open-details="modalStore.autoOrderModel.payment = true"
    />
  </section>
  <AutoOrderModalPaymentMethod v-model="modalStore.autoOrderModel.payment" />
</template>

<script setup lang="ts">
import { useCartOrderStore } from '~/store/cart_order.js'
import { useModalStore } from '~/store/modal.js'

const modalStore = useModalStore()

const orderCartStore = useCartOrderStore()

const payment = computed(() => orderCartStore.autoOrderDetail.payment_method)
</script>
<style scoped></style>
