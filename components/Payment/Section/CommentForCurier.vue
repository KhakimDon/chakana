<template>
  <PaymentCardInfo
    icon="SvgoProfileMessage"
    icon-class="!text-blue-100 !text-2xl"
    :title="comment ? comment : $t('courier_comment')"
    @open-details="openModal = true"
  />
  <ModalCommentForCurier v-model="openModal" />
</template>

<script setup lang="ts">
import { useCartOrderStore } from '~/store/cart_order.js'

const openModal = ref(false)
const orderCartStore = useCartOrderStore()

const comment = computed(() => orderCartStore.orderDetail.comment_to_courier)
</script>
<style scoped></style>
