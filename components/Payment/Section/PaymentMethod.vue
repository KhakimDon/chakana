<template>
  <PaymentCardInfo
    icon="SvgoProfileMoney"
    icon-class="text-green !text-2xl"
    :title="
      payment?.cash
        ? $t('cash')
        : payment?.card_to_courier
        ? $t('courier_card')
        : payment?.card_id
        ? $t('credit_card')
        : payment?.provider_id
        ? payment?.provider_id === 17
          ? 'Click'
          : 'Payme'
        : $t('payment_method')
    "
    @open-details="showEdit = true"
  />
  <OrderInfoEditPayment
    v-model="showEdit"
    :default-info="defaultData"
    @save="$emit('save', $event)"
  />
</template>

<script setup lang="ts">
interface Props {
  defaultData: any
}
const props = defineProps<Props>()

interface Emits {
  (e: 'save', data: any): void
}
defineEmits<Emits>()

const showEdit = ref(false)

const payment = computed(() => props.defaultData)
</script>

<style scoped></style>
