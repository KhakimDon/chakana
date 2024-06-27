<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('promo_code')"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <OrderInfoFormPromocode :form />
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
    promo_code_id: '',
  },
  {}
)

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      form.values.promo_code_id = props.defaultInfo.promo_code_id
    }
  }
)

function handlePayment() {
  emit('update:modelValue', false)
  emit('save', form.values)
}
</script>
