<template>
  <PaymentCardInfo
    icon="SvgoProfileClockLocation"
    icon-class="text-purple-500 !text-2xl"
    text-wrapper-class="!border-gray-200"
    :title="
      whenDelivery ? dayjs(whenDelivery).format('HH:mm') : $t('when_delivery')
    "
    @open-details="modalStore.autoOrderModel.whenToDelivery = true"
  />
  <AutoOrderModalClock
    v-model="modalStore.autoOrderModel.whenToDelivery"
    :show-free-delivery="showFreeDelivery"
    @open-saved-address="backToName"
  />
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

import { useCartOrderStore } from '~/store/cart_order.js'
import { useModalStore } from '~/store/modal.js'

interface Props {
  showFreeDelivery?: boolean
}

defineProps<Props>()

const modalStore = useModalStore()
const orderCartStore = useCartOrderStore()

const whenDelivery = computed(() => {
  return orderCartStore.autoOrderDetail?.when_to_deliver
})

const backToName = () => {
  modalStore.autoOrderModel.whenToDelivery = false
  modalStore.autoOrderModel.name = true
}
</script>

<style scoped></style>
