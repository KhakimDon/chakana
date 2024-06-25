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
    @handle-address="selectedAddress"
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
const { locale } = useI18n()
const modalStore = useModalStore()
const selectedLocation = ref()

const orderCartStore = useCartOrderStore()
const selectedAddress = (address: object) => {
  if (address) {
    selectedLocation.value = address
  } else {
    selectedLocation.value = list.value[0]
  }
  orderCartStore.orderDetail.address.id = selectedLocation.value?.id
  modalStore.addressModel = false
  if (route.path !== `/${locale.value}/cart/payment`) {
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

watch(
  () => list.value,
  (val) => {
    if (val?.length) {
      selectedLocation.value = val.find(
        (item) => item.id === orderCartStore.orderDetail.address.id
      )
    }
  }
)
</script>

<style scoped></style>
