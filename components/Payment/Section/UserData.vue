<template>
  <PaymentCardInfo
    icon="SvgoProfileUserCircle"
    icon-class="text-teal-700 !text-2xl"
    :title="userData?.length > 10 ? userData : $t('recipient_details')"
    @open-details="modalStore.userModel = true"
  />
  <PaymentModalUserData v-model="modalStore.userModel" />
</template>

<script setup lang="ts">
import { useCartOrderStore } from '~/store/cart_order.js'
import { useModalStore } from '~/store/modal.js'

const modalStore = useModalStore()
const orderCartStore = useCartOrderStore()

const userData = computed(
  () =>
    orderCartStore.orderDetail.recipient.full_name +
    ', +998 ' +
    orderCartStore.orderDetail.recipient.phone
)
</script>

<style scoped></style>
