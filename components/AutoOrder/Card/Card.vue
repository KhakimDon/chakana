<template>
  <section class="space-y-4">
    <div class="bg-white-100 rounded-xl space-y-3 py-3 px-4">
      <div class="flex items-center justify-between">
        <p>{{ $t('auto_order') }}</p>
        <FormToggle
          v-model="orderCartStore.orderDetail.isAuto"
          class="text-2xl"
          @change="toggleAutoOrder"
        />
      </div>
      <CollapseTransition name="fade" mode="out-in">
        <div v-if="orderCartStore.orderDetail.isAuto">
          <!--          <PaymentSectionAddress />-->
          <PaymentSectionOrderName
            :default-info="orderCartStore.orderDetail"
            text-wrapper-class="!border-gray-200"
            @save="saveOrderName"
          />
          <PaymentSectionClockLocation
            :default-info="orderCartStore.orderDetail"
            is-auto
            @save="saveOrderClock"
          />
          <PaymentSectionPaymentMethod
            :default-data="orderCartStore.orderDetail"
            @save="savePayment"
          />
        </div>
      </CollapseTransition>
    </div>
  </section>
</template>

<script setup lang="ts">
import CollapseTransition from '@ivanv/vue-collapse-transition/src/CollapseTransition.vue'

import { useCartOrderStore } from '~/store/cart_order.js'

const emit = defineEmits(['change'])

const orderCartStore = useCartOrderStore()

const toggleAutoOrder = () => {
  orderCartStore.orderDetail.isAuto = !orderCartStore.orderDetail.isAuto
  emit('change', orderCartStore.orderDetail.isAuto)
}

function saveOrderName(data: any) {
  orderCartStore.orderDetail.name = data.name
}

function savePayment(data: any) {
  orderCartStore.orderDetail.card_to_courier = data.card_to_courier
  orderCartStore.orderDetail.cash = data.cash
  orderCartStore.orderDetail.card_id = data.card_id
}

function saveOrderClock(data: any) {
  orderCartStore.orderDetail.delivery_time = data.delivery_time
  orderCartStore.orderDetail.weekdays = data.weekdays
}
</script>
