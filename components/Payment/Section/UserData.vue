<template>
  <PaymentCardInfo
    icon="SvgoProfileUserCircle"
    icon-class="text-teal-700 !text-2xl"
    :title="userData?.length > 10 ? userData : $t('recipient_details')"
    @open-details="modalStore.userModel = true"
  />
  <OrderInfoEditUserInfo
    v-model="modalStore.userModel"
    :default-info="user"
    @save="saveUser"
  />
</template>

<script setup lang="ts">
import { useCartOrderStore } from '~/store/cart_order.js'
import { useModalStore } from '~/store/modal.js'

const modalStore = useModalStore()
const orderCartStore = useCartOrderStore()

const user = computed(() => {
  return {
    full_name: orderCartStore.orderDetail?.full_name,
    phone: orderCartStore.orderDetail?.phone,
  }
})

function saveUser(data: any) {
  orderCartStore.orderDetail.full_name = data.full_name
  orderCartStore.orderDetail.phone = data.phone
}

const userData = computed(
  () =>
    orderCartStore.orderDetail?.full_name +
    ', +998 ' +
    orderCartStore.orderDetail?.phone
)
</script>

<style scoped></style>
