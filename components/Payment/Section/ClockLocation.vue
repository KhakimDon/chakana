<template>
  <PaymentCardInfo
    icon="SvgoProfileClockLocation"
    icon-class="text-purple-500 !text-2xl"
    :title="
      whenDelivery
        ? dayjs(whenDelivery).format('DD.MM.YYYY HH:mm')
        : $t('when_delivery')
    "
    @open-details="modalStore.clockModel = true"
  />
  <PaymentModalClock
    v-model="modalStore.clockModel"
    :show-free-delivery="false"
    @open-saved-address="backToAddress"
  />
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

import { useCartOrderStore } from '~/store/cart_order.js'
import { useModalStore } from '~/store/modal.js'

const modalStore = useModalStore()
const orderCartStore = useCartOrderStore()

const whenDelivery = computed(() => {
  return orderCartStore.orderDetail.delivery_time
})

const backToAddress = () => {
  modalStore.clockModel = false
  modalStore.addressModel = true
}
</script>

<style scoped></style>
