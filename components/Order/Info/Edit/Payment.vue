<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('payment_method')"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <OrderInfoFormPayment :form />
    <BaseButton
      class="!py-3 w-full !mt-6"
      :text="$t('save')"
      size="md"
      @click="handlePayment"
    />
  </BaseModal>
</template>
<script setup lang="ts">
interface Props {
  modelValue: boolean
  defaultInfo?: any
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', value: any): void
}>()

const form = useForm(
  {
    card_to_courier: false,
    cash: false,
    card_id: 0,
    balance: false,
  },
  {}
)

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      form.values.card_to_courier = props.defaultInfo.card_to_courier
      form.values.cash = props.defaultInfo.cash
      form.values.card_id = props.defaultInfo.card_id
      form.values.balance = props.defaultInfo.balance
    }
  }
)

function handlePayment() {
  emit('update:modelValue', false)
  emit('save', form.values)
}
</script>
