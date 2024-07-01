<template>
  <PaymentCardInfo
    :icon="paymentIcon"
    :icon-class="`${paymentIconClass} !text-2xl`"
    :title="paymentTitle"
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

const { t } = useI18n()

const showEdit = ref(false)

const payment = computed(() => props.defaultData)

const paymentIcon = computed(() => {
  return payment.value?.card_to_courier
    ? 'SvgoProfileUser'
    : payment.value?.card_id
    ? 'SvgoProfileCard'
    : payment.value?.provider_id
    ? 'SvgoProfileCoins'
    : 'SvgoProfileMoney'
})

const paymentIconClass = computed(() => {
  return payment.value?.cash
    ? '!text-green'
    : payment.value?.card_id
    ? '!text-blue-100'
    : '!text-orange'
})

const paymentTitle = computed(() => {
  return payment.value?.cash
    ? t('cash')
    : payment.value?.card_to_courier
    ? t('courier_card')
    : payment.value?.card_id
    ? t('credit_card')
    : payment.value?.provider_id
    ? payment.value?.provider_id === 17
      ? 'Click'
      : 'Payme'
    : t('payment_method')
})
</script>
