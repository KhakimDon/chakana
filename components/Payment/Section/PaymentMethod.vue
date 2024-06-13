<template>
  <PaymentCardInfoHeader :title="$t('payment_method')">
    <section class="space-y-2">
      <PaymentCardInfo
        icon="SvgoProfileMoney"
        icon-class="text-green !text-2xl"
        :title="
          payment?.cash
            ? $t('cash')
            : payment.card_to_the_courier
            ? $t('courier_card')
            : payment.card_id
            ? $t('credit_card')
            : $t('payment_method')
        "
        @open-details="openModal = true"
      />
    </section>
  </PaymentCardInfoHeader>
  <CommonModalPaymentMethod v-model="openModal" />
</template>

<script setup lang="ts">
import { useCartOrderStore } from '~/store/cart_order.js'

const openModal = ref(false)

const orderCartStore = useCartOrderStore()

const payment = computed(() => orderCartStore.orderDetail.payment_method)
</script>

<style scoped></style>
