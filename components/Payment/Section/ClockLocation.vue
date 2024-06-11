<template>
  <PaymentCardInfo
    icon="SvgoProfileClockLocation"
    icon-class="text-purple-500 !text-2xl"
    :title="
      whenDelivery
        ? dayjs(whenDelivery).format('DD.MM.YYYY HH:mm')
        : $t('when_delivery')
    "
    @open-details="openModal = true"
  />
  <ModalClock v-model="openModal" :show-free-delivery="showFreeDelivery" />
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

import { useCartOrderStore } from '~/store/cart_order.js'

interface Props {
  showFreeDelivery?: boolean
}

defineProps<Props>()
const openModal = ref(false)

const orderCartStore = useCartOrderStore()

const whenDelivery = computed(() => {
  return orderCartStore.orderDetail.when_to_deliver
})
</script>

<style scoped></style>
