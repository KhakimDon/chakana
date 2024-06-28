<template>
  <PaymentCardInfo
    icon="SvgoProfileTruck"
    icon-class="text-orange !text-2xl"
    :title="$t('courier_address')"
    :subtitle="defaultAddress?.address"
    @open-details="showEdit = true"
  />
  <OrderInfoEditAddress
    v-model="showEdit"
    :default-id="defaultAddress?.id"
    @save="$emit('save', $event)"
  />
</template>

<script setup lang="ts">
interface Props {
  defaultAddress: any
}
defineProps<Props>()

interface Emits {
  (e: 'save', data: any): void
}
defineEmits<Emits>()

const showEdit = ref(false)
</script>
