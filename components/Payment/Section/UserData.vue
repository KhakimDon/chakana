<template>
  <PaymentCardInfo
    icon="SvgoProfileUserCircle"
    icon-class="text-teal-700 !text-2xl"
    :title="userData?.length > 5 ? userData : $t('recipient_details')"
    @open-details="openModal = true"
  />
  <ModalUserData v-model="openModal" />
</template>

<script setup lang="ts">
import { useCartOrderStore } from '~/store/cart_order.js'

const openModal = ref(false)

const orderCartStore = useCartOrderStore()

const userData = computed(
  () =>
    orderCartStore.orderDetail.recipient.name +
    ', +998 ' +
    orderCartStore.orderDetail.recipient.phone
)
</script>

<style scoped></style>
