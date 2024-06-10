<template>
  <PaymentCardInfo
    icon="SvgoProfileTruck"
    icon-class="text-orange !text-2xl"
    :title="$t('courier_address')"
    :subtitle="selectedLocation?.address"
    @open-details="openModal = true"
  />
  <CommonModalAddressDelivery
    v-model="openModal"
    :list="list"
    @select-address="selectedAddress"
    @close="openModal = false"
    @open-map-modal="openMapModal"
  />
  <CommonModalMap
    v-model="openMapModalRef"
    @close="openSavedAddress"
    @open-saved-adress="openSavedAddress"
  />
</template>

<script setup lang="ts">
import { useCartOrderStore } from '~/store/cart_order.js'

const openModal = ref(false)
const openMapModalRef = ref(false)
const selectedLocation = ref()

const orderCartStore = useCartOrderStore()
const selectedAddress = (address: object) => {
  selectedLocation.value = address
  orderCartStore.orderDetail.address.id = address?.id
}
const { list, resetList } = useListFetcher(`/saved/address`, 25, false, '')

const openMapModal = () => {
  openModal.value = false
  openMapModalRef.value = true
}

const openSavedAddress = () => {
  openMapModalRef.value = false
  openModal.value = true
  resetList()
}
</script>

<style scoped></style>
