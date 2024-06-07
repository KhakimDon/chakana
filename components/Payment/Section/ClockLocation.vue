<template>
  <PaymentCardInfo
    icon="SvgoProfileClockLocation"
    icon-class="text-purple-500 !text-2xl"
    :title="$t('location_change_range')"
    @open-details="openModal = true"
  />
  <ModalClock v-model="openModal" :show-free-delivery="showFreeDelivery" />
</template>

<script setup lang="ts">
interface Props {
  showFreeDelivery?: boolean
}

defineProps<Props>()
const openModal = ref(false)
</script>

<style scoped></style>
