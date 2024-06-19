<template>
  <PaymentCardInfo
    icon="SvgoProfileTruck"
    icon-class="text-orange !text-2xl"
    :title="$t('courier_address')"
    :subtitle="selectedLocation?.address"
    @open-details="openSavedAddress"
  />
  <CommonModalAddressDelivery
    v-model="modalStore.addressModel"
    :list="list"
    @select-address="selectedAddress"
    @close="modalStore.addressModel = false"
    @open-map-modal="openMapModal"
  />
  <CommonModalMap
    v-model="modalStore.addressMapModel"
    @close="openSavedAddress"
    @open-saved-adress="openSavedAddress"
  />
</template>

<script setup lang="ts">
import { useCartOrderStore } from '~/store/cart_order.js'
import { useModalStore } from '~/store/modal.js'

const route = useRoute()
const modalStore = useModalStore()
const selectedLocation = ref()

const orderCartStore = useCartOrderStore()
const selectedAddress = (address: object) => {
  selectedLocation.value = address
  orderCartStore.orderDetail.address.id = address?.id
  if (route.path !== '/cart/payment') {
    modalStore.addressModel = false
    modalStore.addressMapModel = false
    modalStore.clockModel = true
  }
}
const { list, resetList } = useListFetcher(`/saved/address`, 25, false, '')

const openMapModal = () => {
  modalStore.addressModel = false
  modalStore.addressMapModel = true
}

const openSavedAddress = () => {
  modalStore.addressMapModel = false
  modalStore.addressModel = true
  resetList()
}
</script>

<style scoped></style>
