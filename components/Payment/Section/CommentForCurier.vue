<template>
  <PaymentCardInfo
    icon="SvgoProfileMessage"
    icon-class="!text-blue-100 !text-2xl"
    :title="$t('courier_comment')"
    @open-details="openModal = true"
  />
  <ModalCommentForCurier v-model="openModal" />
</template>

<script setup lang="ts">
const openModal = ref(false)
</script>

<style scoped></style>
