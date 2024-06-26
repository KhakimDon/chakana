<script setup lang="ts">
interface Props {
  modelValue: boolean
}
defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', value: any): void
}>()

const form = useForm({
  id: '',
})

function handleAddress() {
  emit('update:modelValue', false)
  emit('save', form.values)
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('address_delivery')"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <OrderInfoFormAddress :form />
    <BaseButton
      class="!py-3 w-full !mt-6"
      :text="$t('save')"
      size="md"
      @click="handleAddress"
    />
  </BaseModal>
</template>
