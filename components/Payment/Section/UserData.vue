<template>
  <PaymentCardInfo
    icon="SvgoProfileUserCircle"
    icon-class="text-teal-700 !text-2xl"
    :title="$t('recipient_details')"
    @open-details="openModal = true"
  />
  <ModalUserData v-model="openModal" />
</template>

<script setup lang="ts">
const openModal = ref(false)
</script>

<style scoped></style>
