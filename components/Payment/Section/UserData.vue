<template>
  <PaymentCardInfo
    icon="SvgoProfileUserCircle"
    icon-class="text-teal-700 !text-2xl"
    :title="'Машрабов Яхъё, +998 71 200 70 07'"
    @open-details="openModal = true"
  />
  <ModalUserData v-model="openModal" />
</template>

<script setup lang="ts">
const openModal = ref(false)
</script>

<style scoped></style>
