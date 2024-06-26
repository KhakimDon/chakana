<template>
  <PaymentCardInfo
    icon="SvgoProfileTruck"
    icon-class="text-orange !text-2xl"
    :title="$t('courier_address')"
    :subtitle="defaultAddress?.address"
    @open-details="showEdit = true"
  />
  <OrderInfoEditAddress v-model="showEdit" @save="saveAddress" />
</template>

<script setup lang="ts">
import { useCartOrderStore } from '~/store/cart_order.js'
import { useModalStore } from '~/store/modal.js'

const showEdit = ref(false)

const orderCartStore = useCartOrderStore()
const defaultAddress = computed(() => {
  orderCartStore.orderDetail.address_info
})

function saveAddress(data: any) {
  orderCartStore.orderDetail.address_info = data.address_info
  orderCartStore.orderDetail.id = data.address_info.id
  console.log(data)
}

const route = useRoute()
const { locale } = useI18n()
const modalStore = useModalStore()
const selectedLocation = ref()

const selectedAddress = (address: object) => {
  if (address) {
    selectedLocation.value = address
  } else {
    // selectedLocation.value = list.value[0]
  }
  orderCartStore.orderDetail.id = selectedLocation.value?.id
  modalStore.addressModel = false
  if (
    route.path !== `/${locale.value}/cart/payment` ||
    route.path !== `/${locale.value}/cart/payment/`
  ) {
    modalStore.addressMapModel = false
    console.log(route.query?.order)
    console.log(route.query?.order === 'auto')
    if (route.query?.order === 'auto') {
      modalStore.autoOrderModel.whenToDelivery = true
    } else {
      modalStore.clockModel = true
    }
  }
}
</script>
