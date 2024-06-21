<template>
  <PaymentCardInfo
    icon="SvgoProfileMessage"
    icon-class="!text-blue-100 !text-2xl"
    :title="comment ? comment : $t('courier_comment')"
    @open-details="modalStore.commentModel = true"
  />
  <PaymentModalCommentForCurier v-model="modalStore.commentModel" />
</template>

<script setup lang="ts">
import { useCartOrderStore } from '~/store/cart_order.js'
import { useModalStore } from '~/store/modal.js'

const modalStore = useModalStore()
const orderCartStore = useCartOrderStore()

const comment = computed(() => orderCartStore.orderDetail.comment_to_courier)
</script>
<style scoped></style>
