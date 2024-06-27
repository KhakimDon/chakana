<template>
  <PaymentCardInfoHeader :title="$t('payment_method')">
    <section class="space-y-2">
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
            : $t('payment_method')
        "
        @open-details="showEdit = true"
      />
    </section>
  </PaymentCardInfoHeader>
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
