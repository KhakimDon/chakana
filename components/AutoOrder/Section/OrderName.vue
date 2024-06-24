<template>
  <PaymentCardInfo
    icon="SvgoCommonEdit"
    icon-class="text-purple-500 !text-2xl"
    :title="$t('auto_order_title')"
    :subtitle="name"
    text-wrapper-class="!border-gray-200"
    @open-details="modalStore.autoOrderModel.name = true"
  />
  <AutoOrderModalOrderName v-model="modalStore.autoOrderModel.name" />
</template>

<script setup lang="ts">
import { useCartOrderStore } from '~/store/cart_order.js'
import { useModalStore } from '~/store/modal.js'

const modalStore = useModalStore()
const orderCartStore = useCartOrderStore()

const name = computed(() => orderCartStore.autoOrderDetail.name)
</script>

<style scoped></style>
