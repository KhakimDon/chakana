<template>
  <PaymentCardInfoHeader :title="$t('payment_method')">
    <section class="space-y-2">
      <PaymentCardInfo
        icon="SvgoProfileMoney"
        icon-class="text-green !text-2xl"
        :title="$t('payment_method')"
        @open-details="openModal = true"
      />
    </section>
  </PaymentCardInfoHeader>
  <ModalPaymentMethod v-model="openModal" />
</template>

<script setup lang="ts">
const openModal = ref(false)
</script>

<style scoped></style>
