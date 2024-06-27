<template>
  <PaymentCardInfoHeader :title="$t('payment_method')">
    <section class="space-y-2">
      <PaymentCardInfo
        icon="SvgoProfileMoney"
        icon-class="text-green !text-2xl"
        :title="
          payment?.cash
            ? $t('cash')
            : payment?.card_to_courier
            ? $t('courier_card')
            : payment?.card_id
            ? $t('credit_card')
            : $t('payment_method')
        "
        @open-details="modalStore.paymentModel = true"
      />
    </section>
  </PaymentCardInfoHeader>
  <OrderInfoEditPayment
    v-model="modalStore.paymentModel"
    :default-info="orderCartStore.orderDetail"
    @save="savePayment"
  />
</template>

<script setup lang="ts">
import { useCartOrderStore } from '~/store/cart_order.js'
import { useModalStore } from '~/store/modal.js'

const modalStore = useModalStore()

const orderCartStore = useCartOrderStore()

const payment = computed(() => orderCartStore.orderDetail)

function savePayment(data: any) {
  console.log(data)
  orderCartStore.orderDetail.card_to_courier = data.card_to_courier
  orderCartStore.orderDetail.cash = data.cash
  orderCartStore.orderDetail.card_id = data.card_id
}
</script>

<style scoped></style>
