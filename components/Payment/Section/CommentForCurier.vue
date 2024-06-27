<template>
  <PaymentCardInfo
    icon="SvgoProfileMessage"
    icon-class="!text-blue-100 !text-2xl"
    :title="comment ?? $t('courier_comment')"
    @open-details="modalStore.commentModel = true"
  />
  <OrderInfoEditComment
    v-model="modalStore.commentModel"
    :default-info="{ comment_to_courier: comment }"
    @save="saveComment"
  />
</template>

<script setup lang="ts">
import { useCartOrderStore } from '~/store/cart_order.js'
import { useModalStore } from '~/store/modal.js'

const modalStore = useModalStore()
const orderCartStore = useCartOrderStore()

const comment = computed(() => orderCartStore.orderDetail?.comment_to_courier)

function saveComment(data: any) {
  orderCartStore.orderDetail.comment_to_courier = data.comment_to_courier
}
</script>
